package com.ycity.api.model;

import java.util.Date;

public class Visit extends BaseEntity {
    private Date date;
    private String department;
    private String description;
    private String providerName;

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getProviderName() {
        return providerName;
    }

    public void setProviderName(String providerName) {
        this.providerName = providerName;
    }

    @Override public String toString() {
        return "Visit{" +
            "date=" + date +
            ", department='" + department + '\'' +
            ", description='" + description + '\'' +
            ", providerName='" + providerName + '\'' +
            '}';
    }
}
