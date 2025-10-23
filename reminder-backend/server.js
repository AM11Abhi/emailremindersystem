require('dotenv').config();
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded ✅" : "Not loaded ❌");
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const Reminder = require('./models/Reminder');
const { sendEmail } = require('./utils/emailService');
const reminderRoutes = require('./routes/reminders'); // import routes


const app = express();

// Middleware
app.use(express.json()); // <-- parses JSON bodies
app.use(express.urlencoded({ extended: true })); // optional for form data

// Routes
app.use('/api/reminders', reminderRoutes); // <-- make routes available

app.get('/test-email', async (req, res) => {
  try {
    await sendEmail('your_email@gmail.com', 'Test Reminder', 'This is a test email.');
    res.send('Email sent!');
  } catch (err) {
    res.status(500).send('Email failed: ' + err.message);
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Scheduler (your existing cron job)
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);

    const pendingReminders = await Reminder.find({
      status: 'Pending',
      date: { $lte: currentDate },
      time: { $lte: currentTime }
    });

    for (const reminder of pendingReminders) {
      try {
        await sendEmail(
          reminder.email,
          'Reminder: ' + reminder.task,
          `This is a reminder for your task: ${reminder.task}`
        );

        await Reminder.findByIdAndUpdate(reminder._id, { status: 'Sent' });
        console.log(`Reminder sent successfully to ${reminder.email}`);
      } catch (error) {
        console.error(`Failed to process reminder ${reminder._id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in reminder scheduler:', error);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
