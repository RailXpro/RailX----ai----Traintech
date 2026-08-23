require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Home / Server Test Route
app.get("/", (req, res) => {
    res.json({
        message: "Indian Railways AI Block Planning Backend is running!"
    });
});

// Database Test Route
app.get("/db-test", (req, res) => {
    db.query("SELECT 1 AS test", (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database connection failed",
                error: err.message
            });
        }

        res.json({
            success: true,
            message: "MySQL database connected successfully!",
            result: result
        });
    });
});

// Get All Trains Route
app.get("/trains", (req, res) => {
    const sql = "SELECT * FROM trains";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch trains",
                error: err.message
            });
        }

        res.json({
            success: true,
            count: results.length,
            trains: results
        });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});