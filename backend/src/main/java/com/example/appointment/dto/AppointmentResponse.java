package com.example.appointment.dto;

import com.example.appointment.model.Appointment;
import com.example.appointment.model.AppointmentStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class AppointmentResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private LocalDate appointmentDate;
    private String reason;
    private AppointmentStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AppointmentResponse(Appointment a) {
        this.id = a.getId();
        this.name = a.getName();
        this.email = a.getEmail();
        this.phone = a.getPhone();
        this.appointmentDate = a.getAppointmentDate();
        this.reason = a.getReason();
        this.status = a.getStatus();
        this.createdAt = a.getCreatedAt();
        this.updatedAt = a.getUpdatedAt();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public String getReason() {
        return reason;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
