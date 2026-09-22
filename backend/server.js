const express = require('express');
const mongoose = require('mongoose');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Set up common uploads folder for file previews
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// ==========================================
// DATABASE CONNECTIONS
// ==========================================

// 1. Connect to MongoDB (for Job Applications - Practical 4)
mongoose.connect('mongodb://127.0.0.1:27017/jobapps')
    .then(() => console.log('Connected to MongoDB (jobapps)'))
    .catch(err => console.error('MongoDB connection error:', err));

// 2. Connect to SQLite3 (for Document Manager - Practical 3)
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('SQLite connection error:', err.message);
    } else {
        console.log('Connected to SQLite database (database.sqlite)');
        db.run(`CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT,
            filepath TEXT,
            filetype TEXT,
            size INTEGER,
            upload_date TEXT
        )`);
    }
});

// ==========================================
// SCHEMAS & MODELS (Practical 4)
// ==========================================
const JobApplicationSchema = new mongoose.Schema({
    personal: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        dob: { type: String, required: true }
    },
    education: {
        degree: { type: String, required: true },
        institution: { type: String, required: true },
        passingYear: { type: Number, required: true }
    },
    experience: [{
        company: { type: String },
        role: { type: String },
        startDate: { type: String },
        endDate: { type: String }
    }],
    submittedAt: { type: Date, default: Date.now }
});

const JobApplication = mongoose.model('JobApplication', JobApplicationSchema);

// Configure Multer Storage (Practical 3)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// ==========================================
// ROUTES - PRACTICAL 3 (DOCUMENT MANAGER)
// ==========================================

// Upload document and store metadata in SQLite
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { originalname, mimetype: filetype, size, filename } = req.file;
    const filepath = `/uploads/${filename}`;
    const upload_date = new Date().toISOString();

    const sql = `INSERT INTO documents (filename, filepath, filetype, size, upload_date) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [originalname, filepath, filetype, size, upload_date], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, filename: originalname, filepath, filetype, size, upload_date });
    });
});

// Get all uploaded documents from SQLite
app.get('/api/documents', (req, res) => {
    db.all(`SELECT * FROM documents ORDER BY id DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Delete document from SQLite database and server disk
app.delete('/api/documents/:id', (req, res) => {
    const id = req.params.id;
    db.get(`SELECT filepath FROM documents WHERE id = ?`, [id], (err, row) => {
        if (err || !row) return res.status(404).json({ error: 'Document not found' });

        const localPath = path.join(__dirname, row.filepath);
        fs.unlink(localPath, (unlinkErr) => {
            if (unlinkErr) console.error('Error removing file from disk:', unlinkErr);
            
            db.run(`DELETE FROM documents WHERE id = ?`, [id], (dbErr) => {
                if (dbErr) return res.status(500).json({ error: dbErr.message });
                res.json({ success: true });
            });
        });
    });
});

// ==========================================
// ROUTES - PRACTICAL 4 (JOB APPLICATIONS)
// ==========================================

// Save job application details to MongoDB
app.post('/api/applications', async (req, res) => {
    try {
        const application = new JobApplication(req.body);
        await application.save();
        res.status(201).json({ success: true, data: application });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

// List all job applications from MongoDB
app.get('/api/applications', async (req, res) => {
    try {
        const applications = await JobApplication.find().sort({ submittedAt: -1 });
        res.json(applications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
    console.log(`Common Backend Server is listening on port ${PORT}`);
});
