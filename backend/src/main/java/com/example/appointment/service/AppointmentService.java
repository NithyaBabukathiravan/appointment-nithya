package com.example.appointment.service;

import com.example.appointment.dto.AppointmentRequest;
import com.example.appointment.dto.AppointmentResponse;
import com.example.appointment.dto.StatusUpdateRequest;
import com.example.appointment.exception.ResourceNotFoundException;
import com.example.appointment.model.Appointment;
import com.example.appointment.model.AppointmentStatus;
import com.example.appointment.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository repository;

    public AppointmentService(AppointmentRepository repository) {
        this.repository = repository;
    }

    public AppointmentResponse create(AppointmentRequest req) {
        Appointment appointment = new Appointment();
        applyRequest(appointment, req);
        appointment.setStatus(AppointmentStatus.PENDING); // always starts as PENDING
        Appointment saved = repository.save(appointment);
        return new AppointmentResponse(saved);
    }

    public List<AppointmentResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(AppointmentResponse::new)
                .collect(Collectors.toList());
    }

    public AppointmentResponse getOne(Long id) {
        Appointment appointment = findOrThrow(id);
        return new AppointmentResponse(appointment);
    }

    public AppointmentResponse update(Long id, AppointmentRequest req) {
        Appointment appointment = findOrThrow(id);
        applyRequest(appointment, req);
        Appointment saved = repository.save(appointment);
        return new AppointmentResponse(saved);
    }

    public void delete(Long id) {
        Appointment appointment = findOrThrow(id);
        repository.delete(appointment);
    }

    public AppointmentResponse updateStatus(Long id, StatusUpdateRequest req) {
        Appointment appointment = findOrThrow(id);
        appointment.setStatus(req.getStatus());
        Appointment saved = repository.save(appointment);
        return new AppointmentResponse(saved);
    }

    private Appointment findOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
    }

    private void applyRequest(Appointment appointment, AppointmentRequest req) {
        appointment.setName(req.getName());
        appointment.setEmail(req.getEmail());
        appointment.setPhone(req.getPhone());
        appointment.setAppointmentDate(req.getAppointmentDate());
        appointment.setReason(req.getReason());
    }
}
