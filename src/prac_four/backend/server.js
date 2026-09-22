const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/jobapps')
    .then(() => console.log('Connected to MongoDB (jobapps)'))
    .catch(err => console.error('MongoDB connection error:', err));

// Database schema matching multi-step form structure
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

// POST /api/applications - Save a completed application
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

// GET /api/applications - Fetch all applications
app.get('/api/applications', async (req, res) => {
    try {
        const applications = await JobApplication.find().sort({ submittedAt: -1 });
        res.json(applications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Job applications server running on port ${PORT}`);
});
