package com.example.openaitest.inquiry.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.openaitest.inquiry.model.Inquiry;
import com.example.openaitest.inquiry.model.InquiryResponse;

@Repository
public interface InquiryResponseRepository extends JpaRepository<InquiryResponse, Long> {
    List<InquiryResponse> findByInquiry(Inquiry inquiry);

    Optional<InquiryResponse> findTopByInquiryOrderByCreatedAtDesc(Inquiry inquiry);
}