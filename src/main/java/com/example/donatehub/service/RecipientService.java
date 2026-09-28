package com.example.donatehub.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.donatehub.entity.Recipient;
import com.example.donatehub.exception.ResourceNotFoundException;
import com.example.donatehub.repository.RecipientRepository;

@Service
public class RecipientService {

    private final RecipientRepository recipientRepository;

    public RecipientService(RecipientRepository recipientRepository) {
        this.recipientRepository = recipientRepository;
    }

    public Recipient createRecipient(Recipient recipient) {
        return recipientRepository.save(recipient);
    }

    public List<Recipient> getAllRecipients() {
        return recipientRepository.findAll();
    }

    public Recipient getRecipientById(Long id) {
        return recipientRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Recipient with ID " + id + " not found"
                        )
                );
    }

    public Recipient updateRecipient(
            Long id,
            Recipient recipientDetails
    ) {

        Recipient recipient = getRecipientById(id);

        recipient.setName(recipientDetails.getName());
        recipient.setOrganization(recipientDetails.getOrganization());

        return recipientRepository.save(recipient);
    }

    public void deleteRecipient(Long id) {

        Recipient recipient = getRecipientById(id);

        recipientRepository.delete(recipient);
    }
}