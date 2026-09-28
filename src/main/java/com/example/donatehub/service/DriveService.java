package com.example.donatehub.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.donatehub.dto.DriveRequest;
import com.example.donatehub.entity.Drive;
import com.example.donatehub.exception.BusinessRuleException;
import com.example.donatehub.exception.ResourceNotFoundException;
import com.example.donatehub.repository.DriveRepository;

@Service
public class DriveService {

    private final DriveRepository driveRepository;

    public DriveService(DriveRepository driveRepository) {
        this.driveRepository = driveRepository;
    }

    public Drive createDrive(DriveRequest request) {

        validateDates(request);

        Drive drive = new Drive(
                request.getName(),
                request.getStartDate(),
                request.getEndDate()
        );

        return driveRepository.save(drive);
    }

    public List<Drive> getAllDrives() {
        return driveRepository.findAll();
    }

    public Drive getDriveById(Long id) {
        return driveRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Drive with ID " + id + " not found"
                        )
                );
    }

    public Drive updateDrive(Long id, DriveRequest request) {

        validateDates(request);

        Drive drive = getDriveById(id);

        drive.setName(request.getName());
        drive.setStartDate(request.getStartDate());
        drive.setEndDate(request.getEndDate());

        return driveRepository.save(drive);
    }

    public void deleteDrive(Long id) {

        Drive drive = getDriveById(id);

        driveRepository.delete(drive);
    }

    private void validateDates(DriveRequest request) {

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BusinessRuleException(
                    "End date cannot be before start date"
            );
        }
    }
}