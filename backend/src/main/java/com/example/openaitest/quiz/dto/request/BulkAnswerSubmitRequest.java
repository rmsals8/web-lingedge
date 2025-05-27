package com.example.openaitest.quiz.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkAnswerSubmitRequest {
    private List<AnswerSubmitRequest> answers;
}