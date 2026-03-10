require("dotenv").config()
const express = require("express")
const mysql = require("mysql2/promise")
const cors = require("cors")
const bcrypt = require("bcrypt")
const path = require("path")
const app = express()

app.use(cors())
app.use(express.json())

const currentDatabase = process.env.DB_NAME
const saltRounds = 10

const query = async (sql, params) => {
  const [rows] = await db.query(sql, params);
  return rows;
};

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: currentDatabase,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: true,
  charset: 'utf8mb4'
})



//get health status
app.get("/health", async (req, res) => {
  res.status(200).json({ status: "Online" })
})

// Get all tables
app.get("/tables", async (req, res) => {
  try {
    const [rows] = await db.query("SHOW TABLES");
    res.json(rows);
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM `User`");
    res.json(rows);
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ------------------------------------------------ USER -------------------------------------------------

// Register
app.post("/register", async (req, res) => {
  try {
    const { username, password, confirm_password } = req.body;

    if (!username || !password || !confirm_password) {
      return res.status(400).json({
        error: true,
        message: "Username and password are required"
      });
    }

    if (password !== confirm_password) {
      return res.status(400).json({
        error: true,
        message: "Passwords do not match"
      });
    }
    const [existingUser] = await db.query(
      "SELECT username FROM `User` WHERE username = ?",
      [username]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        error: true,
        message: "This username is already taken"
      });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await db.query(
      "INSERT INTO `User` (username, password, full_name, phone) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, "", ""]
    );

    res.status(201).json({
      error: false,
      message: "Registration successful!"
    });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({
      error: true,
      message: "Internal Server Error"
    });
  }
});

// Register for Doctor
app.post("/register/doctor", async (req, res) => {
  try {
    const { username, password, confirm_password } = req.body;

    if (!username || !password || !confirm_password) {
      return res.status(400).json({
        error: true,
        message: "Username and password are required"
      });
    }

    if (password !== confirm_password) {
      return res.status(400).json({
        error: true,
        message: "Passwords do not match"
      });
    }
    const [existingUser] = await db.query(
      "SELECT username FROM `User` WHERE username = ?",
      [username]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        error: true,
        message: "This username is already taken"
      });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await db.query(
      "INSERT INTO `User` (username, password, full_name, phone, role) VALUES (?, ?, ?, ?, ?)",
      [username, hashedPassword, "", "", "doctor"]
    );

    res.status(201).json({
      error: false,
      message: "Registration successful!"
    });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({
      error: true,
      message: "Internal Server Error"
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: true,
        message: "Username and password are required"
      });
    }

    const [users] = await db.query(
      "SELECT user_id, username, password WHERE username = ?",
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        error: true,
        message: "Invalid username or password"
      });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: true,
        message: "Invalid username or password"
      });
    }

    res.json({
      error: false,
      message: "Login successful",
      username: user.username,
      role: user.role
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({
      error: true,
      message: "Internal Server Error"
    });
  }
});

app.get("/infoUser/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const [rows] = await db.query(
      "SELECT user_id, username, full_name, phone FROM `User` WHERE user_id = ?",
      [user_id]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error("Get User Info Error:", err);
    res.status(500).json({
      error: true,
      message: "Internal Server Error"
    });
  }
});


app.put("/updateUser/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { full_name, phone } = req.body;
    await db.query(
      "UPDATE `User` SET full_name = ?, phone = ? WHERE user_id = ?",
      [full_name, phone, user_id]
    );

    res.json({
      error: false,
      message: "User updated successfully"
    });
  } catch (err) {
    console.error("Update User Error:", err);
    res.status(500).json({
      error: true,
      message: "Internal Server Error"
    });
  }
});

// ------------------------------------------------- PET PART -------------------------------------------------

app.post("/insertPet/:user_id", async (req, res) => {
  try {
    const { pet_name, pet_type, pet_breed, pet_age } = req.body;
    const { user_id } = req.params;

    await db.query(
      "INSERT INTO `Pets` (pet_name, species, birth_date, user_id) VALUES (?, ?, ?, ?)",
      [pet_name, pet_type, pet_age, user_id]
    );

    res.status(201).json({
      error: false,
      message: "Pet added successfully!"
    });
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getpets/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const [rows] = await db.query(
      "SELECT pet_name FROM `Pets` WHERE user_id = ?",
      [user_id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/infopet/:pet_id", async (req, res) => {
  try {
    const { pet_id } = req.params;
    const [rows] = await db.query(
      "SELECT pet_id, pet_name, species,bloodtype, birth_date, weight, allergy FROM `Pets` WHERE pet_id = ?",
      [pet_id]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error("Get Pet Info Error:", err);
    res.status(500).json({
      error: true,
      message: "Internal Server Error"
    });
  }
});

app.put("/updatePet/:pet_id", async (req, res) => {
  try {
    const { pet_id } = req.params;
    const { pet_name, species, bloodtype, birth_date, weight, allergy } = req.body;
    await db.query(
      "UPDATE `Pets` SET pet_name = ?, species = ?, bloodtype = ?, birth_date = ?, weight = ?, allergy = ? WHERE pet_id = ?",
      [pet_name, species, bloodtype, birth_date, weight, allergy, pet_id]
    );

    res.json({
      error: false,
      message: "Pet updated successfully"
    });
  } catch (err) {
    console.error("Update Pet Error:", err);
    res.status(500).json({
      error: true,
      message: "Internal Server Error"
    });
  }
});


// ------------------------------------------------- MEDICAL RECORDS -------------------------------------------------

app.post("/insertMedRecord/:pet_id", async (req, res) => {
  try {
    const { pet_id } = req.params;
    const { visit_date, diagnosis, treatment } = req.body;
    const [result] = await db.query(
      "INSERT INTO `MedicalRecords` (pet_id,doc_id,app_id, treatment_date,treatment_time, diagnosis, treatment) VALUES (?, ?, ?, ?)",
      [pet_id, visit_date, diagnosis, treatment]
    );
    res.status(201).json({
      error: false,
      message: "Medical record added successfully!"
    });
  } catch (err) {
    console.error("Insert Medical Record Error:", err);
    res.status(500).json({
      error: true,
      message: "Internal Server Error"
    });
  }
});

// เดี๋ยวค่อยมาแก้ไขนะครับ
app.put("/updateMedRecord/:record_id", async (req, res) => {
  try {
    const { record_id } = req.params; 
    const { visit_date, diagnosis, treatment } = req.body;
    await db.query(
      "UPDATE `MedicalRecords` SET visit_date = ?, diagnosis = ?, treatment = ? WHERE record_id = ?",
      [visit_date, diagnosis, treatment, record_id]
    );

    res.json({
      error: false,
      message: "Medical record updated successfully"
    });
  } catch (err) {
    console.error("Update Medical Record Error:", err);
    res.status(500).json({
      error: true,
      message: "Internal Server Error"
    });
  }
});

app.get("/getMedicalRecord/:pet_id", async (req, res) => {
  try {
    const { pet_id } = req.params;
    const [rows] = await db.query(
      "SELECT record_id,diagnosis FROM `MedicalRecords` WHERE pet_id = ?",
      [pet_id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Get Medical Records Error:", err);
    res.status(500).json({
      error: true,
      message: "Internal Server Error"
    });
  }
});

app.get("/getMedicalRecordInfo/:record_id", async (req, res) => {
  try {
    const { record_id } = req.params;
    const [rows] = await db.query(
      "SELECT record_id, visit_date, diagnosis, treatment FROM `MedicalRecords` WHERE record_id = ?",
      [record_id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error("Get Medical Record Info Error:", err);
    res.status(500).json({
      error: true,
      message: "Internal Server Error"
    });
  }
});

// ------------------------------------------------- Appointments -------------------------------------------------

app.post("/insertAppointment/:pet_id/:user_id/:doc_id", async (req, res) => {
  try {
    const { pet_id, user_id, doc_id } = req.params;
    const { app_date,app_time, reason } = req.body;
    const [result] = await db.query(
      "INSERT INTO `Appointments` (pet_id, user_id, doc_id, app_date, app_time, reason) VALUES (?, ?, ?, ?, ?, ?)",
      [pet_id, user_id, doc_id, app_date, app_time, reason]
    );

    res.status(201).json({
      error: false,
      message: "Appointment added successfully!"
    });
  } catch (err) {
    console.error("Insert Appointment Error:", err);
    res.status(500).json({
      error: true,
      message: "Internal Server Error"
    });
  }
});

app.get("/getUserAppointmentslist/:user_id", async (req, res) => {
  // กราบ Chat งามๆ
  try {
    const { user_id } = req.params;

    const [rows] = await db.query(
      `SELECT 
        a.app_id,
        a.pet_id,
        p.pet_name,
        a.doc_id,
        d.doc_name,
        a.app_date,
        a.app_time
      FROM Appointments a
      JOIN Pets p ON a.pet_id = p.pet_id
      JOIN Doctors d ON a.doc_id = d.doc_id
      WHERE a.user_id = ?`,
      [user_id]
    );

    res.json(rows);

  } catch (err) {
    console.error("Get Appointments Error:", err);
    res.status(500).json({
      error: true,
      message: "Internal Server Error"
    });
  }
});

app.put("/deleteAppointment/:app_id", async (req, res) => {
  try {
    const { app_id } = req.params;
    await db.query(
      "DELETE FROM `Appointments` WHERE app_id = ?",
      [app_id]
    );
    res.json({
      error: false,
      message: "Appointment deleted successfully"
    });
  } catch (err) {
    console.error("Delete Appointment Error:", err);
    res.status(500).json({
      error: true,
      message: "Internal Server Error"
    });
  }
});

app.get("/getDoctorAppointmentslist/:doc_id", async (req, res) => {
  try {
    const { doc_id } = req.params;
    const [rows] = await db.query(
      `SELECT 
        a.pet_id,
        p.pet_name,
        a.user_id,
        u.username,
        a.app_date,
        a.app_time,
        a.reason
      FROM Appointments a
      JOIN Pets p ON a.pet_id = p.pet_id
      JOIN User u ON a.user_id = u.user_id
      WHERE a.doc_id = ?`,
      [doc_id]
    );

    res.json(rows);

  } catch (err) {
    console.error("Get Appointments Error:", err);
    res.status(500).json({
      error: true,
      message: "Internal Server Error"
    });
  }
});


// ------------------------------------------------- Doctor -------------------------------------------------

app.get("/getDoctors", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT doc_id, doc_name, specialization,is_available FROM `Doctor`"
    );
    res.json(rows);
  } catch (err) {
    console.error("Get Doctors Error:", err);
    res.status(500).json({
      error: true,
      message: "Internal Server Error"
    });
  }
});


app.use((err, req, res, next) => {
    console.error(err);

    const status = err.status || 500;

    const messages = {
        400: { Message: "ส่งข้อมูลมาไม่ถูก pattern", code: 400 },
        404: { Message: "ไม่รู้จัก Route ที่เรียกใช้ครับ", code: 404 },
        405: { Message: "Method ไม่ถูกต้องครับ", Status: 405 },
        500: { Message: "Internal Server Error", Status: 500 },
        502: { Message: "Bad Gateway", Status: 502 },
        503: { Message: "Service Unavailable", Status: 503 },
        504: { Message: "Gateway Timeout", Status: 504 }
    };

    res.status(status).json(messages[status] || messages[500]);
});



const PORT = process.env.PORT || 8000
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`))