package com.example.openaitest.inquiry.repository;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GeoLocationService {
    private static final Logger logger = LoggerFactory.getLogger(GeoLocationService.class);

    @Autowired
    private RestTemplate restTemplate;

    @Value("${geo.api.url}")
    private String geoApiUrl;

    @Value("${geo.api.key}")
    private String geoApiKey;

    @Cacheable("ipCountryCache")
    public Map<String, String> getCountryFromIp(String ipAddress) {
        try {
            String url = String.format("%s/%s?access_key=%s", geoApiUrl, ipAddress, geoApiKey);
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

            Map<String, Object> responseData = response.getBody();
            Map<String, String> result = new HashMap<>();

            result.put("countryCode", (String) responseData.get("country_code"));
            result.put("countryName", (String) responseData.get("country_name"));

            return result;
        } catch (Exception e) {
            logger.error("Failed to get country info from IP: " + ipAddress, e);
            Map<String, String> fallback = new HashMap<>();
            fallback.put("countryCode", "XX");
            fallback.put("countryName", "Unknown");
            return fallback;
        }
    }
}