package com.example.donatehub.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.donatehub.entity.Donor;

public interface DonorRepository extends JpaRepository<Donor, Long> {
}