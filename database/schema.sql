CREATE DATABASE luct_reportings;
USE luct_reportings;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    role ENUM('student', 'lecturer', 'prl', 'pl'),
    faculty VARCHAR(100)
);

CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    code VARCHAR(20),
    semester INT,
    total_registered_students INT,
    assigned_lecturer_id INT,
    FOREIGN KEY (assigned_lecturer_id) REFERENCES users(id)
);

CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    class_name VARCHAR(50),
    venue VARCHAR(100),
    scheduled_time TIME,
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    faculty_name VARCHAR(100),
    class_id INT,
    week INT,
    date DATE,
    course_id INT,
    lecturer_id INT,
    actual_students_present INT,
    total_registered_students INT,
    venue VARCHAR(100),
    scheduled_time TIME,
    topic_taught TEXT,
    learning_outcomes TEXT,
    recommendations TEXT,
    prl_feedback TEXT,
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (lecturer_id) REFERENCES users(id)
);

CREATE TABLE ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_id INT,
    rater_id INT,
    rating INT,
    comments TEXT,
    FOREIGN KEY (report_id) REFERENCES reports(id),
    FOREIGN KEY (rater_id) REFERENCES users(id)
);

CREATE TABLE monitoring (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100),
    timestamp DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
