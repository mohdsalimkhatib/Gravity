package com.example.learning.repository;

import com.example.learning.entity.Learning;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class LearningRepositoryTest {

    @Autowired
    private LearningRepository learningRepository;

    @Test
    void testSaveAndFindById() {
        // Given
        Learning learning = createTestLearning();
        learning.setId(null); // Let JPA generate ID

        // When
        Learning saved = learningRepository.save(learning);

        // Then
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getTitle()).isEqualTo("Test Learning");
        assertThat(saved.getCategory()).isEqualTo("Job");

        // And find it
        Optional<Learning> found = learningRepository.findById(saved.getId());
        assertThat(found).isPresent();
        assertThat(found.get().getTitle()).isEqualTo("Test Learning");
    }

    @Test
    void testFindAll() {
        // Given
        Learning learning1 = createTestLearning();
        learning1.setTitle("Learning 1");
        learning1.setId(null);

        Learning learning2 = createTestLearning();
        learning2.setTitle("Learning 2");
        learning2.setId(null);

        learningRepository.save(learning1);
        learningRepository.save(learning2);

        // When
        List<Learning> allLearnings = learningRepository.findAll();

        // Then
        assertThat(allLearnings).hasSizeGreaterThanOrEqualTo(2);
        assertThat(allLearnings.stream().map(Learning::getTitle))
                .contains("Learning 1", "Learning 2");
    }

    @Test
    void testUpdate() {
        // Given
        Learning learning = createTestLearning();
        learning.setId(null);
        Learning saved = learningRepository.save(learning);

        // When
        saved.setTitle("Updated Title");
        saved.setCategory("Life");
        Learning updated = learningRepository.save(saved);

        // Then
        assertThat(updated.getTitle()).isEqualTo("Updated Title");
        assertThat(updated.getCategory()).isEqualTo("Life");
    }

    @Test
    void testDelete() {
        // Given
        Learning learning = createTestLearning();
        learning.setId(null);
        Learning saved = learningRepository.save(learning);
        Long id = saved.getId();

        // When
        learningRepository.delete(saved);

        // Then
        Optional<Learning> deleted = learningRepository.findById(id);
        assertThat(deleted).isEmpty();
    }

    @Test
    void testDeleteById() {
        // Given
        Learning learning = createTestLearning();
        learning.setId(null);
        Learning saved = learningRepository.save(learning);
        Long id = saved.getId();

        // When
        learningRepository.deleteById(id);

        // Then
        Optional<Learning> deleted = learningRepository.findById(id);
        assertThat(deleted).isEmpty();
    }

    @Test
    void testExistsById() {
        // Given
        Learning learning = createTestLearning();
        learning.setId(null);
        Learning saved = learningRepository.save(learning);

        // When & Then
        assertThat(learningRepository.existsById(saved.getId())).isTrue();
        assertThat(learningRepository.existsById(999L)).isFalse();
    }

    @Test
    void testCount() {
        // Given
        long initialCount = learningRepository.count();

        Learning learning = createTestLearning();
        learning.setId(null);
        learningRepository.save(learning);

        // When
        long newCount = learningRepository.count();

        // Then
        assertThat(newCount).isEqualTo(initialCount + 1);
    }

    @AfterAll
    static void tearDown() throws IOException {
        // Clean up test database files after all tests
        Path dataDir = Paths.get("data");
        if (Files.exists(dataDir)) {
            try (Stream<Path> paths = Files.walk(dataDir)) {
                paths.sorted(Comparator.reverseOrder())
                     .forEach(path -> {
                         try {
                             Files.delete(path);
                         } catch (IOException e) {
                             // Ignore cleanup errors in tests
                         }
                     });
            }
        }
    }

    private Learning createTestLearning() {
        Learning learning = new Learning();
        learning.setTitle("Test Learning");
        learning.setDescription("Test Description");
        learning.setCategory("Job");
        learning.setDate(LocalDate.of(2023, 10, 15));
        learning.setTags("java,spring");
        learning.setAttachments("[{\"url\":\"http://example.com/file1.pdf\",\"filename\":\"file1.pdf\"}]");
        learning.setCustomProperties("{\"source\":\"book\"}");
        return learning;
    }
}
