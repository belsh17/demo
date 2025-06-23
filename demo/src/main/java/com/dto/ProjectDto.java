package com.dto;

import java.time.LocalDate;


//Dto is used if you want data in a different shape...ie a name instead of ID 
//therefore i want manager name linked with id
public class ProjectDto {

    private Long id;
        private String projectName;
        private String projDescription;
        private LocalDate creationDate;
        private LocalDate deadlineDate;
        private LocalDate startDate;
        private String clientName;
        private String clientAccount;
        private String managerName;
        private Long createdBy;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }
        public String getProjectName() {
            return projectName;
        }

        public void setProjectName(String projectName) {
            this.projectName = projectName;
        }

        public String getProjDescription() {
            return projDescription;
        }

        public void setProjDescription(String projDescription) {
            this.projDescription = projDescription;
        }

        public LocalDate getCreationDate() {
            return creationDate;
        }

        public void setCreationDate(LocalDate creationDate) {
            this.creationDate = creationDate;
        }

        public LocalDate getDeadlineDate() {
            return deadlineDate;
        }

        public void setDeadlineDate(LocalDate deadlineDate) {
            this.deadlineDate = deadlineDate;
        }

        public LocalDate getStartDate() {
            return startDate;
        }

        public void setStartDate(LocalDate startDate) {
            this.startDate = startDate;
        }

        public String getClientName() {
            return clientName;
        }

        public void setClientName(String clientName) {
            this.clientName = clientName;
        }

        public String getClientAccount() {
            return clientAccount;
        }

        public void setClientAccount(String clientAccount) {
            this.clientAccount = clientAccount;
        }

        public String getManagerName() {
            return managerName;
        }

        public void setManagerName(String managerName) {
            this.managerName = managerName;
        }

        public Long getCreatedBy() {
            return createdBy;
        }

        public void setCreatedBy(Long createdBy) {
            this.createdBy = createdBy;
        }
}
