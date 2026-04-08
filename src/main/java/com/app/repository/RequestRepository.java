package com.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.app.model.Request;

public interface RequestRepository extends JpaRepository<Request, Long> {
}