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

import com.example.donatehub.dto.DriveRequest;
import com.example.donatehub.entity.Drive;
import com.example.donatehub.service.DriveService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/drives")
public class DriveController {

    private final DriveService driveService;

    public DriveController(DriveService driveService) {
        this.driveService = driveService;
    }

    @PostMapping
    public ResponseEntity<Drive> createDrive(
            @Valid @RequestBody DriveRequest request) {

        Drive drive = driveService.createDrive(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(drive);
    }

    @GetMapping
    public ResponseEntity<List<Drive>> getAllDrives() {

        return ResponseEntity.ok(
                driveService.getAllDrives()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Drive> getDriveById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                driveService.getDriveById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Drive> updateDrive(
            @PathVariable Long id,
            @Valid @RequestBody DriveRequest request) {

        return ResponseEntity.ok(
                driveService.updateDrive(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDrive(
            @PathVariable Long id) {

        driveService.deleteDrive(id);

        return ResponseEntity.noContent().build();
    }
}