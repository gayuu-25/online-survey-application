
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, ".env")
});

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully!");
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error);
    });

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
    name: String,
    email: String,
    department: String,
    answers: [
        {
            question: String,
            answer: String
        }
    ]
}, { timestamps: true });

const Feedback = mongoose.model("Feedback", feedbackSchema);

// Test Route
app.get("/", (req, res) => {
    res.send("Online Survey Backend is Running Successfully!");
});

// Submit Feedback
app.post("/api/feedback", async (req, res) => {
    try {
        const { name, email, department, answers } = req.body;

        if (!name || !email || !department || !answers || answers.length !== 5) {
            return res.status(400).json({
                message: "Please fill all fields and answer 5 questions."
            });
        }

        const feedback = new Feedback({
            name,
            email,
            department,
            answers
        });

        await feedback.save();

        res.status(201).json({
            message: "Feedback submitted successfully!"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error submitting feedback"
        });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
