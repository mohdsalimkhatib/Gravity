package com.example.learning.controller;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.stream.Stream;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(FileUploadController.class)
class FileUploadControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testUploadFile_Success() throws Exception {
        // Given
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "test.pdf",
            "application/pdf",
            "test content".getBytes()
        );

        // When & Then
        mockMvc.perform(multipart("/upload")
                .file(file))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.TEXT_PLAIN))
                .andExpect(content().string(containsString("http://localhost/uploads/")));

        // Verify file was "uploaded" (in test environment, it would go to temp location)
    }

    @Test
    void testUploadFile_EmptyFile() throws Exception {
        // Given
        MockMultipartFile emptyFile = new MockMultipartFile(
            "file",
            "empty.pdf",
            "application/pdf",
            new byte[0]
        );

        // When & Then
        mockMvc.perform(multipart("/upload")
                .file(emptyFile))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("http://localhost/uploads/")));
    }

    @Test
    void testUploadMultipleFiles_Success() throws Exception {
        // Given
        MockMultipartFile file1 = new MockMultipartFile(
            "files",
            "test1.pdf",
            "application/pdf",
            "test content 1".getBytes()
        );
        MockMultipartFile file2 = new MockMultipartFile(
            "files",
            "test2.jpg",
            "image/jpeg",
            "test image content".getBytes()
        );

        // When & Then
        mockMvc.perform(multipart("/upload/multiple")
                .file(file1)
                .file(file2))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].filename").value("test1.pdf"))
                .andExpect(jsonPath("$[0].url").exists())
                .andExpect(jsonPath("$[1].filename").value("test2.jpg"))
                .andExpect(jsonPath("$[1].url").exists());
    }

    @Test
    void testUploadMultipleFiles_OneEmptyFile() throws Exception {
        // Given
        MockMultipartFile validFile = new MockMultipartFile(
            "files",
            "valid.pdf",
            "application/pdf",
            "valid content".getBytes()
        );
        MockMultipartFile emptyFile = new MockMultipartFile(
            "files",
            "empty.pdf",
            "application/pdf",
            new byte[0]
        );

        // When & Then - Should still process the valid file
        mockMvc.perform(multipart("/upload/multiple")
                .file(validFile)
                .file(emptyFile))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].filename").value("valid.pdf"));
    }

    @Test
    void testUploadMultipleFiles_AllEmpty() throws Exception {
        // Given
        MockMultipartFile emptyFile1 = new MockMultipartFile(
            "files",
            "empty1.pdf",
            "application/pdf",
            new byte[0]
        );
        MockMultipartFile emptyFile2 = new MockMultipartFile(
            "files",
            "empty2.jpg",
            "image/jpeg",
            new byte[0]
        );

        // When & Then
        mockMvc.perform(multipart("/upload/multiple")
                .file(emptyFile1)
                .file(emptyFile2))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void testUploadMultipleFiles_NoFiles() throws Exception {
        // When & Then
        mockMvc.perform(multipart("/upload/multiple"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void testUploadFile_VariousFileTypes() throws Exception {
        // Test different file types
        String[] fileTypes = {
            "application/pdf",
            "image/jpeg",
            "image/png",
            "text/plain",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        };

        for (String contentType : fileTypes) {
            MockMultipartFile file = new MockMultipartFile(
                "file",
                "test." + getExtensionFromContentType(contentType),
                contentType,
                "test content".getBytes()
            );

            mockMvc.perform(multipart("/upload")
                    .file(file))
                    .andExpect(status().isOk())
                    .andExpect(content().string(containsString("http://localhost/uploads/")));
        }
    }

    @Test
    void testUploadFile_FilenameWithSpecialChars() throws Exception {
        // Given
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "test file with spaces & special chars.pdf",
            "application/pdf",
            "test content".getBytes()
        );

        // When & Then
        mockMvc.perform(multipart("/upload")
                .file(file))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("http://localhost/uploads/")));
    }

    @Test
    void testUploadFile_NoFileProvided() throws Exception {
        // When & Then - Should handle gracefully
        mockMvc.perform(multipart("/upload"))
                .andExpect(status().isBadRequest());
    }

    @AfterEach
    void tearDown() throws IOException {
        // Clean up test-generated files after each test
        Path uploadsDir = Paths.get("backend/uploads");
        if (Files.exists(uploadsDir)) {
            try (Stream<Path> paths = Files.walk(uploadsDir)) {
                paths.sorted(Comparator.reverseOrder())
                     .forEach(path -> {
                         try {
                             if (!Files.isDirectory(path)) {
                                 Files.delete(path);
                             }
                         } catch (IOException e) {
                             // Ignore cleanup errors in tests
                         }
                     });
            }
        }
    }

    private String getExtensionFromContentType(String contentType) {
        return switch (contentType) {
            case "application/pdf" -> "pdf";
            case "image/jpeg" -> "jpg";
            case "image/png" -> "png";
            case "text/plain" -> "txt";
            case "application/msword" -> "doc";
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document" -> "docx";
            default -> "bin";
        };
    }
}
