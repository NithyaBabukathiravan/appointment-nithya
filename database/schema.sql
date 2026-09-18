-- Simple Appointment Record System
-- Database: MySQL (adjust types slightly if using PostgreSQL)

CREATE DATABASE IF NOT EXISTS appointment_db;
USE appointment_db;

CREATE TABLE IF NOT EXISTS appointments (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    name              VARCHAR(255)      NOT NULL,
    email             VARCHAR(255)      NOT NULL,
    phone             VARCHAR(20)       NOT NULL,
    appointment_date  DATE              NOT NULL,
    reason            VARCHAR(500)      NOT NULL,
    status            ENUM('PENDING', 'CONFIRMED') NOT NULL DEFAULT 'PENDING',
    created_at        TIMESTAMP         DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP         DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample data (optional, matches the SRS example table)
INSERT INTO appointments (name, email, phone, appointment_date, reason, status)
VALUES
    ('Arun', 'anbu@mail.com', '9876543210', '2026-09-20', 'Checkup', 'PENDING'),
    ('Priya', 'priya@mail.com', '9876543211', '2026-09-21', 'Review', 'CONFIRMED');
