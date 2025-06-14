package com.dto;

import java.time.LocalDate;

public class SPointDTO {
    
    private LocalDate date;
    private double progressPercentage;

    public SPointDTO(LocalDate date, double progressPercentage){
        this.date = date;
        this.progressPercentage = progressPercentage;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public double getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(double progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    
}
