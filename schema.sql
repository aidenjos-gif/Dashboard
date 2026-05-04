-- The To-Do List
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT 0
);

-- The Calendar
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_name TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    day_of_week TEXT
);

-- The Japanese Flashcard Funnel
CREATE TABLE flashcards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    is_learned BOOLEAN DEFAULT 0
);
