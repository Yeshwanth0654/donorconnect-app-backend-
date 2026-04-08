package com.app.controller;

import com.app.model.Donation;
import com.app.repository.DonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

@RestController
@RequestMapping("/donations")
@CrossOrigin
public class DonationController {

    @Autowired
    private DonationRepository repo;

    @PostMapping("/upload")
    public Donation upload(
            @RequestParam String itemName,
            @RequestParam int quantity,
            @RequestParam MultipartFile file,
            @RequestParam(required = false) String donorName,
            @RequestParam(required = false) String donorEmail,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String driveTitle,
            @RequestParam(defaultValue = "false") boolean emergencyDrive
    ) throws Exception {
        String uploadDir = System.getProperty("user.dir") + "/uploads/";

        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String filePath = uploadDir + file.getOriginalFilename();
        file.transferTo(new File(filePath));

        Donation d = new Donation();
        d.setItemName(itemName);
        d.setQuantity(quantity);
        d.setImageUrl("uploads/" + file.getOriginalFilename());
        d.setDonorName(donorName);
        d.setDonorEmail(donorEmail);
        d.setCategory(category);
        d.setDriveTitle(driveTitle);
        d.setEmergencyDrive(emergencyDrive);
        d.setStatus("RECEIVED");

        return repo.save(d);
    }

    @GetMapping
    public List<Donation> getAll() {
        return repo.findAll();
    }
}
