import express from 'express';
const router = express.Router();

// Mock Data
const updates = [
  {
    id: 1,
    title: "Attendance Warning: Data Structures",
    message: "Your attendance has dropped below 75%. Immediate action required.",
    time: "2 hours ago",
    urgent: true
  },
  {
    id: 2,
    title: "Mid-Term Exam Schedule Released",
    message: "The schedule for upcoming mid-term exams is now available.",
    time: "1 day ago",
    urgent: false
  }
];

router.get('/updates', (req, res) => {
  res.json(updates);
});

export default router;
