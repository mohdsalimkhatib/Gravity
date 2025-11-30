package com.example.learning.controller;

import com.example.learning.entity.Learning;
import com.example.learning.repository.LearningRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(LearningController.class)
class LearningControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LearningRepository learningRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        // Register JavaTimeModule for LocalDate support
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.configure(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
    }

    @Test
    void testGetAllLearnings() throws Exception {
        // Given
        Learning learning1 = createTestLearning(1L, "Learning 1");
        Learning learning2 = createTestLearning(2L, "Learning 2");
        when(learningRepository.findAll()).thenReturn(Arrays.asList(learning1, learning2));

        // When & Then
        mockMvc.perform(get("/learnings"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].title").value("Learning 1"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].title").value("Learning 2"));

        verify(learningRepository, times(1)).findAll();
    }

    @Test
    void testCreateLearning() throws Exception {
        // Given
        Learning inputLearning = createTestLearning(null, "New Learning");
        Learning savedLearning = createTestLearning(1L, "New Learning");
        when(learningRepository.save(any(Learning.class))).thenReturn(savedLearning);

        // When & Then
        mockMvc.perform(post("/learnings")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputLearning)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("New Learning"));

        verify(learningRepository, times(1)).save(any(Learning.class));
    }

    @Test
    void testUpdateLearning_Success() throws Exception {
        // Given
        Learning existingLearning = createTestLearning(1L, "Original Title");
        Learning updatedLearning = createTestLearning(1L, "Updated Title");
        updatedLearning.setCategory("Life");

        when(learningRepository.findById(1L)).thenReturn(Optional.of(existingLearning));
        when(learningRepository.save(any(Learning.class))).thenReturn(updatedLearning);

        // When & Then
        mockMvc.perform(put("/learnings/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedLearning)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Updated Title"))
                .andExpect(jsonPath("$.category").value("Life"));

        verify(learningRepository, times(1)).findById(1L);
        verify(learningRepository, times(1)).save(any(Learning.class));
    }

    @Test
    void testUpdateLearning_NotFound() throws Exception {
        // Given
        when(learningRepository.findById(1L)).thenReturn(Optional.empty());

        Learning updatedLearning = createTestLearning(1L, "Updated Title");

        // When & Then
        mockMvc.perform(put("/learnings/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedLearning)))
                .andExpect(status().isNotFound());

        verify(learningRepository, times(1)).findById(1L);
        verify(learningRepository, never()).save(any(Learning.class));
    }

    @Test
    void testDeleteLearning_Success() throws Exception {
        // Given
        Learning existingLearning = createTestLearning(1L, "Test Learning");
        when(learningRepository.findById(1L)).thenReturn(Optional.of(existingLearning));
        doNothing().when(learningRepository).delete(existingLearning);

        // When & Then
        mockMvc.perform(delete("/learnings/1"))
                .andExpect(status().isOk());

        verify(learningRepository, times(1)).findById(1L);
        verify(learningRepository, times(1)).delete(existingLearning);
    }

    @Test
    void testDeleteLearning_NotFound() throws Exception {
        // Given
        when(learningRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(delete("/learnings/1"))
                .andExpect(status().isNotFound());

        verify(learningRepository, times(1)).findById(1L);
        verify(learningRepository, never()).delete(any(Learning.class));
    }

    @Test
    void testCreateLearning_WithMinimalData() throws Exception {
        // Given - Learning with only description (no validation currently enforced)
        Learning minimalLearning = new Learning();
        minimalLearning.setDescription("Description without title");
        minimalLearning.setCategory("Job");
        minimalLearning.setDate(LocalDate.of(2023, 10, 15));

        Learning savedLearning = createTestLearning(1L, "");
        savedLearning.setTitle(null); // No title
        when(learningRepository.save(any(Learning.class))).thenReturn(savedLearning);

        // When & Then
        mockMvc.perform(post("/learnings")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(minimalLearning)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(learningRepository, times(1)).save(any(Learning.class));
    }

    @Test
    void testGetAllLearnings_EmptyList() throws Exception {
        // Given
        when(learningRepository.findAll()).thenReturn(Arrays.asList());

        // When & Then
        mockMvc.perform(get("/learnings"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(0));

        verify(learningRepository, times(1)).findAll();
    }

    private Learning createTestLearning(Long id, String title) {
        Learning learning = new Learning();
        learning.setId(id);
        learning.setTitle(title);
        learning.setDescription("Test Description");
        learning.setCategory("Job");
        learning.setDate(LocalDate.of(2023, 10, 15));
        learning.setTags("java,spring");
        learning.setAttachments("[{\"url\":\"http://example.com/file1.pdf\",\"filename\":\"file1.pdf\"}]");
        learning.setCustomProperties("{\"source\":\"book\"}");
        return learning;
    }
}
