package com.app.controller;

import com.app.model.User;
import com.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private UserRepository repo;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (user == null
                || isBlank(user.getName())
                || isBlank(user.getEmail())
                || isBlank(user.getPassword())
                || isBlank(user.getRole())) {
            return error(HttpStatus.BAD_REQUEST, "All registration fields are required.");
        }

        try {
            return ResponseEntity.ok(repo.save(user));
        } catch (Exception ex) {
            return error(HttpStatus.BAD_REQUEST, "Registration failed. Email may already be in use.");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            if (user == null || isBlank(user.getEmail()) || isBlank(user.getPassword())) {
                return error(HttpStatus.BAD_REQUEST, "Email and password are required.");
            }

            User dbUser = repo.findByEmail(user.getEmail());

            if (dbUser == null || isBlank(dbUser.getPassword()) || !dbUser.getPassword().equals(user.getPassword())) {
                return error(HttpStatus.UNAUTHORIZED, "Invalid credentials");
            }

            Map<String, String> res = new HashMap<>();
            res.put("token", "dummy-token");
            res.put("role", valueOrEmpty(dbUser.getRole()));
            res.put("email", valueOrEmpty(dbUser.getEmail()));
            res.put("name", valueOrEmpty(dbUser.getName()));

            return ResponseEntity.ok(res);
        } catch (Exception ex) {
            return error(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
    }

    private ResponseEntity<Map<String, String>> error(HttpStatus status, String message) {
        Map<String, String> body = new HashMap<>();
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String valueOrEmpty(String value) {
        return value == null ? "" : value;
    }
}
