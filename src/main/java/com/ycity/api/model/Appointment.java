package com.ycity.api.model;

import com.ycity.api.appointment.AppointmentType;

import java.util.Date;

public class Appointment extends BaseEntity {
    private Long visitId;
    private Date startDate;
    private Date endDate;
    private String department;
    private String description;
    private AppointmentType appointmentType;

    public Long getVisitId() {
        return visitId;
    }

    public void setVisitId(Long visitId) {
        this.visitId = visitId;
    }

    public Date getDate() {
        return startDate;
    }

    public void setDate(Date date) {
        this.startDate = date;
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

    public AppointmentType getAppointmentType() {
        return appointmentType;
    }

    public void setAppointmentType(AppointmentType appointmentType) {
        this.appointmentType = appointmentType;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    @Override public String toString() {
        return "Appointment{" +
            "visitId=" + visitId +
            ", startDate=" + startDate +
            ", endDate=" + endDate +
            ", department='" + department + '\'' +
            ", description='" + description + '\'' +
            ", appointmentType=" + appointmentType +
            '}';
    }
}
