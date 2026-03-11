USE appointment_db;

CREATE TABLE IF NOT EXISTS User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    nickname VARCHAR(255),
    phone VARCHAR(20),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(50) DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS Pets (
    pet_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    pet_name VARCHAR(255) NOT NULL,
    species VARCHAR(255) NOT NULL,
    bloodtype VARCHAR(10),
    birth_date DATE,
    weight DECIMAL(5,2),
    allergy TEXT,
    breed VARCHAR(255),
    gender VARCHAR(10),
    image_url TEXT,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE IF NOT EXISTS Doctor (
    doc_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    specialization VARCHAR(255),
    work_time TEXT,
    is_available TEXT,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE IF NOT EXISTS Appointments (
    app_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    pet_id INT,
    doc_id INT,
    reason TEXT,
    status VARCHAR(50),
    app_date DATE,
    app_time TIME,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (pet_id) REFERENCES Pets(pet_id),
    FOREIGN KEY (doc_id) REFERENCES Doctor(doc_id)
);

CREATE TABLE IF NOT EXISTS MedicalRecords (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    pet_id INT,
    doc_id INT,
    app_id INT,
    diagnosis TEXT,
    treatment_detail TEXT,
    cost DECIMAL(10,2),
    treatment_date DATE,
    treatment_time TIME,
    FOREIGN KEY (pet_id) REFERENCES Pets(pet_id),
    FOREIGN KEY (doc_id) REFERENCES Doctor(doc_id),
    FOREIGN KEY (app_id) REFERENCES Appointments(app_id)
);

CREATE TABLE IF NOT EXISTS Fact_table (
    fact_id INT AUTO_INCREMENT PRIMARY KEY,
    app_id INT,
    user_id INT,
    pet_id INT,
    doc_id INT,
    record_id INT,
    FOREIGN KEY (app_id) REFERENCES Appointments(app_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (pet_id) REFERENCES Pets(pet_id),
    FOREIGN KEY (doc_id) REFERENCES Doctor(doc_id),
    FOREIGN KEY (record_id) REFERENCES MedicalRecords(record_id)
);

INSERT INTO User (username, password, full_name, phone, image_url, role) VALUES
('Donno', '123', 'TC', '1234567890', '', 'user'),
('Donno2', '123', 'Dr.TC', '0987654321', '', 'doctor');

INSERT INTO Pets (user_id, pet_name, species, bloodtype, birth_date, weight, allergy, breed, gender, image_url) VALUES
(1, 'Buddy', 'Dog', 'A', '2018-05-20', 12.5, 'None', 'Labrador', 'Male', ''),
(1, 'Mittens', 'Cat', 'B', '2019-08-15', 4.3, 'Fish', 'Siamese', 'Female', '');

INSERT INTO Doctor (user_id, specialization, is_available) VALUES
(2, 'Veterinarian', 'Yes');

INSERT INTO Appointments (user_id, pet_id, doc_id, reason, status, app_date, app_time) VALUES
(1, 1, 1, 'Regular Checkup', 'Scheduled', '2024-07-01', '10:00:00'),
(1, 2, 1, 'Vaccination', 'Scheduled', '2024-07-02', '14:00:00');

INSERT INTO MedicalRecords (pet_id, doc_id, app_id, diagnosis, treatment_detail, treatment_date, treatment_time) VALUES
(1, 1, 1, 'Healthy', 'Regular checkup with no issues found.', '2024-07-01', '10:30:00'),
(2, 1, 2, 'Needs Vaccination', 'Administered rabies vaccine.', '2024-07-02', '14:30:00');