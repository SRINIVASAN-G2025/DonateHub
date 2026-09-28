package com.example.donatehub.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "donated_items")
public class DonatedItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_condition", nullable = false)
    private ItemCondition condition;

    @Column(nullable = false)
    private LocalDate donationDate;

    private LocalDate distributionDate;

    @Column(nullable = false)
    private boolean distributed = false;

    @ManyToOne
    @JoinColumn(name = "drive_id", nullable = false)
    private Drive drive;

    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor;

    @ManyToOne
    @JoinColumn(name = "recipient_id")
    private Recipient recipient;

    public DonatedItem() {
    }

    public Long getId() {
        return id;
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

    public LocalDate getDistributionDate() {
        return distributionDate;
    }

    public void setDistributionDate(LocalDate distributionDate) {
        this.distributionDate = distributionDate;
    }

    public boolean isDistributed() {
        return distributed;
    }

    public void setDistributed(boolean distributed) {
        this.distributed = distributed;
    }

    public Drive getDrive() {
        return drive;
    }

    public void setDrive(Drive drive) {
        this.drive = drive;
    }

    public Donor getDonor() {
        return donor;
    }

    public void setDonor(Donor donor) {
        this.donor = donor;
    }

    public Recipient getRecipient() {
        return recipient;
    }

    public void setRecipient(Recipient recipient) {
        this.recipient = recipient;
    }
}