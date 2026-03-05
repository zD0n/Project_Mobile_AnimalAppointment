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
      "SELECT user_id, username, password, role FROM `User` WHERE username = ?",
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

app.get("/doctors", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM `Doctor`");
    res.json(rows);
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 8000
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`))