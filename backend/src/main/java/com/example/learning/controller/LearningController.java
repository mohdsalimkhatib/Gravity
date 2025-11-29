package com.example.learning.controller;

import com.example.learning.entity.Learning;
import com.example.learning.repository.LearningRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/learnings")
@CrossOrigin(origins = "http://localhost:5173") // Allow React frontend
public class LearningController {

    @Autowired
    private LearningRepository learningRepository;

    @GetMapping
    public List<Learning> getAllLearnings() {
        return learningRepository.findAll();
    }

    @PostMapping
    public Learning createLearning(@RequestBody Learning learning) {
        return learningRepository.save(learning);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Learning> updateLearning(@PathVariable Long id, @RequestBody Learning learningDetails) {
        return learningRepository.findById(id)
                .map(learning -> {
                    learning.setTitle(learningDetails.getTitle());
                    learning.setDescription(learningDetails.getDescription());
                    learning.setCategory(learningDetails.getCategory());
                    learning.setDate(learningDetails.getDate());
                    learning.setTags(learningDetails.getTags());
                    learning.setImageUrl(learningDetails.getImageUrl());
                    learning.setCustomProperties(learningDetails.getCustomProperties());
                    return ResponseEntity.ok(learningRepository.save(learning));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearning(@PathVariable Long id) {
        return learningRepository.findById(id)
                .map(learning -> {
                    learningRepository.delete(learning);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
