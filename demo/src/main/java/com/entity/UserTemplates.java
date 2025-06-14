package com.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "userTemplates")
public class UserTemplates {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String templateName;
    private String templateType;

    @Temporal(TemporalType.TIMESTAMP)
    private Date saveDate;

    @Lob
    private String templateData; //store JSON as a string

    @ManyToOne
    @JoinColumn(name = "userId", referencedColumnName = "id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "projectId", referencedColumnName = "id")
    private Project project;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTemplateName() {
        return templateName;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }

    public String getTemplateType() {
        return templateType;
    }

    public void setTemplateType(String templateType) {
        this.templateType = templateType;
    }

    public Date getSaveDate() {
        return saveDate;
    }

    public void setSaveDate(Date saveDate) {
        this.saveDate = saveDate;
    }

    public String getTemplateData(){
        return templateData;
    }

    public void setTemplateData(String templateData){
        this.templateData = templateData;
    }

    public User getUser(){
        return user;
    }

    public void setUser(User user){
        this.user = user;
    }

    public Project getProject(){
        return project;
    }

    public void setProject(Project project){
        this.project = project;
    }
}
