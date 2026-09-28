package com.example.donatehub.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.donatehub.entity.Donor;
import com.example.donatehub.service.DonorService;

@RestController
@RequestMapping("/api/donors")
public class DonorController {

    private final DonorService donorService;

    public DonorController(DonorService donorService) {
        this.donorService = donorService;
    }

    @PostMapping
    public ResponseEntity<Donor> createDonor(
            @RequestBody Donor donor) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(donorService.createDonor(donor));
    }

    @GetMapping
    public ResponseEntity<List<Donor>> getAllDonors() {

        return ResponseEntity.ok(
                donorService.getAllDonors()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Donor> getDonorById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                donorService.getDonorById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Donor> updateDonor(
            @PathVariable Long id,
            @RequestBody Donor donor) {

        return ResponseEntity.ok(
                donorService.updateDonor(id, donor)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonor(
            @PathVariable Long id) {

        donorService.deleteDonor(id);

        return ResponseEntity.noContent().build();
    }
}