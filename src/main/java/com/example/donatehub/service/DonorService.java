package com.example.donatehub.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.donatehub.entity.Donor;
import com.example.donatehub.exception.ResourceNotFoundException;
import com.example.donatehub.repository.DonorRepository;

@Service
public class DonorService {

    private final DonorRepository donorRepository;

    public DonorService(DonorRepository donorRepository) {
        this.donorRepository = donorRepository;
    }

    public Donor createDonor(Donor donor) {
        return donorRepository.save(donor);
    }

    public List<Donor> getAllDonors() {
        return donorRepository.findAll();
    }

    public Donor getDonorById(Long id) {
        return donorRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Donor with ID " + id + " not found"
                        )
                );
    }

    public Donor updateDonor(Long id, Donor donorDetails) {

        Donor donor = getDonorById(id);

        donor.setName(donorDetails.getName());
        donor.setEmail(donorDetails.getEmail());

        return donorRepository.save(donor);
    }

    public void deleteDonor(Long id) {

        Donor donor = getDonorById(id);

        donorRepository.delete(donor);
    }
}