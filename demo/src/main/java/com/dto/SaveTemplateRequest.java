package com.dto;

public class SaveTemplateRequest {
    public String templateName;
    public String templateType;
    public String templateData;
    //public Long userId;
    public Long projectId;
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
    public String getTemplateData() {
        return templateData;
    }
    public void setTemplateData(String templateData) {
        this.templateData = templateData;
    }
    // public Long getUserId() {
    //     return userId;
    // }
    // public void setUserId(Long userId) {
    //     this.userId = userId;
    // }
    public Long getProjectId() {
        return projectId;
    }
    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    
}
