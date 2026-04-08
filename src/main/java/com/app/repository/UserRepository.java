package com.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.app.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmailAndPassword(String email, String password);

    User findByEmail(String email);
}