package com.example.learning.entity;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

class LearningTest {

    private final ObjectMapper objectMapper;

    public LearningTest() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        // Configure to serialize LocalDate as string, not array
        objectMapper.configure(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
    }

    @Test
    void testGettersAndSetters() {
        // Given
        Learning learning = new Learning();
        LocalDate testDate = LocalDate.of(2023, 10, 15);

        // When
        learning.setId(1L);
        learning.setTitle("Test Title");
        learning.setDescription("Test Description");
        learning.setCategory("Job");
        learning.setDate(testDate);
        learning.setTags("java,spring");
        learning.setAttachments("[{\"url\":\"http://example.com/file1.pdf\",\"filename\":\"file1.pdf\"}]");
        learning.setCustomProperties("{\"source\":\"book\",\"author\":\"John Doe\"}");

        // Then
        assertThat(learning.getId()).isEqualTo(1L);
        assertThat(learning.getTitle()).isEqualTo("Test Title");
        assertThat(learning.getDescription()).isEqualTo("Test Description");
        assertThat(learning.getCategory()).isEqualTo("Job");
        assertThat(learning.getDate()).isEqualTo(testDate);
        assertThat(learning.getTags()).isEqualTo("java,spring");
        assertThat(learning.getAttachments()).isEqualTo("[{\"url\":\"http://example.com/file1.pdf\",\"filename\":\"file1.pdf\"}]");
        assertThat(learning.getCustomProperties()).isEqualTo("{\"source\":\"book\",\"author\":\"John Doe\"}");
    }

    @Test
    void testJsonSerialization() throws Exception {
        // Given
        Learning learning = new Learning();
        learning.setId(1L);
        learning.setTitle("Test Learning");
        learning.setDescription("Test Description");
        learning.setCategory("Job");
        learning.setDate(LocalDate.of(2023, 10, 15));
        learning.setTags("java,spring");
        learning.setAttachments("[{\"url\":\"http://example.com/file1.pdf\",\"filename\":\"file1.pdf\"}]");
        learning.setCustomProperties("{\"source\":\"book\"}");

        // When
        String json = objectMapper.writeValueAsString(learning);

        // Then
        assertThat(json).contains("\"id\":1");
        assertThat(json).contains("\"title\":\"Test Learning\"");
        assertThat(json).contains("\"description\":\"Test Description\"");
        assertThat(json).contains("\"category\":\"Job\"");
        assertThat(json).contains("\"date\":\"2023-10-15\"");
        assertThat(json).contains("\"tags\":\"java,spring\"");
        assertThat(json).contains("\"attachments\":\"[{\\\"url\\\":\\\"http://example.com/file1.pdf\\\",\\\"filename\\\":\\\"file1.pdf\\\"}]\"");
        assertThat(json).contains("\"customProperties\":\"{\\\"source\\\":\\\"book\\\"}\"");
    }

    @Test
    void testJsonDeserialization() throws Exception {
        // Given
        String json = """
            {
                "id": 1,
                "title": "Test Learning",
                "description": "Test Description",
                "category": "Job",
                "date": "2023-10-15",
                "tags": "java,spring",
                "attachments": "[{\\"url\\":\\"http://example.com/file1.pdf\\",\\"filename\\":\\"file1.pdf\\"}]",
                "customProperties": "{\\"source\\":\\"book\\"}"
            }
            """;

        // When
        Learning learning = objectMapper.readValue(json, Learning.class);

        // Then
        assertThat(learning.getId()).isEqualTo(1L);
        assertThat(learning.getTitle()).isEqualTo("Test Learning");
        assertThat(learning.getDescription()).isEqualTo("Test Description");
        assertThat(learning.getCategory()).isEqualTo("Job");
        assertThat(learning.getDate()).isEqualTo(LocalDate.of(2023, 10, 15));
        assertThat(learning.getTags()).isEqualTo("java,spring");
        assertThat(learning.getAttachments()).isEqualTo("[{\"url\":\"http://example.com/file1.pdf\",\"filename\":\"file1.pdf\"}]");
        assertThat(learning.getCustomProperties()).isEqualTo("{\"source\":\"book\"}");
    }

    @Test
    void testJsonIncludeNonNull() throws Exception {
        // Given - Learning with null values
        Learning learning = new Learning();
        learning.setTitle("Test Title");
        // Other fields remain null

        // When
        String json = objectMapper.writeValueAsString(learning);

        // Then - null values should be excluded
        assertThat(json).contains("\"title\":\"Test Title\"");
        assertThat(json).doesNotContain("\"description\":");
        assertThat(json).doesNotContain("\"category\":");
        assertThat(json).doesNotContain("\"date\":");
        assertThat(json).doesNotContain("\"tags\":");
        assertThat(json).doesNotContain("\"attachments\":");
        assertThat(json).doesNotContain("\"customProperties\":");
    }
}
