package com.controllers;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import com.entity.FileEntity;
import com.entity.Project;

import com.repository.FileUploadRepository;
import com.repository.ProjectRepository;

import io.micrometer.core.ipc.http.HttpSender.Response;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"}) 
@RequestMapping("/api/")
public class FileUploadController {

    @Autowired
    private FileUploadRepository fileUploadRepository;

    @Autowired
    private ProjectRepository projectRepository;
    
    //handles file uploads (not tied to specific project)
    @PostMapping(value = "/files/upload", consumes = {"multipart/form-data"})
    public ResponseEntity<String> handleFileUpload(
        @RequestParam("files") MultipartFile[] files
    ) {
        
       try{
         for(MultipartFile file : files){
            //extract orihginal filename
            String filename = Paths.get(file.getOriginalFilename()).getFileName().toString();
            //generate unique filename to avoid collisions
            String uniqueFileName = UUID.randomUUID() + "_" + filename;
            //set the path to where the file will be saved
            String path = "uploads/" + uniqueFileName;

            //creates file destination object
            File destination = new File(path);
            File parentDir = destination.getParentFile();

            //create directory if it doesnt exist
            if(!parentDir.exists()){
                boolean created = parentDir.mkdirs();
                if(!created){
                    return ResponseEntity.status(500).body("Could not create upload directory.");
                }
            }

            //save file to localstorage 
            //destination.getParentFile().mkdirs(); //makes sure /uploads exists creates directory tree if needed
            file.transferTo(destination);

            //only saving file metadata to mysql
            FileEntity fileEntity = new FileEntity();
            fileEntity.setFilename(filename);
            fileEntity.setFilepath(path);
            fileEntity.setFiletype(file.getContentType());
            fileEntity.setSize(file.getSize());
            fileEntity.setUploadedAt(new java.sql.Date(System.currentTimeMillis()));

            fileUploadRepository.save(fileEntity);

            System.out.println("Received file: " + file.getOriginalFilename());
        }
        return ResponseEntity.ok("Files uploaded successfully.");
        
       } catch (IOException e){
        e.printStackTrace();
        return ResponseEntity.status(500).body("Failed to upload files.");
       }
        
        
    }

     //upload files for specific project
    @PostMapping(value = "/projects/{projectId}/files/upload", consumes = {"multipart/form-data"})
    public ResponseEntity<?> handleProjectFileUpload(
    @PathVariable Long projectId,
    @RequestParam("files") MultipartFile[] files){
        try{
            //check if project exists
            Optional<Project> projectOpt = projectRepository.findById(projectId);

            if(!projectOpt.isPresent()){
                return ResponseEntity.badRequest().body("Project not found with ID: " + projectId);
            }

            Project project = projectOpt.get();

            for(MultipartFile file : files){
                String filename = Paths.get(file.getOriginalFilename()).getFileName().toString();
                String uniqueFileName = UUID.randomUUID() + "_" + filename;
                //String path = "uploads/projects/" + projectId + "/" + uniqueFileName;
                //define the project- specific upload directory
                String uploadDir = System.getProperty("user.dir") + "uploads/projects/" + projectId;
                //save file to local storage in project specific dir.adminController
                //create destinatioin file object
                File destination = new File(uploadDir, uniqueFileName);
                File parentDir = destination.getParentFile();

                //create directories if needed
                if(!parentDir.exists()){
                    boolean created = parentDir.mkdirs();
                    if(!created){
                        return ResponseEntity.status(500).body("Could not create upload directory");

                    }
                }

                //save file to disk
                file.transferTo(destination);

                //create and save file metadata linked to the project
                FileEntity fileEntity = new FileEntity();

                fileEntity.setFilename(filename);
                fileEntity.setFilepath(destination.getAbsolutePath());
                fileEntity.setFiletype(file.getContentType());
                fileEntity.setSize(file.getSize());
                fileEntity.setUploadedAt(new java.sql.Date(System.currentTimeMillis()));
                fileEntity.setProject(project);

                fileUploadRepository.save(fileEntity);

                System.out.println("Uploaded file for project " + projectId + ": " + file.getOriginalFilename());
            }

            //return updated list of files
            List<FileEntity> projectFiles = fileUploadRepository.findByProjectId(projectId);
            return ResponseEntity.ok(projectFiles);

        }catch(IOException e){
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to upload files: " + e.getMessage());
        }
    }

    //get all uploaded files for specific project
    @GetMapping("/projects/{projectId}/files")
    public ResponseEntity<List<FileEntity>> getProjectFiles(
        @PathVariable Long projectId) {

        try{
            //check if project exists
            if(!projectRepository.existsById(projectId)){
                return ResponseEntity.notFound().build();
            }

            //retrieve and return all files linked to the project
            List<FileEntity> projectFiles = fileUploadRepository.findByProjectId(projectId);
            return ResponseEntity.ok(projectFiles);
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }

    }
    
//delete a file associated with a specific project
    @DeleteMapping("/projects/{projectId}/files/{fileId}")
    public ResponseEntity<?> deleteProjectFiles(
        @PathVariable Long projectId,
        @PathVariable Long fileId
    ){

        try{
            Optional<FileEntity> fileOpt = fileUploadRepository.findById(fileId);
            if(!fileOpt.isPresent()){
                return ResponseEntity.notFound().build();
            }

            FileEntity fileEntity = fileOpt.get();

            //chceck if file belongs to the specified project
            if(fileEntity.getProject() == null || !fileEntity.getProject().getId().equals(projectId)){
                return ResponseEntity.badRequest().body("File does not belong to the specified project");

            }

            //delete physical file from disk
            File physicalFile = new File(fileEntity.getFilepath());
            if(physicalFile.exists()){
                boolean deleted = physicalFile.delete();
                if(!deleted){
                    System.out.println("Warning: Could not delete phsyical file: " + fileEntity.getFilepath());
                }
            }

            //delete file metadata from db
            fileUploadRepository.delete(fileEntity);

            return ResponseEntity.ok().body("File deleted successfully");
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to delete file: " + e.getMessage());
        }
    }
    

    //download/view file by ID
    @GetMapping("/files/{fileId}")
    public ResponseEntity<Resource> downloadFile(
        @PathVariable Long fileId) {

            try{
                Optional<FileEntity> fileOpt = fileUploadRepository.findById(fileId);
                if(!fileOpt.isPresent()){
                    return ResponseEntity.notFound().build();
                }

                FileEntity fileEntity = fileOpt.get();
                Path filePath = Paths.get(fileEntity.getFilepath());
                Resource resource = new UrlResource(filePath.toUri());

                //check if file exists and is accessible
                if(!resource.exists() || !resource.isReadable()){
                    return ResponseEntity.notFound().build();
                }

                //determine content type, fallback to binary
                String contentType = fileEntity.getFiletype();
                if(contentType == null){
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileEntity.getFilename() + "\"")
                    .body(resource);
            }catch(MalformedURLException e){
                e.printStackTrace();
                return ResponseEntity.status(500).build();
            }
    }
    
}
