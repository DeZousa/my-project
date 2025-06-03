const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database.js');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate credit card number (exactly 12 digits)
function isValidCardNumber(cardNumber) {
    const cardRegex = /^\d{12}$/;
    return cardRegex.test(cardNumber);
}

// Customer registration endpoint
app.post('/api/customers', (req, res) => {
    const {
        name,
        address,
        email,
        dateOfBirth,
        gender,
        age,
        cardHolderName,
        cardNumber,
        expiryDate,
        cov,
        timeStamp
    } = req.body;

    // Validate required fields
    if (!name || !address || !email || !dateOfBirth || !gender || !age || 
        !cardHolderName || !cardNumber || !expiryDate || !cov || !timeStamp) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate credit card number
    if (!isValidCardNumber(cardNumber)) {
        return res.status(400).json({ error: 'Credit card number must be 12 digits' });
    }

    // Insert customer into database
    const sql = `INSERT INTO customer (
        name, address, email, dateOfBirth, gender, age, 
        cardHolderName, cardNumber, expiryDate, cov, timeStamp
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const params = [
        name, address, email, dateOfBirth, gender, age,
        cardHolderName, cardNumber, expiryDate, cov, timeStamp
    ];

    db.run(sql, params, function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'Email already exists' });
            }
            return res.status(400).json({ error: err.message });
        }
        
        res.status(201).json({
            message: `customer ${name} has registered`,
            customerId: this.lastID
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;