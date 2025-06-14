package com.entity;

import java.sql.Date;

import jakarta.annotation.Generated;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "widgets")
public class Widget {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long widgetId;

    @Column(name = "widget_type")
    private String widgetType;

    @Column(name = "widget_title")
    private String widgetTitle;
    private Integer positionX;
    private Integer positionY;

    @Lob
    private String widgetSettings;

    @ManyToOne
    @JoinColumn(name = "projectId")
    private Project project;

    private Date createdAt;
    private Date updatedAt;
    public Long getWidgetId() {
        return widgetId;
    }
    public void setWidgetId(Long widgetId) {
        this.widgetId = widgetId;
    }
    public String getWidgetType() {
        return widgetType;
    }
    public void setWidgetType(String widgetType) {
        this.widgetType = widgetType;
    }
    public String getWidgetTitle() {
        return widgetTitle;
    }
    public void setWidgetTitle(String widgetTitle) {
        this.widgetTitle = widgetTitle;
    }
    public Integer getPositionX() {
        return positionX;
    }
    public void setPositionX(Integer positionX) {
        this.positionX = positionX;
    }
    public Integer getPositionY() {
        return positionY;
    }
    public void setPositionY(Integer positionY) {
        this.positionY = positionY;
    }
    public String getWidgetSettings() {
        return widgetSettings;
    }
    public void setWidgetSettings(String widgetSettings) {
        this.widgetSettings = widgetSettings;
    }
    public Project getProject() {
        return project;
    }
    public void setProject(Project project) {
        this.project = project;
    }
    public Date getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
    public Date getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    
}
