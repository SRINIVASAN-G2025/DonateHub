package com.example.donatehub.controller;

import com.example.donatehub.entity.Recipient;
import com.example.donatehub.service.RecipientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipients")
public class RecipientController {

    private final RecipientService recipientService;

    public RecipientController(RecipientService recipientService) {
        this.recipientService = recipientService;
    }

    @PostMapping
    public ResponseEntity<Recipient> createRecipient(
            @RequestBody Recipient recipient) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(recipientService.createRecipient(recipient));
    }

    @GetMapping
    public ResponseEntity<List<Recipient>> getAllRecipients() {

        return ResponseEntity.ok(
                recipientService.getAllRecipients()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recipient> getRecipientById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                recipientService.getRecipientById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Recipient> updateRecipient(
            @PathVariable Long id,
            @RequestBody Recipient recipient) {

        return ResponseEntity.ok(
                recipientService.updateRecipient(id, recipient)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipient(
            @PathVariable Long id) {

        recipientService.deleteRecipient(id);

        return ResponseEntity.noContent().build();
    }
}