package com.example.learning.repository;

import com.example.learning.entity.Learning;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LearningRepository extends JpaRepository<Learning, Long> {

    @Query("SELECT l FROM Learning l WHERE " +
           "LOWER(l.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.tags) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.category) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Learning> findBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);
}
