package com.example.openaitest.pdf.service;

import com.example.openaitest.chat.dto.response.ChatResponse;
import com.example.openaitest.quiz.model.Quiz;
import com.example.openaitest.quiz.model.QuizQuestion;
import com.example.openaitest.script.dto.response.ScriptTranslateResponse;
import com.example.openaitest.writing.model.WritingExercise;
import com.example.openaitest.writing.service.OpenAIWritingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.itextpdf.text.pdf.draw.LineSeparator;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import org.apache.commons.io.IOUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.*;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PDFService {

    private static final String FONT_PATH = "static/font/NanumGothic-Regular.ttf";
    private static final String CHINESE_FONT_PATH = "static/font/NotoSansSC-VariableFont_wght.ttf";
    private static final String ARABIC_FONT_PATH = "static/font/NotoSansArabic-Regular.ttf";

    /**
     * 영작 연습 PDF 생성
     */
    public byte[] generateWritingExercisePdf(WritingExercise exercise,
            List<OpenAIWritingService.WritingQuestion> questions,
            String targetLanguage,
            String sourceLanguage) {
        try {
            Document document = new Document(PageSize.A4);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfWriter writer = PdfWriter.getInstance(document, outputStream);

            document.open();

            // 폰트 로드 수정
            InputStream koreanFontStream = PDFService.class.getResourceAsStream("/static/font/NanumGothic-Regular.ttf");
            byte[] koreanFontBytes = IOUtils.toByteArray(koreanFontStream);
            BaseFont koreanFont = BaseFont.createFont("NanumGothic-Regular.ttf",
                    BaseFont.IDENTITY_H,
                    BaseFont.EMBEDDED,
                    false, koreanFontBytes, null);

            // 폰트 설정
            Font titleFont = new Font(koreanFont, 24, Font.BOLD, BaseColor.WHITE);
            Font sectionFont = new Font(koreanFont, 16, Font.BOLD, BaseColor.WHITE);
            Font contentFont = new Font(koreanFont, 12, Font.NORMAL, BaseColor.BLACK);
            Font hintFont = new Font(koreanFont, 10, Font.ITALIC, BaseColor.GRAY);

            // 헤더 추가
            PdfPTable header = new PdfPTable(1);
            header.setWidthPercentage(100);

            // exercise가 null일 경우 기본값 사용
            String title = exercise != null ? exercise.getTitle() : "영작 연습";

            PdfPCell headerCell = new PdfPCell(new Phrase("영작 연습: " + title, titleFont));
            headerCell.setBackgroundColor(new BaseColor(70, 130, 180));
            headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            headerCell.setPadding(10);
            headerCell.setBorder(Rectangle.NO_BORDER);
            header.addCell(headerCell);

            document.add(header);
            document.add(Chunk.NEWLINE);

            // 가이드라인 추가
            document.add(new Paragraph("이 영작 연습은 " + sourceLanguage + "에서 " + targetLanguage +
                    "로 번역하는 연습을 제공합니다.", contentFont));

            // exercise가 null일 경우 기본값 사용
            String difficulty = exercise != null ? exercise.getDifficulty() : "medium";
            document.add(new Paragraph("난이도: " + getDifficultyInKorean(difficulty), contentFont));
            document.add(Chunk.NEWLINE);

            // 연습 문제 섹션 추가
            addSectionHeader(document, "영작 연습 문제", sectionFont);

            for (int i = 0; i < questions.size(); i++) {
                OpenAIWritingService.WritingQuestion question = questions.get(i);

                // 문제 번호와 원본 문장 (source language)
                Paragraph questionPara = new Paragraph((i + 1) + ". " + question.getSourceText(), contentFont);
                document.add(questionPara);

                // 영작 공간 (밑줄)
                PdfPTable lineTable = new PdfPTable(1);
                lineTable.setWidthPercentage(100);

                PdfPCell lineCell = new PdfPCell(new Phrase(" "));
                lineCell.setBorderWidthBottom(1f);
                lineCell.setBorderWidthTop(0);
                lineCell.setBorderWidthLeft(0);
                lineCell.setBorderWidthRight(0);
                lineCell.setPaddingBottom(20f); // 쓰기 공간
                lineCell.setBorderColorBottom(BaseColor.LIGHT_GRAY);
                lineTable.addCell(lineCell);

                document.add(lineTable);

                // 난이도에 따른 힌트 제공
                if (question.getHint() != null && !question.getHint().isEmpty()) {
                    Paragraph hintPara = new Paragraph("힌트: " + question.getHint(), hintFont);
                    document.add(hintPara);
                }

                document.add(Chunk.NEWLINE);
            }

            // 정답 섹션 (새 페이지에)
            document.newPage();
            addSectionHeader(document, "정답", sectionFont);

            for (int i = 0; i < questions.size(); i++) {
                OpenAIWritingService.WritingQuestion question = questions.get(i);

                document.add(new Paragraph((i + 1) + ". " + question.getSourceText(), contentFont));
                document.add(new Paragraph("   정답: " + question.getTargetText(), contentFont));

                if (question.getExplanation() != null && !question.getExplanation().isEmpty()) {
                    document.add(new Paragraph("   설명: " + question.getExplanation(), hintFont));
                }

                document.add(Chunk.NEWLINE);
            }

            // 푸터 추가
            document.add(Chunk.NEWLINE);
            Paragraph footer = new Paragraph("© LingEdge 영작 연습 도우미", contentFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            return outputStream.toByteArray();

        } catch (Exception e) {
            // 오류 로깅 추가
            e.printStackTrace();
            throw new RuntimeException("영작 연습 PDF 생성 오류", e);
        }
    }

    // PDFService.java에 추가

    public byte[] generateScriptAnalysisPdf(String originalScript,
            String scriptLanguage,
            String translationLanguage,
            List<ScriptTranslateResponse.ScriptParagraphAnalysis> analyses) {
        try {
            Document document = new Document(PageSize.A4);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfWriter writer = PdfWriter.getInstance(document, outputStream);

            document.open();

            // 폰트 로드 수정
            InputStream koreanFontStream = PDFService.class.getResourceAsStream("/static/font/NanumGothic-Regular.ttf");
            byte[] koreanFontBytes = IOUtils.toByteArray(koreanFontStream);
            BaseFont baseFont = BaseFont.createFont("NanumGothic-Regular.ttf",
                    BaseFont.IDENTITY_H,
                    BaseFont.EMBEDDED,
                    false, koreanFontBytes, null);

            // 폰트 설정
            Font titleFont = new Font(baseFont, 24, Font.BOLD, BaseColor.WHITE);
            Font sectionFont = new Font(baseFont, 16, Font.BOLD, BaseColor.WHITE);
            Font contentFont = new Font(baseFont, 12, Font.NORMAL, BaseColor.BLACK);
            Font highlightFont = new Font(baseFont, 12, Font.BOLD, new BaseColor(70, 130, 180));
            Font italicFont = new Font(baseFont, 12, Font.ITALIC, BaseColor.DARK_GRAY);

            // 헤더 추가
            PdfPTable header = new PdfPTable(1);
            header.setWidthPercentage(100);

            PdfPCell headerCell = new PdfPCell(new Phrase(
                    scriptLanguage + " to " + translationLanguage + " 스크립트 분석", titleFont));
            headerCell.setBackgroundColor(new BaseColor(70, 130, 180));
            headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            headerCell.setPadding(10);
            headerCell.setBorder(Rectangle.NO_BORDER);
            header.addCell(headerCell);

            document.add(header);
            document.add(Chunk.NEWLINE);

            // 각 문단 분석 추가
            for (int i = 0; i < analyses.size(); i++) {
                ScriptTranslateResponse.ScriptParagraphAnalysis analysis = analyses.get(i);

                // 문단 번호
                Paragraph paraNum = new Paragraph("문단 " + (i + 1), sectionFont);
                document.add(paraNum);

                // 원본 텍스트
                document.add(new Paragraph("원문:", highlightFont));
                document.add(new Paragraph(analysis.getOriginalText(), contentFont));
                document.add(Chunk.NEWLINE);

                // 번역
                document.add(new Paragraph("번역:", highlightFont));
                document.add(new Paragraph(analysis.getTranslation(), contentFont));
                document.add(Chunk.NEWLINE);

                // 요약
                document.add(new Paragraph("요약:", highlightFont));
                document.add(new Paragraph(analysis.getSummary(), italicFont));
                document.add(Chunk.NEWLINE);

                // 어휘 및 숙어
                document.add(new Paragraph("어휘 및 숙어:", highlightFont));

                if (analysis.getVocabulary() != null && !analysis.getVocabulary().isEmpty()) {
                    PdfPTable vocabTable = new PdfPTable(4);
                    vocabTable.setWidthPercentage(100);

                    // 테이블 헤더
                    PdfPCell wordHeader = new PdfPCell(new Phrase("단어/숙어", contentFont));
                    PdfPCell meaningHeader = new PdfPCell(new Phrase("의미", contentFont));
                    PdfPCell pronHeader = new PdfPCell(new Phrase("발음", contentFont));
                    PdfPCell exampleHeader = new PdfPCell(new Phrase("예문", contentFont));

                    for (PdfPCell cell : new PdfPCell[] { wordHeader, meaningHeader, pronHeader, exampleHeader }) {
                        cell.setBackgroundColor(new BaseColor(240, 240, 240));
                        cell.setPadding(5);
                    }

                    vocabTable.addCell(wordHeader);
                    vocabTable.addCell(meaningHeader);
                    vocabTable.addCell(pronHeader);
                    vocabTable.addCell(exampleHeader);

                    // 어휘 항목 추가
                    for (ScriptTranslateResponse.VocabularyItem item : analysis.getVocabulary()) {
                        vocabTable.addCell(new PdfPCell(new Phrase(item.getWord(), contentFont)));
                        vocabTable.addCell(new PdfPCell(new Phrase(item.getMeaning(), contentFont)));
                        vocabTable.addCell(new PdfPCell(new Phrase(item.getPronunciation(), contentFont)));
                        vocabTable.addCell(new PdfPCell(new Phrase(item.getExample(), contentFont)));
                    }

                    document.add(vocabTable);
                } else {
                    document.add(new Paragraph("(어휘 정보 없음)", italicFont));
                }

                document.add(Chunk.NEWLINE);

                // 예상 질문
                document.add(new Paragraph("예상 질문:", highlightFont));
                if (analysis.getExpectedQuestions() != null) {
                    for (int q = 0; q < analysis.getExpectedQuestions().size(); q++) {
                        document.add(
                                new Paragraph((q + 1) + ". " + analysis.getExpectedQuestions().get(q), contentFont));
                    }
                }
                document.add(Chunk.NEWLINE);

                // 예상 답변
                document.add(new Paragraph("예상 답변:", highlightFont));
                if (analysis.getExpectedAnswers() != null) {
                    for (int a = 0; a < analysis.getExpectedAnswers().size(); a++) {
                        document.add(new Paragraph((a + 1) + ". " + analysis.getExpectedAnswers().get(a), contentFont));
                    }
                }
                document.add(Chunk.NEWLINE);

                // 문단 구분선 (마지막 문단이 아닌 경우)
                if (i < analyses.size() - 1) {
                    document.add(new LineSeparator());
                    document.add(Chunk.NEWLINE);
                }
            }

            // 푸터 추가
            Paragraph footer = new Paragraph("© LingEdge 스크립트 분석 도우미", contentFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            return outputStream.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("스크립트 분석 PDF 생성 오류", e);
        }
    }

    // 난이도 한글 표시 변환
    private String getDifficultyInKorean(String difficulty) {
        if (difficulty == null)
            return "중간";

        switch (difficulty.toLowerCase()) {
            case "easy":
                return "쉬움";
            case "hard":
                return "어려움";
            default:
                return "중간";
        }
    }

    public byte[] generateQuizPdf(Quiz quiz, List<QuizQuestion> questions) {
        try {
            Document document = new Document(PageSize.A4);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfWriter writer = PdfWriter.getInstance(document, outputStream);

            document.open();

            // 폰트 로드 수정
            InputStream koreanFontStream = PDFService.class.getResourceAsStream("/static/font/NanumGothic-Regular.ttf");
            byte[] koreanFontBytes = IOUtils.toByteArray(koreanFontStream);
            BaseFont koreanFont = BaseFont.createFont("NanumGothic-Regular.ttf",
                    BaseFont.IDENTITY_H,
                    BaseFont.EMBEDDED,
                    false, koreanFontBytes, null);

            // 폰트 설정
            Font titleFont = new Font(koreanFont, 24, Font.BOLD, BaseColor.WHITE);
            Font sectionFont = new Font(koreanFont, 16, Font.BOLD, BaseColor.WHITE);
            Font contentFont = new Font(koreanFont, 12, Font.NORMAL, BaseColor.BLACK);
            Font questionFont = new Font(koreanFont, 12, Font.BOLD, BaseColor.BLACK);
            Font optionFont = new Font(koreanFont, 12, Font.NORMAL, BaseColor.BLACK);
            Font answerFont = new Font(koreanFont, 12, Font.BOLD, new BaseColor(46, 125, 50));

            // 헤더 추가
            PdfPTable header = new PdfPTable(1);
            header.setWidthPercentage(100);

            PdfPCell headerCell = new PdfPCell(new Phrase(quiz.getTitle() + " - 퀴즈", titleFont));
            headerCell.setBackgroundColor(new BaseColor(70, 130, 180));
            headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            headerCell.setPadding(10);
            headerCell.setBorder(Rectangle.NO_BORDER);
            header.addCell(headerCell);

            document.add(header);
            document.add(Chunk.NEWLINE);

            // 문제 섹션 추가
            addSectionHeader(document, "문제 (" + questions.size() + "문제)", sectionFont);

            int questionNum = 1;
            for (QuizQuestion question : questions) {
                // 문제 텍스트
                Paragraph questionPara = new Paragraph(
                        questionNum + ". " + question.getQuestionText(), questionFont);
                document.add(questionPara);
                document.add(Chunk.NEWLINE);

                // 문제 유형에 따라 선택지 또는 답란 추가
                if ("MULTIPLE_CHOICE".equals(question.getQuestionType())) {
                    // 객관식 선택지 추가
                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        List<String> options = mapper.readValue(
                                question.getOptions(),
                                mapper.getTypeFactory().constructCollectionType(List.class, String.class));

                        char optionChar = 'A';
                        for (String option : options) {
                            Paragraph optionPara = new Paragraph(
                                    "   " + optionChar + ") " + option, optionFont);
                            document.add(optionPara);
                            optionChar++;
                        }
                    } catch (Exception e) {
                        document.add(new Paragraph("선택지 로드 오류", contentFont));
                    }
                } else {
                    // 주관식 답란 추가
                    document.add(new Paragraph("답: ________________________________", contentFont));
                }

                document.add(Chunk.NEWLINE);
                document.add(Chunk.NEWLINE);

                questionNum++;
            }

            // 정답표 섹션 추가
            document.newPage(); // 새 페이지에 정답표 추가
            addSectionHeader(document, "정답표", sectionFont);

            // 정답표 생성
            PdfPTable answerTable = new PdfPTable(3);
            answerTable.setWidthPercentage(100);

            // 테이블 너비 비율 설정
            float[] columnWidths = { 1f, 4f, 3f };
            answerTable.setWidths(columnWidths);

            // 테이블 헤더 추가
            PdfPCell numHeader = new PdfPCell(new Phrase("번호", questionFont));
            PdfPCell questionHeader = new PdfPCell(new Phrase("문제", questionFont));
            PdfPCell answerHeader = new PdfPCell(new Phrase("정답", questionFont));

            // 헤더 셀 스타일 설정
            BaseColor headerColor = new BaseColor(240, 240, 240);
            for (PdfPCell cell : new PdfPCell[] { numHeader, questionHeader, answerHeader }) {
                cell.setBackgroundColor(headerColor);
                cell.setPadding(5);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            }

            answerTable.addCell(numHeader);
            answerTable.addCell(questionHeader);
            answerTable.addCell(answerHeader);

            // 정답 행 추가
            questionNum = 1;
            for (QuizQuestion question : questions) {
                PdfPCell numCell = new PdfPCell(new Phrase(String.valueOf(questionNum), contentFont));
                numCell.setHorizontalAlignment(Element.ALIGN_CENTER);

                PdfPCell questionCell = new PdfPCell(new Phrase(question.getQuestionText(), contentFont));

                // 정답 처리
                String answerText = question.getCorrectAnswer();
                if ("MULTIPLE_CHOICE".equals(question.getQuestionType())) {
                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        List<String> options = mapper.readValue(
                                question.getOptions(),
                                mapper.getTypeFactory().constructCollectionType(List.class, String.class));

                        // 정답 텍스트 찾기
                        int index = options.indexOf(answerText);
                        if (index >= 0) {
                            char optionChar = (char) ('A' + index);
                            answerText = optionChar + ") " + answerText;
                        }
                    } catch (Exception e) {
                        // 예외 처리 - 원본 정답 텍스트 유지
                    }
                }

                PdfPCell answerCell = new PdfPCell(new Phrase(answerText, answerFont));

                // 셀 패딩 설정
                numCell.setPadding(5);
                questionCell.setPadding(5);
                answerCell.setPadding(5);

                answerTable.addCell(numCell);
                answerTable.addCell(questionCell);
                answerTable.addCell(answerCell);

                questionNum++;
            }

            document.add(answerTable);

            // 푸터 추가
            document.add(Chunk.NEWLINE);
            Paragraph footer = new Paragraph("본 퀴즈는 자동 생성되었습니다. © LingEdge", contentFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            return outputStream.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("퀴즈 PDF 생성 오류", e);
        }
    }

    // 섹션 헤더 추가 메서드
    private void addSectionHeader(Document document, String title, Font titleFont) throws DocumentException {
        PdfPTable sectionHeader = new PdfPTable(1);
        sectionHeader.setWidthPercentage(100);

        PdfPCell sectionCell = new PdfPCell(new Phrase(title, titleFont));
        sectionCell.setBackgroundColor(new BaseColor(70, 130, 180));
        sectionCell.setPadding(5);
        sectionCell.setBorder(Rectangle.NO_BORDER);
        sectionHeader.addCell(sectionCell);

        document.add(sectionHeader);
        document.add(Chunk.NEWLINE);
    }

    public byte[] generatePDF(ChatResponse chatResponse) throws DocumentException, IOException {
        System.out.println("PDF 생성 시작");
        System.out.println("학습 언어: " + chatResponse.getLearningLanguage());
        System.out.println("번역 언어: " + chatResponse.getTranslationLanguage());

        // 번역 언어에 따른 라벨을 가져옵니다.
        Map<String, String> labels = getLabels(chatResponse.getTranslationLanguage());

        // 중복 제거
        String cleanConversation = removeDuplicateConversation(chatResponse.getConversation());
        String cleanTranslation = removeDuplicateConversation(chatResponse.getTranslation());

        // 단어 추출 - 형광펜으로 표시할 단어들
        List<String> vocabularyWords = extractVocabularyWords(chatResponse.getVocabulary());
        System.out.println("추출된 단어 목록: " + vocabularyWords);

        // 어휘 정보 구문 분석 (단어, 발음, 의미)
        List<VocabularyItem> vocabularyItems = parseVocabularyItems(chatResponse.getVocabulary(),
                chatResponse.getLearningLanguage(),
                chatResponse.getTranslationLanguage());

        // 문서 설정
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter writer = PdfWriter.getInstance(document, outputStream);

        // 아랍어인 경우 전체 문서 방향 설정
        boolean isArabic = "Arabic".equals(chatResponse.getLearningLanguage()) ||
                "Arabic".equals(chatResponse.getTranslationLanguage());
        if (isArabic) {
            writer.setRunDirection(PdfWriter.RUN_DIRECTION_RTL);
        }

        document.open();

        try {
            // 폰트 로드 - 언어에 따라 적절한 폰트 사용
            BaseFont koreanFont;
            if ("Chinese".equals(chatResponse.getTranslationLanguage())) {
                // 중국어 폰트 로드 수정
                InputStream chineseFontStream = PDFService.class
                        .getResourceAsStream("/static/font/NotoSansSC-VariableFont_wght.ttf");
                byte[] chineseFontBytes = IOUtils.toByteArray(chineseFontStream);
                koreanFont = BaseFont.createFont("NotoSansSC-VariableFont_wght.ttf",
                        BaseFont.IDENTITY_H,
                        BaseFont.EMBEDDED,
                        false, chineseFontBytes, null);
                System.out.println("중국어 폰트 사용");
            } else if ("Arabic".equals(chatResponse.getTranslationLanguage())) {
                // 아랍어 폰트 로드
                InputStream arabicFontStream = PDFService.class
                        .getResourceAsStream("/static/font/NotoSansArabic-Regular.ttf");
                byte[] arabicFontBytes = IOUtils.toByteArray(arabicFontStream);
                koreanFont = BaseFont.createFont("NotoSansArabic-Regular.ttf",
                        BaseFont.IDENTITY_H,
                        BaseFont.EMBEDDED,
                        false, arabicFontBytes, null);
                System.out.println("아랍어 폰트 사용");
            } else {
                // 기본 한글 폰트 로드 수정
                InputStream koreanFontStream = PDFService.class
                        .getResourceAsStream("/static/font/NanumGothic-Regular.ttf");
                byte[] koreanFontBytes = IOUtils.toByteArray(koreanFontStream);
                koreanFont = BaseFont.createFont("NanumGothic-Regular.ttf",
                        BaseFont.IDENTITY_H,
                        BaseFont.EMBEDDED,
                        false, koreanFontBytes, null);
                System.out.println("기본 폰트 사용");
            }

            // 폰트 설정
            Font titleFont = new Font(koreanFont, 24, Font.BOLD, BaseColor.WHITE);
            Font sectionFont = new Font(koreanFont, 16, Font.BOLD, BaseColor.WHITE);
            Font contentFont = new Font(koreanFont, 12, Font.NORMAL, BaseColor.BLACK);
            Font footerFont = new Font(koreanFont, 10, Font.ITALIC, BaseColor.GRAY);
            Font tableHeaderFont = new Font(koreanFont, 12, Font.BOLD, BaseColor.WHITE);
            Font tableCellFont = new Font(koreanFont, 11, Font.NORMAL, BaseColor.BLACK);

            // 헤더 추가
            PdfPTable header = new PdfPTable(1);
            header.setWidthPercentage(100);

            PdfPCell headerCell = new PdfPCell(new Phrase(labels.get("title"), titleFont));
            headerCell.setBackgroundColor(new BaseColor(70, 130, 180));
            headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            headerCell.setPadding(10);
            headerCell.setBorder(Rectangle.NO_BORDER);
            if (isArabic) {
                headerCell.setRunDirection(PdfWriter.RUN_DIRECTION_RTL);
            }
            header.addCell(headerCell);

            document.add(header);
            document.add(Chunk.NEWLINE);

            // 날짜 추가
            Paragraph datePara = new Paragraph(labels.get("date") + ": " + new Date().toString(), contentFont);
            if (isArabic) {
                datePara.setAlignment(Element.ALIGN_RIGHT);
            }
            document.add(datePara);
            document.add(Chunk.NEWLINE);

            // 대화 섹션 추가 (형광펜 효과 포함)
            addSectionHeader(document, labels.get("conversation"), sectionFont);

            if (isArabic) {
                // 아랍어를 위한 RTL 설정
                Paragraph rtlPara = new Paragraph(cleanConversation, contentFont);
                rtlPara.setAlignment(Element.ALIGN_RIGHT);

                // 아랍어 대화 내용을 직접 추가
                document.add(rtlPara);
                document.add(Chunk.NEWLINE);
            } else {
                // 일반적인 LTR 언어에 대한 처리 (기존 코드)
                applyHighlighting(document, cleanConversation, vocabularyWords, contentFont);
            }

            // 번역 섹션 추가
            addSectionHeader(document, labels.get("translation"), sectionFont);

            if (isArabic) {
                // 아랍어 번역을 위한 설정
                Paragraph rtlTransPara = new Paragraph(cleanTranslation, contentFont);
                rtlTransPara.setAlignment(Element.ALIGN_RIGHT);

                // 아랍어 번역 내용을 직접 추가
                document.add(rtlTransPara);
                document.add(Chunk.NEWLINE);
            } else {
                document.add(new Paragraph(cleanTranslation, contentFont));
            }
            document.add(Chunk.NEWLINE);

            // 단어 섹션 추가 (표 형식으로)
            addSectionHeader(document, labels.get("vocabulary"), sectionFont);

            // 어휘 테이블 생성 (3열: 단어, 발음, 뜻)
            PdfPTable vocabularyTable = new PdfPTable(3);
            vocabularyTable.setWidthPercentage(100);

            if (isArabic) {
                vocabularyTable.setRunDirection(PdfWriter.RUN_DIRECTION_RTL);
            }

            // 테이블 너비 비율 설정
            float[] columnWidths = { 1f, 1f, 3f }; // 단어:발음:뜻 = 1:1:3 비율
            vocabularyTable.setWidths(columnWidths);

            // 테이블 헤더 추가 - 이미지와 같은 블루 색상으로 설정
            PdfPCell wordHeader = new PdfPCell(new Phrase(labels.get("word"), tableHeaderFont));
            PdfPCell pronunciationHeader = new PdfPCell(new Phrase(labels.get("pronunciation"), tableHeaderFont));
            PdfPCell meaningHeader = new PdfPCell(new Phrase(labels.get("meaning"), tableHeaderFont));

            // 헤더 셀 스타일 설정 - 이미지와 같은 블루 색상으로 설정
            BaseColor headerColor = new BaseColor(100, 149, 237); // 이미지에 맞는 블루 색상
            for (PdfPCell cell : new PdfPCell[] { wordHeader, pronunciationHeader, meaningHeader }) {
                cell.setBackgroundColor(headerColor);
                cell.setPadding(5);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                cell.setBorderWidth(0.5f);
                cell.setBorderColor(BaseColor.WHITE);
                if (isArabic) {
                    cell.setRunDirection(PdfWriter.RUN_DIRECTION_RTL);
                }
            }

            vocabularyTable.addCell(wordHeader);
            vocabularyTable.addCell(pronunciationHeader);
            vocabularyTable.addCell(meaningHeader);

            // 어휘 항목 추가
            for (VocabularyItem item : vocabularyItems) {
                System.out.println("어휘 항목 추가 - 단어: " + item.getWord() + ", 발음: " + item.getPronunciation() + ", 의미: "
                        + item.getMeaning());

                PdfPCell wordCell = new PdfPCell(new Phrase(item.getWord(), tableCellFont));
                PdfPCell pronunciationCell = new PdfPCell(new Phrase(item.getPronunciation(), tableCellFont));
                PdfPCell meaningCell = new PdfPCell(new Phrase(item.getMeaning(), tableCellFont));

                // 셀 스타일 설정
                for (PdfPCell cell : new PdfPCell[] { wordCell, pronunciationCell, meaningCell }) {
                    cell.setPadding(5);
                    cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                    cell.setBorderWidth(0.5f);
                    cell.setBorderColor(new BaseColor(200, 200, 200)); // 연한 회색 테두리
                    cell.setBackgroundColor(BaseColor.WHITE); // 모든 행 배경색 흰색으로 통일
                    if (isArabic) {
                        cell.setRunDirection(PdfWriter.RUN_DIRECTION_RTL);
                        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                    } else {
                        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
                    }
                }

                vocabularyTable.addCell(wordCell);
                vocabularyTable.addCell(pronunciationCell);
                vocabularyTable.addCell(meaningCell);
            }

            document.add(vocabularyTable);
            document.add(Chunk.NEWLINE);

            // 푸터 추가
            Paragraph footer = new Paragraph(labels.get("footer"), footerFont);
            if (isArabic) {
                footer.setAlignment(Element.ALIGN_RIGHT);
            } else {
                footer.setAlignment(Element.ALIGN_CENTER);
            }
            document.add(footer);

        } catch (Exception e) {
            System.err.println("PDF 생성 중 오류 발생: " + e.getMessage());
            e.printStackTrace();

            // 폰트 로드 실패 시 기본 폰트로 대체
            BaseFont baseFont = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.EMBEDDED);
            Font defaultFont = new Font(baseFont, 12, Font.NORMAL, BaseColor.BLACK);

            // 간단한 내용만 추가
            document.add(new Paragraph("Error creating PDF with Korean font: " + e.getMessage(), defaultFont));
            document.add(new Paragraph("Conversation: " + cleanConversation, defaultFont));
        }

        document.close();

        System.out.println("PDF 생성 완료");
        return outputStream.toByteArray();
    }

    /**
     * 텍스트에 하이라이트 적용하는 메서드
     * 
     * @param document       PDF 문서
     * @param content        하이라이트할 텍스트 내용
     * @param highlightWords 하이라이트할 단어 목록
     * @param normalFont     기본 폰트
     * @throws DocumentException PDF 문서 예외
     */
    private void applyHighlighting(Document document, String content,
            List<String> highlightWords, Font normalFont)
            throws DocumentException {
        if (content == null || content.isEmpty()) {
            return;
        }

        try {
            Paragraph para = new Paragraph();
            para.setLeading(normalFont.getSize() * 1.5f);

            String remainingText = content;

            for (String word : highlightWords) {
                if (word == null || word.trim().isEmpty()) {
                    continue;
                }

                String lowerWord = word.toLowerCase();
                String lowerContent = remainingText.toLowerCase();
                int lastIndex = 0;
                boolean found = false;

                while (true) {
                    int wordIndex = lowerContent.indexOf(lowerWord, lastIndex);
                    if (wordIndex == -1)
                        break;

                    found = true;

                    // 단어 앞의 텍스트 추가
                    if (wordIndex > 0) {
                        para.add(new Chunk(remainingText.substring(0, wordIndex), normalFont));
                    }

                    // 단어 자체에 하이라이트 적용
                    String actualWord = remainingText.substring(wordIndex, wordIndex + word.length());
                    Chunk highlightedWord = new Chunk(actualWord, normalFont);
                    highlightedWord.setBackground(new BaseColor(255, 255, 0), 1, 1, 1, 1);
                    para.add(highlightedWord);

                    // 처리할 나머지 텍스트 업데이트
                    remainingText = remainingText.substring(wordIndex + word.length());
                    lowerContent = remainingText.toLowerCase();
                    lastIndex = 0;
                }

                if (!found) {
                    // 단어를 찾지 못했으면 다음 단어로 진행
                    continue;
                }
            }

            // 남은 텍스트가 있으면 추가
            if (!remainingText.isEmpty()) {
                para.add(new Chunk(remainingText, normalFont));
            }

            // 하이라이트를 적용한 단락 추가
            document.add(para);

        } catch (Exception e) {
            System.err.println("하이라이트 적용 중 오류 발생: " + e.getMessage());
            e.printStackTrace();

            // 오류 발생 시 원본 텍스트 추가
            document.add(new Paragraph(content, normalFont));
        }

        document.add(Chunk.NEWLINE);
    }

    /**
     * 번역 언어에 따른 라벨을 제공하는 메서드
     */
    private Map<String, String> getLabels(String translationLanguage) {
        Map<String, String> labels = new HashMap<>();

        switch (translationLanguage) {
            case "Arabic":
                labels.put("title", "جلسة تعلم اللغة");
                labels.put("date", "تاريخ");
                labels.put("conversation", "محادثة");
                labels.put("translation", "ترجمة");
                labels.put("vocabulary", "مفردات");
                labels.put("word", "كلمة");
                labels.put("pronunciation", "نطق");
                labels.put("meaning", "معنى");
                labels.put("footer", "تم إنشاؤه بواسطة مساعد تعلم اللغة");
                break;
            case "Korean":
                labels.put("title", "언어 학습 세션");
                labels.put("date", "날짜");
                labels.put("conversation", "대화");
                labels.put("translation", "번역");
                labels.put("vocabulary", "어휘");
                labels.put("word", "단어");
                labels.put("pronunciation", "발음");
                labels.put("meaning", "뜻");
                labels.put("footer", "언어 학습 도우미에서 생성됨");
                break;
            case "Japanese":
                labels.put("title", "ゲンゴガクシュウセッション"); // 言語学習セッション
                labels.put("date", "ヒヅケ"); // 日付
                labels.put("conversation", "カイワ"); // 会話
                labels.put("translation", "ホンヤク"); // 翻訳
                labels.put("vocabulary", "ゴイ"); // 語彙
                labels.put("word", "タンゴ"); // 単語
                labels.put("pronunciation", "ハツオン"); // 発音
                labels.put("meaning", "イミ"); // 意味
                labels.put("footer", "ゲンゴガクシュウアシスタントニヨッテセイセイ"); // 言語学習アシスタントによって生成
                break;
            case "Chinese":
                labels.put("title", "语言学习会话");
                labels.put("date", "日期");
                labels.put("conversation", "对话");
                labels.put("translation", "翻译");
                labels.put("vocabulary", "词汇");
                labels.put("word", "单词");
                labels.put("pronunciation", "发音");
                labels.put("meaning", "意思");
                labels.put("footer", "由语言学习助手生成");
                break;
            case "Spanish":
                labels.put("title", "Sesión de Aprendizaje de Idiomas");
                labels.put("date", "Fecha");
                labels.put("conversation", "Conversación");
                labels.put("translation", "Traducción");
                labels.put("vocabulary", "Vocabulario");
                labels.put("word", "Palabra");
                labels.put("pronunciation", "Pronunciación");
                labels.put("meaning", "Significado");
                labels.put("footer", "Generado por el Asistente de Aprendizaje de Idiomas");
                break;
            case "French":
                labels.put("title", "Session d'Apprentissage des Langues");
                labels.put("date", "Date");
                labels.put("conversation", "Conversation");
                labels.put("translation", "Traduction");
                labels.put("vocabulary", "Vocabulaire");
                labels.put("word", "Mot");
                labels.put("pronunciation", "Prononciation");
                labels.put("meaning", "Signification");
                labels.put("footer", "Généré par l'Assistant d'Apprentissage des Langues");
                break;
            case "German":
                labels.put("title", "Sprachlern-Sitzung");
                labels.put("date", "Datum");
                labels.put("conversation", "Gespräch");
                labels.put("translation", "Übersetzung");
                labels.put("vocabulary", "Vokabular");
                labels.put("word", "Wort");
                labels.put("pronunciation", "Aussprache");
                labels.put("meaning", "Bedeutung");
                labels.put("footer", "Erstellt vom Sprachlern-Assistenten");
                break;
            default: // English
                labels.put("title", "Language Learning Session");
                labels.put("date", "Date");
                labels.put("conversation", "Conversation");
                labels.put("translation", "Translation");
                labels.put("vocabulary", "Vocabulary");
                labels.put("word", "Word");
                labels.put("pronunciation", "Pronunciation");
                labels.put("meaning", "Meaning");
                labels.put("footer", "Generated by Language Learning Assistant");
                break;
        }

        return labels;
    }

    /**
     * 어휘 항목을 파싱하는 메서드
     * 단어, 발음, 의미를 모두 분리
     * 
     * @param vocabulary          어휘 텍스트
     * @param learningLanguage    학습 언어
     * @param translationLanguage 번역 언어
     * @return 파싱된 어휘 항목 목록
     */
    private List<VocabularyItem> parseVocabularyItems(String vocabulary, String learningLanguage,
            String translationLanguage) {
        List<VocabularyItem> items = new ArrayList<>();
        if (vocabulary == null || vocabulary.isEmpty()) {
            return items;
        }

        System.out.println("======== 어휘 파싱 시작 ========");
        System.out.println(vocabulary);
        System.out.println("================================");

        // 줄 단위로 분리
        String[] lines = vocabulary.split("\n");

        for (String line : lines) {
            line = line.trim();
            // 빈 줄이나 특정 텍스트 무시
            if (line.isEmpty() || line.contains("언어 학습 도우미에서 생성됨")) {
                continue;
            }

            try {
                // 숫자와 점으로 시작하는 부분 제거 (예: "1. ")
                if (line.matches("^\\d+\\..*")) {
                    int dotIndex = line.indexOf(".");
                    line = line.substring(dotIndex + 1).trim();
                }

                // 파이프로 분리
                String[] parts = line.split("\\|");

                if (parts.length >= 3) {
                    // 올바른 형식: "word | pronunciation | meaning"
                    String word = parts[0].trim();
                    String pronunciation = parts[1].trim();
                    String meaning = parts[2].trim();

                    System.out
                            .println("파싱 성공 - 단어: [" + word + "], 발음: [" + pronunciation + "], 의미: [" + meaning + "]");
                    items.add(new VocabularyItem(word, pronunciation, meaning));
                } else {
                    // 파이프가 없거나 충분하지 않은 경우, 공백으로 분리 시도
                    parts = line.split("\\s+");

                    if (parts.length >= 3) {
                        // 공백으로 구분된 경우: "word pronunciation meaning"
                        String word = parts[0];
                        // 두 번째와 세 번째 단어를 발음으로 간주
                        String pronunciation = parts[1];
                        // 나머지를 의미로 간주
                        StringBuilder meaning = new StringBuilder();
                        for (int i = 2; i < parts.length; i++) {
                            meaning.append(parts[i]).append(" ");
                        }

                        System.out.println("공백 분리 - 단어: [" + word + "], 발음: [" + pronunciation + "], 의미: ["
                                + meaning.toString().trim() + "]");
                        items.add(new VocabularyItem(word, pronunciation, meaning.toString().trim()));
                    } else if (parts.length == 2) {
                        // 두 개만 있는 경우: "word meaning"
                        System.out.println("두 부분만 있음 - 단어: [" + parts[0] + "], 의미: [" + parts[1] + "]");
                        items.add(new VocabularyItem(parts[0], "", parts[1]));
                    } else {
                        // 한 단어만 있는 경우
                        System.out.println("단일 단어 - [" + line + "]");
                        items.add(new VocabularyItem(line, "", ""));
                    }
                }
            } catch (Exception e) {
                System.err.println("파싱 오류: " + e.getMessage() + " (라인: " + line + ")");
                e.printStackTrace();
            }
        }

        System.out.println("파싱된 항목 수: " + items.size());

        // 파싱 결과 없으면 기본값 제공
        if (items.isEmpty() && !vocabulary.isEmpty()) {
            System.out.println("파싱 실패, 기본값 사용");
            items.add(new VocabularyItem("파싱 실패", "", vocabulary));
        }

        return items;
    }

    /**
     * 발음이 해당 언어에 유효한지 확인하는 메서드
     */
    private boolean isValidPronunciation(String pronunciation, String targetLanguage) {
        if (pronunciation == null || pronunciation.isEmpty()) {
            return false;
        }

        // 한국어 번역인 경우 한글 문자 포함 확인
        if ("Korean".equals(targetLanguage)) {
            return pronunciation.matches(".*[가-힣ㄱ-ㅎㅏ-ㅣ].*");
        }
        // 일본어 번역인 경우 일본어 문자 포함 확인
        else if ("Japanese".equals(targetLanguage)) {
            return pronunciation.matches(".*[ぁ-んァ-ン々〆〤].*");
        }
        // 중국어 번역인 경우 한자 포함 확인
        else if ("Chinese".equals(targetLanguage)) {
            return pronunciation.matches(".*[\\u4E00-\\u9FFF].*");
        }

        // 기타 언어는 발음이 있기만 하면 유효한 것으로 간주
        return true;
    }

    /**
     * 영어 단어의 한국어 발음 생성
     */
    private String englishToKoreanPronunciation(String word) {
        // 간단한 변환 규칙 적용
        String result = word.toLowerCase();

        // 영어 → 한국어 발음 변환 규칙
        result = result.replaceAll("a", "에이");
        result = result.replaceAll("th", "ㅅ");
        result = result.replaceAll("ch", "치");
        result = result.replaceAll("sh", "시");
        result = result.replaceAll("ph", "프");
        result = result.replaceAll("wh", "w");

        // 자음 변환
        result = result.replaceAll("b", "ㅂ");
        result = result.replaceAll("c", "ㅋ");
        result = result.replaceAll("d", "ㄷ");
        result = result.replaceAll("f", "ㅍ");
        result = result.replaceAll("g", "ㄱ");
        result = result.replaceAll("h", "ㅎ");
        result = result.replaceAll("j", "ㅈ");
        result = result.replaceAll("k", "ㅋ");
        result = result.replaceAll("l", "ㄹ");
        result = result.replaceAll("m", "ㅁ");
        result = result.replaceAll("n", "ㄴ");
        result = result.replaceAll("p", "ㅍ");
        result = result.replaceAll("q", "ㅋ");
        result = result.replaceAll("r", "ㄹ");
        result = result.replaceAll("s", "ㅅ");
        result = result.replaceAll("t", "ㅌ");
        result = result.replaceAll("v", "ㅂ");
        result = result.replaceAll("w", "ㅇ");
        result = result.replaceAll("x", "ㅋㅅ");
        result = result.replaceAll("y", "ㅇ");
        result = result.replaceAll("z", "ㅈ");

        // 모음 변환
        result = result.replaceAll("a", "아");
        result = result.replaceAll("e", "에");
        result = result.replaceAll("i", "이");
        result = result.replaceAll("o", "오");
        result = result.replaceAll("u", "우");

        // 조합 규칙
        result = result.replaceAll("ei", "에이");
        result = result.replaceAll("ai", "에이");
        result = result.replaceAll("ou", "오우");
        result = result.replaceAll("ea", "이아");
        result = result.replaceAll("ee", "이");
        result = result.replaceAll("oo", "우");

        // 일부 단어별 직접 매핑 (자주 사용되는 단어)
        Map<String, String> commonWords = new HashMap<>();
        commonWords.put("hello", "헬로");
        commonWords.put("world", "월드");
        commonWords.put("good", "굿");
        commonWords.put("bad", "배드");
        commonWords.put("the", "더");
        commonWords.put("and", "앤드");
        commonWords.put("is", "이즈");
        commonWords.put("are", "아");
        commonWords.put("to", "투");
        commonWords.put("from", "프롬");
        commonWords.put("like", "라이크");
        commonWords.put("love", "러브");
        commonWords.put("he", "히");
        commonWords.put("she", "쉬");
        commonWords.put("they", "데이");
        commonWords.put("we", "위");
        commonWords.put("you", "유");

        if (commonWords.containsKey(word.toLowerCase())) {
            return commonWords.get(word.toLowerCase());
        }

        // 결과 처리 예외 상황 확인
        if (result.equals(word.toLowerCase())) {
            // 변환 없이 그대로 반환되는 경우, 기본 발음 형태를 반환
            return "[" + word + "]";
        }

        return result;
    }

    /**
     * 기타 언어별 발음 변환 메서드들
     */
    private String englishToJapanesePronunciation(String word) {
        // 영어 → 일본어 발음 변환 구현
        // 일부 단어별 직접 매핑 (자주 사용되는 단어)
        Map<String, String> commonWords = new HashMap<>();
        commonWords.put("hello", "ハロー");
        commonWords.put("world", "ワールド");
        commonWords.put("good", "グッド");
        commonWords.put("bad", "バッド");
        commonWords.put("love", "ラブ");
        commonWords.put("like", "ライク");

        if (commonWords.containsKey(word.toLowerCase())) {
            return commonWords.get(word.toLowerCase());
        }

        return "[" + word + "]"; // 기본 반환
    }

    private String englishToChinesePronunciation(String word) {
        // 영어 → 중국어 발음 변환 구현
        // 일부 단어별 직접 매핑 (자주 사용되는 단어)
        Map<String, String> commonWords = new HashMap<>();
        commonWords.put("hello", "哈喽");
        commonWords.put("world", "沃尔德");
        commonWords.put("good", "古德");
        commonWords.put("bad", "贝德");
        commonWords.put("love", "拉브");
        commonWords.put("like", "赖克");

        if (commonWords.containsKey(word.toLowerCase())) {
            return commonWords.get(word.toLowerCase());
        }

        return "[" + word + "]"; // 기본 반환
    }

    private String spanishToKoreanPronunciation(String word) {
        // 스페인어 → 한국어 발음 변환 구현
        // 일부 단어별 직접 매핑 (자주 사용되는 단어)
        Map<String, String> commonWords = new HashMap<>();
        commonWords.put("hola", "올라");
        commonWords.put("mundo", "문도");
        commonWords.put("bueno", "부에노");
        commonWords.put("malo", "말로");
        commonWords.put("amor", "아모르");
        commonWords.put("gracias", "그라시아스");

        if (commonWords.containsKey(word.toLowerCase())) {
            return commonWords.get(word.toLowerCase());
        }

        return "[" + word + "]"; // 기본 반환
    }

    private String frenchToKoreanPronunciation(String word) {
        // 프랑스어 → 한국어 발음 변환 구현
        // 일부 단어별 직접 매핑 (자주 사용되는 단어)
        Map<String, String> commonWords = new HashMap<>();
        commonWords.put("bonjour", "봉주르");
        commonWords.put("monde", "몽드");
        commonWords.put("bon", "봉");
        commonWords.put("mauvais", "모베");
        commonWords.put("amour", "아무르");
        commonWords.put("merci", "메르시");

        if (commonWords.containsKey(word.toLowerCase())) {
            return commonWords.get(word.toLowerCase());
        }

        return "[" + word + "]"; // 기본 반환
    }

    private String germanToKoreanPronunciation(String word) {
        // 독일어 → 한국어 발음 변환 구현
        // 일부 단어별 직접 매핑 (자주 사용되는 단어)
        Map<String, String> commonWords = new HashMap<>();
        commonWords.put("hallo", "할로");
        commonWords.put("welt", "벨트");
        commonWords.put("gut", "구트");
        commonWords.put("schlecht", "슐레히트");
        commonWords.put("liebe", "리베");
        commonWords.put("danke", "당케");

        if (commonWords.containsKey(word.toLowerCase())) {
            return commonWords.get(word.toLowerCase());
        }

        return "[" + word + "]"; // 기본 반환
    }

    private String japaneseToKoreanPronunciation(String word) {
        // 일본어 → 한국어 발음 변환 구현
        // 일부 단어별 직접 매핑 (자주 사용되는 단어)
        Map<String, String> commonWords = new HashMap<>();
        commonWords.put("こんにちは", "콘니치와");
        commonWords.put("世界", "세카이");
        commonWords.put("良い", "요이");
        commonWords.put("悪い", "와루이");
        commonWords.put("愛", "아이");
        commonWords.put("ありがとう", "아리가토우");

        if (commonWords.containsKey(word)) {
            return commonWords.get(word);
        }

        return "[" + word + "]"; // 기본 반환
    }

    private String chineseToKoreanPronunciation(String word) {
        // 중국어 → 한국어 발음 변환 구현
        // 일부 단어별 직접 매핑 (자주 사용되는 단어)
        Map<String, String> commonWords = new HashMap<>();
        commonWords.put("你好", "니하오");
        commonWords.put("世界", "스지에");
        commonWords.put("好", "하오");
        commonWords.put("坏", "화이");
        commonWords.put("爱", "아이");
        commonWords.put("谢谢", "시에시에");

        if (commonWords.containsKey(word)) {
            return commonWords.get(word);
        }

        return "[" + word + "]"; // 기본 반환
    }

    /**
     * 중복된 대화 제거 메서드
     * A-B 패턴의 대화에서 반복되는 부분을 제거합니다.
     */
    private String removeDuplicateConversation(String conversation) {
        if (conversation == null || conversation.isEmpty()) {
            return conversation;
        }

        // 대화를 라인 단위로 분리
        String[] lines = conversation.split("\n");

        // 중복 제거 방식 1: 완전히 동일한 라인 제거
        Set<String> uniqueLines = new LinkedHashSet<>();
        for (String line : lines) {
            if (!line.trim().isEmpty()) {
                uniqueLines.add(line);
            }
        }

        // 중복 제거 방식 2: 대화 패턴 식별 및 중복 제거
        List<String> result = new ArrayList<>();
        List<String> conversation1 = new ArrayList<>();
        List<String> temp = new ArrayList<>();

        // 대화 패턴 식별
        for (String line : uniqueLines) {
            // 첫 번째 대화 패턴 수집
            if (conversation1.size() < 8) { // 일반적인 A-B 대화는 8라인(4턴) 정도로 가정
                conversation1.add(line);
            } else {
                temp.add(line);

                // 현재 수집된 temp가 conversation1의 패턴과 같은지 확인
                if (temp.size() == conversation1.size()) {
                    boolean isDuplicate = true;
                    for (int i = 0; i < temp.size(); i++) {
                        if (!temp.get(i).equals(conversation1.get(i))) {
                            isDuplicate = false;
                            break;
                        }
                    }

                    if (!isDuplicate) {
                        // 중복이 아니면 결과에 추가
                        result.addAll(temp);
                    }

                    temp.clear();
                }
            }
        }

        // 첫 번째 대화 패턴 및 남은 temp 항목 추가
        result.addAll(conversation1);
        if (!temp.isEmpty()) {
            result.addAll(temp);
        }

        // 중복 제거 방식 3: A: B: 패턴으로 대화 구분
        if (result.isEmpty()) {
            result = new ArrayList<>(uniqueLines);
            List<String> cleanResult = new ArrayList<>();
            Set<String> speakers = new HashSet<>();
            String currentSpeaker = null;

            for (String line : result) {
                // A: 또는 B: 패턴 식별
                if (line.length() > 2 && line.charAt(1) == ':') {
                    String speaker = line.substring(0, 2);
                    speakers.add(speaker);

                    // 같은 화자가 연속으로 말하는 경우 제거
                    if (!speaker.equals(currentSpeaker)) {
                        cleanResult.add(line);
                        currentSpeaker = speaker;
                    }
                } else {
                    cleanResult.add(line);
                }
            }

            // 화자가 2명(A, B)인 경우에만 이 방식 적용
            if (speakers.size() == 2) {
                result = cleanResult;
            }
        }

        return String.join("\n", result);
    }

    // 단어 추출 메서드
    private List<String> extractVocabularyWords(String vocabulary) {
        List<String> words = new ArrayList<>();
        if (vocabulary == null || vocabulary.isEmpty()) {
            return words;
        }

        System.out.println("어휘 원본 내용: " + vocabulary);

        // 줄 단위로 분리
        String[] lines = vocabulary.split("\n");
        for (String line : lines) {
            line = line.trim();

            // 파이프가 있는 경우 (format: "word | pronunciation | meaning")
            if (line.contains("|")) {
                String[] parts = line.split("\\|");
                if (parts.length >= 1) {
                    String word = parts[0].trim();

                    // 번호와 점이 있는 경우 제거 (예: "1. word" -> "word")
                    if (word.matches("^\\d+\\..*")) {
                        int dotIndex = word.indexOf(".");
                        word = word.substring(dotIndex + 1).trim();
                    }

                    if (!word.isEmpty()) {
                        words.add(word);
                        System.out.println("파이프 형식에서 추출된 단어: " + word);
                    }
                }
            }
            // 기존 형식 처리 (format: "1. word (meaning)")
            else {
                int periodIndex = line.indexOf(".");
                int parenthesisIndex = line.indexOf("(");

                if (periodIndex >= 0 && parenthesisIndex >= 0 && periodIndex < parenthesisIndex) {
                    String word = line.substring(periodIndex + 1, parenthesisIndex).trim();
                    if (!word.isEmpty()) {
                        words.add(word);
                        System.out.println("괄호 형식에서 추출된 단어: " + word);
                    }
                }
            }
        }

        System.out.println("최종 추출된 단어 목록: " + words);
        return words;
    }

    /**
     * 어휘 항목을 나타내는 내부 클래스
     */
    private static class VocabularyItem {
        private final String word;
        private final String pronunciation;
        private final String meaning;

        public VocabularyItem(String word, String pronunciation, String meaning) {
            this.word = word;
            this.pronunciation = pronunciation;
            this.meaning = meaning;
        }

        public String getWord() {
            return word;
        }

        public String getPronunciation() {
            return pronunciation;
        }

        public String getMeaning() {
            return meaning;
        }
    }
}