package com.repository;

//import java.io.File;
import com.entity.FileEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.io.File;
import java.sql.Date;


public interface FileUploadRepository extends JpaRepository<FileEntity, Long>{
    //find all files for specific project
    @Query("SELECT f FROM FileEntity f WHERE f.project.id = :projectId ORDER BY f.uploadedAt DESC")
    List<FileEntity> findByProjectId(@Param("projectId") Long projectId);

    //find files by fileName
    List<FileEntity> findByFilenameContainingIgnoreCase(String filename);

    //find files by project and filename
    @Query("SELECT f FROM FileEntity f WHERE f.project.id = :projectId AND f.filename = :filename")
    List<FileEntity> findByProjectAndFilename(@Param("projectId") Long projectId, @Param("filename") String filename);

    
}
