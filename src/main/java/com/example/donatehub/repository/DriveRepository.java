package com.example.donatehub.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.donatehub.entity.Drive;

public interface DriveRepository extends JpaRepository<Drive, Long> {
}