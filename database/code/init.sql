USE appointment;

CREATE TABLE IF NOT EXISTS User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    role VARCHAR(50) DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS Pets (
    pet_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    pet_name VARCHAR(255) NOT NULL,
    species VARCHAR(255) NOT NULL,
    breed VARCHAR(255),
    bloodtype VARCHAR(10),
    birth_date DATE,
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
    app_time TIME
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (pet_id) REFERENCES Pets(pet_id),
    FOREIGN KEY (doc_id) REFERENCES Doctors(doc_id)
);

CREATE TABLE IF NOT EXISTS Medical_records (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    pet_id INT,
    doc_id INT,
    app_id INT,
    diagnosis TEXT,
    treatment_detail TEXT,
    cost DECIMAL(10, 2),
    treatment_date DATE,
    treatment_time TIME
    FOREIGN KEY (pet_id) REFERENCES Pets(pet_id),
    FOREIGN KEY (doc_id) REFERENCES Doctors(doc_id),
    FOREIGN KEY (app_id) REFERENCES Appointments(app_id)
);

CREATE TABLE IF NOT EXISTS Doctors (
    doc_id INT AUTO_INCREMENT PRIMARY KEY,
    doc_name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE
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
    FOREIGN KEY (doc_id) REFERENCES Doctors(doc_id),
    FOREIGN KEY (record_id) REFERENCES Medical_records(record_id)
);