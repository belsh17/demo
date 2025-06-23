package com.entity;

import java.sql.Date;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "files")
public class FileEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;
    private String filetype;
    private String filepath;
    private Long size;

    // @Lob
    // private byte[] content;

    private Date uploadedAt;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = true)
    //@JsonIgnoreProperties({"tasks", "files", "teams"})
    @JsonBackReference
    private Project project;

    public FileEntity(){}

    public String getFilename() {
        return filename;
    }

    

    public FileEntity(Long id, String filename, String filetype, String filepath, Long size, Date uploadedAt,
            Project project) {
        this.id = id;
        this.filename = filename;
        this.filetype = filetype;
        this.filepath = filepath;
        this.size = size;
        this.uploadedAt = uploadedAt;
        this.project = project;
    }

    public void setFilename(String fileName) {
        this.filename = fileName;
    }

    public Date getUploadedAt() {
        return uploadedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUploadedAt(Date uploadedAt) {
        this.uploadedAt = uploadedAt;
    }


    public String getFilepath() {
        return filepath;
    }


    public void setFilepath(String filepath) {
        this.filepath = filepath;
    }


    public String getFiletype() {
        return filetype;
    }


    public void setFiletype(String filetype) {
        this.filetype = filetype;
    }


    public Long getSize() {
        return size;
    }


    public void setSize(Long size) {
        this.size = size;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }
    

}
