package com.example.openaitest.file.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.amazonaws.util.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AWSS3Service {
    private final AmazonS3 s3Client;
    private final String bucketName;

    public AWSS3Service(AmazonS3 s3Client,
            @Value("${aws.s3.bucket-name}") String bucketName) {
        this.s3Client = s3Client;
        this.bucketName = bucketName;
    }

    // 파일 업로드
    public String uploadFile(String prefix, String fileName, byte[] fileData, String contentType) {
        String key = prefix + "/" + UUID.randomUUID() + "_" + fileName;
        InputStream is = new ByteArrayInputStream(fileData);
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(fileData.length);
        metadata.setContentType(contentType);

        s3Client.putObject(new PutObjectRequest(bucketName, key, is, metadata));
        return key;
    }

    // 파일 다운로드
    public byte[] downloadFile(String key) {
        S3Object s3Object = s3Client.getObject(bucketName, key);
        S3ObjectInputStream is = s3Object.getObjectContent();
        try {
            return IOUtils.toByteArray(is);
        } catch (IOException e) {
            throw new RuntimeException("파일 다운로드 실패", e);
        }
    }

    // 파일 삭제
    public void deleteFile(String key) {
        s3Client.deleteObject(bucketName, key);
    }

    // 만료된 파일 삭제 (30일 이상된 파일)
    public void deleteExpiredFiles(List<String> keys) {
        if (keys.isEmpty())
            return;

        DeleteObjectsRequest request = new DeleteObjectsRequest(bucketName)
                .withKeys(keys.stream().map(key -> new DeleteObjectsRequest.KeyVersion(key))
                        .collect(Collectors.toList()));
        s3Client.deleteObjects(request);
    }
}