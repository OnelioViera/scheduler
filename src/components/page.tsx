"use client";

import TaskList from "@/components/TaskList";
import { useScheduleStore } from "@/store/scheduleStore";
import { format } from "date-fns";

export default function Home() {
  const events = useScheduleStore((state) => state.events);

  return (
    <main className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-100">
            My Schedule
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            View and manage your tasks and events
          </p>
        </div>

        <div className="grid gap-6">
          {/* Tasks Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Tasks
              </h2>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              <TaskList />
            </div>
          </div>

          {/* Events Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Upcoming Events
              </h2>
            </div>
            <div className="space-y-4">
              {events.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  No upcoming events
                </p>
              ) : (
                events
                  .sort((a, b) => a.start.getTime() - b.start.getTime())
                  .map((event) => (
                    <div
                      key={event.id}
                      className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {event.title}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        {format(event.start, "PPP")} at{" "}
                        {format(event.start, "p")}
                      </p>
                      {event.description && (
                        <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                          {event.description}
                        </p>
                      )}
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
