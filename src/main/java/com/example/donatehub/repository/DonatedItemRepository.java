package com.example.donatehub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.donatehub.entity.DonatedItem;

public interface DonatedItemRepository extends JpaRepository<DonatedItem, Long> {

    List<DonatedItem> findByDistributedFalse();

    List<DonatedItem> findByCategoryIgnoreCase(String category);

    List<DonatedItem> findByDriveId(Long driveId);

    long countByDriveId(Long driveId);

    long countByDriveIdAndDistributedTrue(Long driveId);

    long countByDriveIdAndDistributedFalse(Long driveId);
}