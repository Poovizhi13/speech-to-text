const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// File path for storing transcripts
const transcriptFilePath = path.join(__dirname, 'transcripts.json');

// Ensure transcripts.json file exists
if (!fs.existsSync(transcriptFilePath)) {
  fs.writeFileSync(transcriptFilePath, JSON.stringify([], null, 2));
}

// Health check route
app.get('/ping', (req, res) => {
  res.json({ message: '✅ Backend is working 🚀' });
});

// Save transcript route
app.post('/save-transcript', (req, res) => {
  const { transcript, language } = req.body;

  if (!transcript || typeof transcript !== 'string' || !transcript.trim()) {
    return res.status(400).json({ error: 'Transcript is required and must be a non-empty string.' });
  }

  const entry = {
    timestamp: new Date().toISOString(),
    transcript: transcript.trim(),
    language: language || 'en',
  };

  try {
    const fileData = fs.readFileSync(transcriptFilePath);
    const transcripts = JSON.parse(fileData);
    transcripts.push(entry);
    fs.writeFileSync(transcriptFilePath, JSON.stringify(transcripts, null, 2));
    console.log('📝 Transcript saved:', entry);

    res.json({ success: true, saved: entry });
  } catch (err) {
    console.error('❌ Error saving transcript:', err);
    res.status(500).json({ error: 'Failed to save transcript.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
