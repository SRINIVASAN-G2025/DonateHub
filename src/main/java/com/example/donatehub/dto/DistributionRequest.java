package com.example.donatehub.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;

public class DistributionRequest {

    @NotNull(message = "Recipient ID is required")
    private Long recipientId;

    @NotNull(message = "Distribution date is required")
    private LocalDate distributionDate;

    public DistributionRequest() {
    }

    public Long getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
    }

    public LocalDate getDistributionDate() {
        return distributionDate;
    }

    public void setDistributionDate(LocalDate distributionDate) {
        this.distributionDate = distributionDate;
    }
}   