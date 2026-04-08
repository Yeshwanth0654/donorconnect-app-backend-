package com.app.controller;

import com.app.model.Drive;
import com.app.repository.DriveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/drives")
@CrossOrigin
public class DriveController {

    @Autowired
    private DriveRepository repo;

    @PostMapping
    public Drive createDrive(@RequestBody Drive drive) {
        return repo.save(drive);
    }

    @GetMapping
    public List<Drive> getDrives() {
        return repo.findAll();
    }
}