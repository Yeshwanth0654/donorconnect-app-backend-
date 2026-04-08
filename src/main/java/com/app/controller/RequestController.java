package com.app.controller;

import com.app.model.Request;
import com.app.repository.RequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/requests")
@CrossOrigin
public class RequestController {

    @Autowired
    private RequestRepository requestRepository;

    // CREATE REQUEST
    @PostMapping
    public Request create(@RequestBody Request request) {
        request.setStatus("PENDING");
        return requestRepository.save(request);
    }

    // GET ALL REQUESTS
    @GetMapping
    public List<Request> getAll() {
        return requestRepository.findAll();
    }

    // UPDATE STATUS
    @PutMapping("/{id}")
    public Request updateStatus(@PathVariable Long id, @RequestBody Request req) {

        Request existing = requestRepository.findById(id).orElseThrow();

        existing.setStatus(req.getStatus());

        return requestRepository.save(existing);
    }
}