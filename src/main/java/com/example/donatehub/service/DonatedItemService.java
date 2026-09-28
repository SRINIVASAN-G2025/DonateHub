package com.example.donatehub.service;

import com.example.donatehub.dto.DistributionRequest;
import com.example.donatehub.dto.DonationRequest;
import com.example.donatehub.entity.DonatedItem;
import com.example.donatehub.entity.Drive;
import com.example.donatehub.entity.Donor;
import com.example.donatehub.entity.Recipient;
import com.example.donatehub.exception.BusinessRuleException;
import com.example.donatehub.exception.ResourceNotFoundException;
import com.example.donatehub.repository.DonatedItemRepository;
import com.example.donatehub.repository.DriveRepository;
import com.example.donatehub.repository.DonorRepository;
import com.example.donatehub.repository.RecipientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DonatedItemService {

    private final DonatedItemRepository donatedItemRepository;
    private final DriveRepository driveRepository;
    private final DonorRepository donorRepository;
    private final RecipientRepository recipientRepository;

    public DonatedItemService(
            DonatedItemRepository donatedItemRepository,
            DriveRepository driveRepository,
            DonorRepository donorRepository,
            RecipientRepository recipientRepository
    ) {
        this.donatedItemRepository = donatedItemRepository;
        this.driveRepository = driveRepository;
        this.donorRepository = donorRepository;
        this.recipientRepository = recipientRepository;
    }

    public DonatedItem createDonation(DonationRequest request) {

        Drive drive = driveRepository.findById(request.getDriveId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Drive with ID " + request.getDriveId() + " not found"
                        )
                );

        Donor donor = donorRepository.findById(request.getDonorId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Donor with ID " + request.getDonorId() + " not found"
                        )
                );

        validateDonationDate(request, drive);

        DonatedItem item = new DonatedItem();

        item.setCategory(request.getCategory());
        item.setCondition(request.getCondition());
        item.setDonationDate(request.getDonationDate());
        item.setDrive(drive);
        item.setDonor(donor);
        item.setDistributed(false);

        return donatedItemRepository.save(item);
    }

    public List<DonatedItem> getAllItems() {
        return donatedItemRepository.findAll();
    }

    public DonatedItem getItemById(Long id) {

        return donatedItemRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Donated item with ID " + id + " not found"
                        )
                );
    }

    public List<DonatedItem> getAvailableItems() {
        return donatedItemRepository.findByDistributedFalse();
    }

    public List<DonatedItem> getItemsByCategory(String category) {
        return donatedItemRepository.findByCategoryIgnoreCase(category);
    }

    public List<DonatedItem> getItemsByDrive(Long driveId) {

        if (!driveRepository.existsById(driveId)) {
            throw new ResourceNotFoundException(
                    "Drive with ID " + driveId + " not found"
            );
        }

        return donatedItemRepository.findByDriveId(driveId);
    }

    @Transactional
    public DonatedItem distributeItem(
            Long itemId,
            DistributionRequest request
    ) {

        DonatedItem item = getItemById(itemId);

        if (item.isDistributed()) {
            throw new BusinessRuleException(
                    "Item has already been distributed"
            );
        }

        Recipient recipient = recipientRepository
                .findById(request.getRecipientId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Recipient with ID "
                                        + request.getRecipientId()
                                        + " not found"
                        )
                );

        if (request.getDistributionDate()
                .isBefore(item.getDonationDate())) {

            throw new BusinessRuleException(
                    "Distribution date cannot be before donation date"
            );
        }

        item.setRecipient(recipient);
        item.setDistributionDate(request.getDistributionDate());
        item.setDistributed(true);

        return donatedItemRepository.save(item);
    }

    public long getTotalItemsForDrive(Long driveId) {

        return donatedItemRepository.countByDriveId(driveId);
    }

    public long getDistributedItemsForDrive(Long driveId) {

        return donatedItemRepository
                .countByDriveIdAndDistributedTrue(driveId);
    }

    public long getAvailableItemsForDrive(Long driveId) {

        return donatedItemRepository
                .countByDriveIdAndDistributedFalse(driveId);
    }

    private void validateDonationDate(
            DonationRequest request,
            Drive drive
    ) {

        if (request.getDonationDate()
                .isBefore(drive.getStartDate())
                ||
                request.getDonationDate()
                        .isAfter(drive.getEndDate())) {

            throw new BusinessRuleException(
                    "Donation date must be within the drive dates"
            );
        }
    }
}