package com.example.donatehub.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.donatehub.dto.DistributionRequest;
import com.example.donatehub.dto.DonationRequest;
import com.example.donatehub.entity.DonatedItem;
import com.example.donatehub.service.DonatedItemService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/items")
public class DonatedItemController {

    private final DonatedItemService donatedItemService;

    public DonatedItemController(
            DonatedItemService donatedItemService) {

        this.donatedItemService = donatedItemService;
    }

    @PostMapping
    public ResponseEntity<DonatedItem> createDonation(
            @Valid @RequestBody DonationRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(donatedItemService.createDonation(request));
    }

    @GetMapping
    public ResponseEntity<List<DonatedItem>> getAllItems() {

        return ResponseEntity.ok(
                donatedItemService.getAllItems()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonatedItem> getItemById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                donatedItemService.getItemById(id)
        );
    }

    @GetMapping("/available")
    public ResponseEntity<List<DonatedItem>> getAvailableItems() {

        return ResponseEntity.ok(
                donatedItemService.getAvailableItems()
        );
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<DonatedItem>> getItemsByCategory(
            @PathVariable String category) {

        return ResponseEntity.ok(
                donatedItemService.getItemsByCategory(category)
        );
    }

    @GetMapping("/drive/{driveId}")
    public ResponseEntity<List<DonatedItem>> getItemsByDrive(
            @PathVariable Long driveId) {

        return ResponseEntity.ok(
                donatedItemService.getItemsByDrive(driveId)
        );
    }

    @PostMapping("/{itemId}/distribute")
    public ResponseEntity<DonatedItem> distributeItem(
            @PathVariable Long itemId,
            @Valid @RequestBody DistributionRequest request) {

        return ResponseEntity.ok(
                donatedItemService.distributeItem(
                        itemId,
                        request
                )
        );
    }

    @GetMapping("/drive/{driveId}/summary")
    public ResponseEntity<DriveSummary> getDriveSummary(
            @PathVariable Long driveId) {

        long total = donatedItemService
                .getTotalItemsForDrive(driveId);

        long distributed = donatedItemService
                .getDistributedItemsForDrive(driveId);

        long available = donatedItemService
                .getAvailableItemsForDrive(driveId);

        return ResponseEntity.ok(
                new DriveSummary(total, distributed, available)
        );
    }

    public record DriveSummary(
            long totalItems,
            long distributedItems,
            long availableItems
    ) {
    }
}