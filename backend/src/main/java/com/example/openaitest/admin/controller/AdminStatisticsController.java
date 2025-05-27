package com.example.openaitest.admin.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.openaitest.inquiry.repository.InquiryService;
import com.example.openaitest.inquiry.repository.LogService;

@RestController
@RequestMapping("/api/admin/statistics")
@PreAuthorize("hasRole('ADMIN')")
public class AdminStatisticsController {
    @Autowired
    private LogService logService;

    @Autowired
    private InquiryService inquiryService;

    @GetMapping("/daily-visitors")
    public ResponseEntity<Map<String, Object>> getDailyVisitors(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        // 기본값: 최근 30일
        if (startDate == null) {
            startDate = LocalDate.now().minusDays(30);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }

        Map<LocalDate, Long> dailyStats = logService.getDailyVisitorStats(startDate, endDate);

        Map<String, Object> response = new HashMap<>();
        response.put("startDate", startDate);
        response.put("endDate", endDate);
        response.put("data", dailyStats);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/visitors-by-country")
    public ResponseEntity<Map<String, Object>> getVisitorsByCountry(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        // 기본값: 최근 30일
        if (startDate == null) {
            startDate = LocalDate.now().minusDays(30);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }

        Map<String, Long> countryStats = logService.getCountryVisitorStats(startDate, endDate);

        Map<String, Object> response = new HashMap<>();
        response.put("startDate", startDate);
        response.put("endDate", endDate);
        response.put("data", countryStats);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/inquiry-stats")
    public ResponseEntity<Map<String, Object>> getInquiryStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        System.out.println("=== Inquiry Stats API Called ===");
        System.out.println("Start Date: " + startDate);
        System.out.println("End Date: " + endDate);

        // 기본값: 최근 30일
        if (startDate == null) {
            startDate = LocalDate.now().minusDays(30);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }

        Map<String, Long> inquiryStats = inquiryService.getInquiryStatsByStatusAndDateRange(startDate, endDate);

        System.out.println("Inquiry Stats Results: " + inquiryStats);

        Map<String, Object> response = new HashMap<>();
        response.put("startDate", startDate);
        response.put("endDate", endDate);
        response.put("data", inquiryStats);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/daily-inquiries")
    public ResponseEntity<Map<String, Object>> getDailyInquiries(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        // 기본값: 최근 30일
        if (startDate == null) {
            startDate = LocalDate.now().minusDays(30);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }

        Map<LocalDate, Long> dailyStats = inquiryService.getDailyInquiryStats(startDate, endDate);

        Map<String, Object> response = new HashMap<>();
        response.put("startDate", startDate);
        response.put("endDate", endDate);
        response.put("data", dailyStats);

        return ResponseEntity.ok(response);
    }
}