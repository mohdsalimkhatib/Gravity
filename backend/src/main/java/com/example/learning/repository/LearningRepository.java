package com.example.learning.repository;

import com.example.learning.entity.Learning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LearningRepository extends JpaRepository<Learning, Long> {
}
