import sqlite3 from "sqlite3";
import express from "express";

const app = express();
const PORT: number = 3000;

app.use(express.json());

// Serve the static frontend UI
app.use(express.static('public'));

// Establish connection to the local SQLite database
const db = new sqlite3.Database('./dashboard.db', (err) => {
    if (err) {
        console.error("Error opening database: ", err.message);
    } else {
        console.log("Successfully connected to the SQLite database.");
    }
});

// Fetch full to-do list
app.get('/tasks', (req, res) => {
    db.all("SELECT * FROM tasks", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Fetch unlearned flashcards for the active study queue
app.get('/flashcards/queue', (req, res) => {
    db.all("SELECT * FROM flashcards WHERE is_learned = 0", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Process grading events and update card mastery
app.post('/flashcards/grade', (req, res) => {
    const cardId = req.body.id;
    const isCorrect = req.body.correct;

    // Only update mastery status in the database if answered correctly
    if (isCorrect === true) {
        const sql = "UPDATE flashcards SET is_learned = 1 WHERE id = ?";
        
        db.run(sql, [cardId], (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ success: true, message: `Card ${cardId} marked as learned.` });
            }
        });
    } else {
        res.json({ success: true, message: `Card ${cardId} remains in the funnel.` });
    }
});

// Append a new flashcard to the database
app.post('/flashcards', (req, res) => {
    const frontText = req.body.front;
    const backText = req.body.back;

    const sql = "INSERT INTO flashcards (front, back, is_learned) VALUES (?, ?, 0)";
    
    db.run(sql, [frontText, backText], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ success: true, id: this.lastID, message: "Card added!" });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running and listening on http://localhost:${PORT}`);
});