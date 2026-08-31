const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error(err.message);
    } else {
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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { originalname, mimetype: filetype, size, filename } = req.file;
    const filepath = `/uploads/${filename}`;
    const upload_date = new Date().toISOString();

    const sql = `INSERT INTO documents (filename, filepath, filetype, size, upload_date) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [originalname, filepath, filetype, size, upload_date], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, filename: originalname, filepath, filetype, size, upload_date });
    });
});

app.get('/api/documents', (req, res) => {
    db.all(`SELECT * FROM documents ORDER BY id DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.delete('/api/documents/:id', (req, res) => {
    const id = req.params.id;
    db.get(`SELECT filepath FROM documents WHERE id = ?`, [id], (err, row) => {
        if (err || !row) return res.status(404).json({ error: 'Document not found' });

        const localPath = path.join(__dirname, row.filepath);
        fs.unlink(localPath, () => {
            db.run(`DELETE FROM documents WHERE id = ?`, [id], (dbErr) => {
                if (dbErr) return res.status(500).json({ error: dbErr.message });
                res.json({ success: true });
            });
        });
    });
});

app.listen(PORT);