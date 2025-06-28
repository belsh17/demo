package com.dto;

import java.util.Date;

import com.entity.UserTemplates;

public class UserTemplateResponseDto {

    public Long id;
    public String templateName;
    public String templateType;
    public String templateData;
    public Date saveDate;
    public Long projectId;
    public Long userId;
    public String username;

    public UserTemplateResponseDto(UserTemplates template) {
        this.id = template.getId();
        this.templateName = template.getTemplateName();
        this.templateType = template.getTemplateType();
        this.templateData = template.getTemplateData();
        this.saveDate = template.getSaveDate();
        this.projectId = template.getProject() != null ? template.getProject().getId() : null;
        this.userId = template.getUser() != null ? template.getUser().getId() : null;
        this.username = template.getUser().getUsername();
    }

    
}
