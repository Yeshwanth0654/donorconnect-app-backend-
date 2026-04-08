package com.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.app.model.Donation;

public interface DonationRepository extends JpaRepository<Donation, Long> {
}