import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Calendar, Clock, Mail, FileText } from "lucide-react";
import reminderApi, { ReminderData } from '../services/reminderApi';

interface ReminderFormProps {
  onReminderCreated: () => void;
}

export const ReminderForm = ({ onReminderCreated }: ReminderFormProps) => {
  const [email, setEmail] = useState("");
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !task || !date || !time) {
      toast.error("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Use reminderApi to create the reminder
      const reminderData: ReminderData = { email, task, date, time };
      await reminderApi.create(reminderData);

      toast.success("Reminder Set Successfully!", {
        description: `We'll remind you about "${task}" on ${date} at ${time}`,
      });

      // Clear form
      setEmail("");
      setTask("");
      setDate("");
      setTime("");

      // Notify parent to refresh reminders list
      onReminderCreated();
    } catch (error) {
      console.error("Error creating reminder:", error);
      toast.error("Failed to create reminder", {
        description: "Please make sure the backend server is running",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 shadow-[var(--shadow-md)] border-border/50 bg-card">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 bg-background border-border/60 focus:border-primary transition-colors"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="task" className="text-sm font-medium flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Task Description
          </Label>
          <Textarea
            id="task"
            placeholder="What would you like to be reminded about?"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="min-h-[100px] resize-none bg-background border-border/60 focus:border-primary transition-colors"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-11 bg-background border-border/60 focus:border-primary transition-colors"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time" className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Time
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-11 bg-background border-border/60 focus:border-primary transition-colors"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-[var(--shadow-sm)] font-medium"
        >
          {isSubmitting ? "Setting Reminder..." : "Set Reminder"}
        </Button>
      </form>
    </Card>
  );
};
