package com.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.app.model.Drive;

public interface DriveRepository extends JpaRepository<Drive, Long> {
}