
package com.example.openaitest.file.service;

import com.example.openaitest.file.model.UserFile;
import com.example.openaitest.file.repository.UserFileRepository;
import com.example.openaitest.user.model.User;

import jakarta.persistence.EntityManager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserFileService {
    public static final int MAX_FILES_PER_TYPE = 2;

    @Autowired
    private UserFileRepository userFileRepository;

    @Autowired
    private AWSS3Service awsS3Service;

    @Autowired
    private EntityManager entityManager;

    /**
     * 파일 삭제 - 파일 타입에 따라 다른 제약조건 적용
     */
    @Transactional
    public void deleteFile(Long fileId, User user) {
        UserFile userFile = userFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("파일을 찾을 수 없습니다."));

        // 사용자 확인
        if (!userFile.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("권한이 없습니다.");
        }

        // 파일 타입에 따라 다른 삭제 로직 적용
        switch (userFile.getFileType()) {
            case "CONVERSATION":
                // 대화 파일은 퀴즈/영작 연습에서 참조 가능하므로 참조 확인 후 삭제
                deleteConversationFile(userFile);
                break;

            case "WRITING_EXERCISE":
            case "QUIZ":
                // 영작 연습/퀴즈 파일은 바로 삭제 가능
                deleteNonConversationFile(userFile);
                break;

            default:
                throw new RuntimeException("알 수 없는 파일 타입입니다.");
        }
    }

    /**
     * 대화 파일 삭제 - 참조 확인 후 진행
     */
    @Transactional
    private void deleteConversationFile(UserFile userFile) {
        Long fileId = userFile.getId();

        // 1. 이 파일을 참조하는 퀴즈가 있는지 확인
        boolean hasQuizReference = checkQuizReference(fileId);

        // 2. 이 파일을 참조하는 영작 연습이 있는지 확인
        boolean hasWritingReference = checkWritingExerciseReference(fileId);

        // 3. 참조가 있으면 삭제 불가
        if (hasQuizReference || hasWritingReference) {
            StringBuilder errorMsg = new StringBuilder("이 대화 파일은 ");

            if (hasQuizReference && hasWritingReference) {
                errorMsg.append("퀴즈와 영작 연습에서 ");
            } else if (hasQuizReference) {
                errorMsg.append("퀴즈에서 ");
            } else {
                errorMsg.append("영작 연습에서 ");
            }

            errorMsg.append("사용 중이므로 삭제할 수 없습니다. 먼저 관련 퀴즈/영작 연습을 삭제해주세요.");

            throw new RuntimeException(errorMsg.toString());
        }

        // 4. 참조가 없으면 삭제 진행
        try {
            // S3에서 먼저 삭제
            awsS3Service.deleteFile(userFile.getS3Key());

            // DB에서 삭제
            userFileRepository.delete(userFile);
        } catch (Exception e) {
            throw new RuntimeException("파일 삭제 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    /**
     * 영작 연습/퀴즈 파일 삭제 - 바로 진행
     */
    @Transactional
    private void deleteNonConversationFile(UserFile userFile) {
        try {
            // S3에서 먼저 삭제
            awsS3Service.deleteFile(userFile.getS3Key());

            // DB에서 삭제
            userFileRepository.delete(userFile);
        } catch (Exception e) {
            throw new RuntimeException("파일 삭제 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    /**
     * 퀴즈 참조 확인
     */
    private boolean checkQuizReference(Long fileId) {
        Long count = (Long) entityManager.createQuery(
                "SELECT COUNT(q) FROM Quiz q WHERE q.userFile.id = :fileId")
                .setParameter("fileId", fileId)
                .getSingleResult();

        return count > 0;
    }

    /**
     * 영작 연습 참조 확인
     */
    private boolean checkWritingExerciseReference(Long fileId) {
        Long count = (Long) entityManager.createQuery(
                "SELECT COUNT(w) FROM WritingExercise w WHERE w.userFile.id = :fileId")
                .setParameter("fileId", fileId)
                .getSingleResult();

        return count > 0;
    }

    /**
     * 사용자 파일 삭제 (관리자용)
     */
    @Transactional
    public void deleteFileByAdmin(Long fileId) {
        UserFile userFile = userFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("파일을 찾을 수 없습니다."));

        // S3에서 파일 삭제
        try {
            awsS3Service.deleteFile(userFile.getS3Key());
        } catch (Exception e) {
            // S3 삭제 실패는 로그만 남기고 진행
            System.err.println("S3 파일 삭제 실패: " + e.getMessage());
        }

        // DB에서 파일 정보 삭제
        userFileRepository.delete(userFile);
    }

    @Transactional
    public UserFile saveFile(User user, String fileName, String fileType, String s3Key, Long fileSize) {
        System.out.println("SaveFile 메소드 호출 - 사용자: " + user.getEmail() + ", 파일 타입: " + fileType);

        // 오디오 파일 타입들 (MP3, SCRIPT_AUDIO)을 그룹화
        boolean isAudioFile = "MP3".equals(fileType) || "SCRIPT_AUDIO".equals(fileType);

        List<UserFile> existingFiles;

        if (isAudioFile) {
            // 모든 오디오 파일 타입을 함께 조회 (MP3와 SCRIPT_AUDIO 모두)
            List<UserFile> mp3Files = userFileRepository.findByUserAndFileTypeOrderByCreatedAtDesc(user, "MP3");
            List<UserFile> scriptAudioFiles = userFileRepository.findByUserAndFileTypeOrderByCreatedAtDesc(user,
                    "SCRIPT_AUDIO");

            // 두 리스트 합치기
            existingFiles = new ArrayList<>();
            existingFiles.addAll(mp3Files);
            existingFiles.addAll(scriptAudioFiles);

            // 날짜순으로 정렬 (최신순)
            existingFiles.sort((f1, f2) -> f2.getCreatedAt().compareTo(f1.getCreatedAt()));

            System.out.println("현재 오디오 파일 총 개수: " + existingFiles.size() +
                    " (MP3: " + mp3Files.size() + ", SCRIPT_AUDIO: " + scriptAudioFiles.size() + ")");
        } else {
            // 일반 파일 타입 (오디오가 아닌 경우) - 기존 로직 적용
            existingFiles = userFileRepository.findByUserAndFileTypeOrderByCreatedAtDesc(user, fileType);
            System.out.println("현재 " + fileType + " 타입 파일 개수: " + existingFiles.size());
        }

        // 이미 최대 개수에 도달했는지 확인 (새 파일 저장 전)
        if (existingFiles.size() >= MAX_FILES_PER_TYPE) {
            System.out.println("파일 개수 제한 도달 - 저장 전 가장 오래된 파일 삭제");

            // 가장 오래된 파일 찾기 (이미 최신순으로 정렬됨)
            UserFile oldestFile = existingFiles.get(existingFiles.size() - 1);

            try {
                // S3에서 삭제
                awsS3Service.deleteFile(oldestFile.getS3Key());
                System.out.println(
                        "S3에서 가장 오래된 파일 삭제 완료 - 타입: " + oldestFile.getFileType() + ", ID: " + oldestFile.getId());

                // DB에서 삭제
                userFileRepository.delete(oldestFile);
                System.out.println("DB에서 가장 오래된 파일 삭제 완료");

                // 목록에서도 제거
                existingFiles.remove(existingFiles.size() - 1);
            } catch (Exception e) {
                System.err.println("가장 오래된 파일 삭제 중 오류: " + e.getMessage());
                e.printStackTrace();
            }
        }

        // 새 파일 생성 및 저장
        UserFile newFile = UserFile.builder()
                .user(user)
                .fileName(fileName)
                .fileType(fileType)
                .s3Key(s3Key)
                .fileSize(fileSize)
                .build();

        UserFile savedFile = userFileRepository.save(newFile);
        System.out.println("새 파일 저장 완료 - 타입: " + fileType + ", ID: " + savedFile.getId());

        // 오디오 파일인 경우 다시 한번 개수 확인 (이중 검증)
        if (isAudioFile) {
            List<UserFile> mp3Files = userFileRepository.findByUserAndFileTypeOrderByCreatedAtDesc(user, "MP3");
            List<UserFile> scriptAudioFiles = userFileRepository.findByUserAndFileTypeOrderByCreatedAtDesc(user,
                    "SCRIPT_AUDIO");

            System.out.println("저장 후 오디오 파일 총 개수: " + (mp3Files.size() + scriptAudioFiles.size()) +
                    " (MP3: " + mp3Files.size() + ", SCRIPT_AUDIO: " + scriptAudioFiles.size() + ")");

            // 여전히 총 개수가 제한을 초과하면 추가 삭제
            if (mp3Files.size() + scriptAudioFiles.size() > MAX_FILES_PER_TYPE) {
                System.out.println("추가 검증: 총 오디오 파일 개수가 여전히 제한 초과 - 추가 삭제 필요");

                // 두 리스트 합치기
                List<UserFile> allAudioFiles = new ArrayList<>();
                allAudioFiles.addAll(mp3Files);
                allAudioFiles.addAll(scriptAudioFiles);

                // 날짜순으로 정렬 (최신순)
                allAudioFiles.sort((f1, f2) -> f2.getCreatedAt().compareTo(f1.getCreatedAt()));

                // 최대 개수를 초과하는 오래된 파일들 삭제
                for (int i = MAX_FILES_PER_TYPE; i < allAudioFiles.size(); i++) {
                    UserFile fileToDelete = allAudioFiles.get(i);
                    try {
                        awsS3Service.deleteFile(fileToDelete.getS3Key());
                        userFileRepository.delete(fileToDelete);
                        System.out.println(
                                "추가 파일 삭제 완료 - 타입: " + fileToDelete.getFileType() + ", ID: " + fileToDelete.getId());
                    } catch (Exception e) {
                        System.err.println("추가 파일 삭제 중 오류: " + e.getMessage());
                    }
                }
            }
        }

        return savedFile;
    }

    // 파일 타입별 조회
    public List<UserFile> getUserFilesByType(User user, String fileType) {
        return userFileRepository.findByUserAndFileTypeOrderByCreatedAtDesc(user, fileType);
    }

    // 파일 타입별 갯수 제한 확인 및 초과시 오래된 파일 삭제
    @Transactional
    public void checkAndRemoveOldFiles(User user, String fileType) {
        List<UserFile> existingFiles = userFileRepository.findByUserAndFileTypeOrderByCreatedAtDesc(user, fileType);
        if (existingFiles.size() >= MAX_FILES_PER_TYPE) {
            // 최신 파일 MAX_FILES_PER_TYPE개만 남기고 나머지(오래된 파일)는 삭제
            List<UserFile> filesToDelete = existingFiles.subList(
                    Math.max(0, MAX_FILES_PER_TYPE - 1), existingFiles.size());

            for (UserFile file : filesToDelete) {
                awsS3Service.deleteFile(file.getS3Key());
                userFileRepository.delete(file);
            }
        }
    }

    // 사용자의 파일 목록 조회
    public List<UserFile> getUserFiles(User user) {
        return userFileRepository.findByUserOrderByCreatedAtDesc(user);
    }

    // 만료된 파일 삭제
    @Transactional
    public void cleanExpiredFiles() {
        LocalDateTime now = LocalDateTime.now();
        List<UserFile> expiredFiles = userFileRepository.findByExpireAtBefore(now);

        if (!expiredFiles.isEmpty()) {
            List<String> keysToDelete = expiredFiles.stream()
                    .map(UserFile::getS3Key)
                    .collect(Collectors.toList());

            awsS3Service.deleteExpiredFiles(keysToDelete);
            userFileRepository.deleteAll(expiredFiles);
        }
    }

    // 특정 파일 다운로드
    public byte[] downloadFile(Long fileId, User user) {
        UserFile userFile = userFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("파일을 찾을 수 없습니다."));

        // 사용자 확인
        if (!userFile.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("권한이 없습니다.");
        }

        return awsS3Service.downloadFile(userFile.getS3Key());
    }

    // ID로 파일 조회
    public Optional<UserFile> findById(Long id) {
        return userFileRepository.findById(id);
    }

    @Transactional
    public void deleteFileFromBoth(Long fileId) {
        UserFile file = userFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("파일을 찾을 수 없습니다: " + fileId));

        try {
            // S3에서 파일 삭제
            awsS3Service.deleteFile(file.getS3Key());
            System.out.println("S3에서 파일 삭제 완료: " + file.getS3Key());
        } catch (Exception e) {
            System.err.println("S3 파일 삭제 실패: " + e.getMessage());
            // S3 삭제 실패해도 DB에서는 삭제 진행
        }

        // DB에서 파일 정보 삭제
        userFileRepository.delete(file);
        System.out.println("DB에서 파일 정보 삭제 완료: " + fileId);
    }
}