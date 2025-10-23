import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText } from "lucide-react";
import { toast } from "sonner";
import reminderApi from '../services/reminderApi';

interface Reminder {
  _id?: string;
  email: string;
  task: string;
  reminderDate: string; // UTC from backend
  status: "Pending" | "Sent" | "Cancelled";
}

interface RemindersListProps {
  refreshTrigger: number;
}

export const RemindersList = ({ refreshTrigger }: RemindersListProps) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReminders = async () => {
    setIsLoading(true);
    try {
      const data = await reminderApi.getAll();
      setReminders(data);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      toast.error("Failed to fetch reminders. Showing demo data.");
      // Mock demo data if backend fails
      setReminders([
        {
          _id: "1",
          email: "demo@example.com",
          task: "Submit project report",
          reminderDate: new Date().toISOString(),
          status: "Pending",
        },
        {
          _id: "2",
          email: "demo@example.com",
          task: "Team meeting preparation",
          reminderDate: new Date().toISOString(),
          status: "Sent",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await reminderApi.delete(id);
      toast.success("Reminder deleted successfully");
      fetchReminders();
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast.error("Failed to delete reminder");
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [refreshTrigger]);

  const getStatusBadgeVariant = (status: string) => {
    return status === "Pending" ? "default" : "secondary";
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Upcoming Reminders</h2>
        <Card className="p-8 text-center text-muted-foreground">
          Loading reminders...
        </Card>
      </div>
    );
  }

  if (reminders.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Upcoming Reminders</h2>
        <Card className="p-8 text-center text-muted-foreground shadow-[var(--shadow-md)] border-border/50">
          No reminders yet. Create your first one above!
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-foreground">Upcoming Reminders</h2>

      {/* Mobile: Card layout */}
      <div className="grid gap-4 sm:hidden">
        {reminders.map((reminder) => {
          const istDate = new Date(reminder.reminderDate).toLocaleDateString("en-GB", {
            timeZone: "Asia/Kolkata",
          });

          const istTime = new Date(reminder.reminderDate).toLocaleTimeString("en-GB", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });

          return (
            <Card
              key={reminder._id}
              className="p-4 space-y-3 shadow-[var(--shadow-sm)] border-border/50 hover:shadow-[var(--shadow-md)] transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <FileText className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-medium text-foreground break-words">
                    {reminder.task}
                  </p>
                </div>
                <Badge
                  variant={getStatusBadgeVariant(reminder.status)}
                  className={
                    reminder.status === "Pending"
                      ? "bg-pending text-pending-foreground"
                      : "bg-success text-success-foreground"
                  }
                >
                  {reminder.status}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{istDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{istTime}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Desktop: Table layout */}
      <div className="hidden sm:block">
        <Card className="overflow-hidden shadow-[var(--shadow-md)] border-border/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-foreground">Task</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-foreground">Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {reminders.map((reminder) => {
                  const istDate = new Date(reminder.reminderDate).toLocaleDateString("en-GB", {
                    timeZone: "Asia/Kolkata",
                  });

                  const istTime = new Date(reminder.reminderDate).toLocaleTimeString("en-GB", {
                    timeZone: "Asia/Kolkata",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  });

                  return (
                    <tr key={reminder._id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 text-sm text-foreground font-medium">{reminder.task}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{istDate}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{istTime}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={getStatusBadgeVariant(reminder.status)}
                          className={
                            reminder.status === "Pending"
                              ? "bg-pending text-pending-foreground"
                              : "bg-success text-success-foreground"
                          }
                        >
                          {reminder.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
