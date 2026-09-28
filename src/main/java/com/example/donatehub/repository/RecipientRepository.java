package com.example.donatehub.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.donatehub.entity.Recipient;

public interface RecipientRepository extends JpaRepository<Recipient, Long> {
}