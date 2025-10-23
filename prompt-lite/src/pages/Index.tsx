/**
 * Main Application Page - Automated Email Reminder System
 * 
 * Purpose: 
 * This is the main interface for the email reminder application.
 * Users can create reminders and view all upcoming reminders in one place.
 * 
 * Components:
 * - ReminderForm: Form to create new reminders
 * - RemindersList: Display of all reminders with their status
 * 
 * Backend Integration:
 * This frontend connects to a Node.js/Express backend API:
 * - POST /api/reminders - Creates a new reminder
 * - GET /api/reminders - Retrieves all reminders
 * 
 * Expected Backend Setup (Node.js + Express + MongoDB + Nodemailer):
 * 
 * 1. Install dependencies:
 *    npm install express mongoose nodemailer cors node-cron dotenv
 * 
 * 2. Create MongoDB schema for reminders:
 *    - email: String
 *    - task: String
 *    - date: String
 *    - time: String
 *    - status: String (Pending/Sent)
 *    - createdAt: Date
 * 
 * 3. API Endpoints needed:
 *    POST /api/reminders
 *      - Accepts: { email, task, date, time }
 *      - Saves to MongoDB with status: "Pending"
 *      - Returns: saved reminder object
 * 
 *    GET /api/reminders
 *      - Returns: array of all reminders sorted by date/time
 * 
 * 4. Background Job (node-cron):
 *    - Check every minute for reminders where date+time matches current time
 *    - Send email via Nodemailer
 *    - Update status to "Sent"
 * 
 * 5. Nodemailer Configuration:
 *    - Configure SMTP settings (Gmail, SendGrid, etc.)
 *    - Send email with task details
 * 
 * 6. CORS Configuration:
 *    - Allow requests from http://localhost:8080 (or your frontend URL)
 * 
 * Environment Variables (.env):
 * - MONGODB_URI=your_mongodb_connection_string
 * - EMAIL_USER=your_email@gmail.com
 * - EMAIL_PASS=your_app_password
 * - PORT=5000
 */

import { useState } from "react";
import { ReminderForm } from "@/components/ReminderForm";
import { RemindersList } from "@/components/RemindersList";
import { Bell } from "lucide-react";

const Index = () => {
  // Counter to trigger refresh of reminders list when a new one is created
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReminderCreated = () => {
    // Increment trigger to refresh the reminders list
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4 shadow-[var(--shadow-md)]">
            <Bell className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Email Reminder System
          </h1>
          <p className="text-muted-foreground text-lg">
            Never miss an important task. Set reminders and get notified via email.
          </p>
        </div>

        {/* Form Section */}
        <div className="mb-12">
          <ReminderForm onReminderCreated={handleReminderCreated} />
        </div>

        {/* Reminders List Section */}
        <RemindersList refreshTrigger={refreshTrigger} />

        {/* Footer with Backend Info */}
        <div className="mt-12 p-6 rounded-xl bg-muted/30 border border-border/50">
          <h3 className="font-semibold text-foreground mb-2">Backend Status</h3>
          <p className="text-sm text-muted-foreground">
            Make sure your backend server is running on{" "}
            <code className="px-2 py-1 rounded bg-background text-primary font-mono text-xs">
              http://localhost:5000
            </code>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            If the backend is not connected, demo data will be displayed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
