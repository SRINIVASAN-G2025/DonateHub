package com.example.donatehub.dto;

import java.time.LocalDate;

import com.example.donatehub.entity.ItemCondition;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class DonationRequest {

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Condition is required")
    private ItemCondition condition;

    @NotNull(message = "Donation date is required")
    private LocalDate donationDate;

    @NotNull(message = "Drive ID is required")
    private Long driveId;

    @NotNull(message = "Donor ID is required")
    private Long donorId;

    public DonationRequest() {
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public ItemCondition getCondition() {
        return condition;
    }

    public void setCondition(ItemCondition condition) {
        this.condition = condition;
    }

    public LocalDate getDonationDate() {
        return donationDate;
    }

    public void setDonationDate(LocalDate donationDate) {
        this.donationDate = donationDate;
    }

    public Long getDriveId() {
        return driveId;
    }

    public void setDriveId(Long driveId) {
        this.driveId = driveId;
    }

    public Long getDonorId() {
        return donorId;
    }

    public void setDonorId(Long donorId) {
        this.donorId = donorId;
    }
}