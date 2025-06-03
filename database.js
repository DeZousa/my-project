const sqlite3 = require('sqlite3').verbose();

// Create or connect to the database
const db = new sqlite3.Database('./retailshop.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Create customer table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS customer (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            address TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            dateOfBirth TEXT NOT NULL,
            gender TEXT NOT NULL,
            age INTEGER NOT NULL,
            cardHolderName TEXT NOT NULL,
            cardNumber TEXT NOT NULL,
            expiryDate TEXT NOT NULL,
            cov TEXT NOT NULL,
            timeStamp TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error('Error creating table', err.message);
            } else {
                console.log('Customer table created or already exists.');
            }
        });
    }
});

module.exports = db;