package com.example.learning.controller;

import com.example.learning.entity.Learning;
import com.example.learning.repository.LearningRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/learnings")
public class LearningController {

    @Autowired
    private LearningRepository learningRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllLearnings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {


        System.out.println("Received request for /learnings");
        Pageable pageable = PageRequest.of(page, size);
        Page<Learning> learningPage;

        if (search != null && !search.trim().isEmpty()) {
            // Search across all records, then paginate results
            learningPage = learningRepository.findBySearchTerm(search.trim(), pageable);
        } else {
            // No search - return all records with pagination
            learningPage = learningRepository.findAll(pageable);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("learnings", learningPage.getContent());
        response.put("currentPage", learningPage.getNumber());
        response.put("totalItems", learningPage.getTotalElements());
        response.put("totalPages", learningPage.getTotalPages());
        response.put("pageSize", learningPage.getSize());
        response.put("hasNext", learningPage.hasNext());
        response.put("hasPrevious", learningPage.hasPrevious());
        response.put("searchTerm", search); // Include search term in response

        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public List<Learning> getAllLearningsWithoutPagination() {
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
                    learning.setAttachments(learningDetails.getAttachments());
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
