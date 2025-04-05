"use client";

import Calendar from "../../components/Calendar";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

export default function CalendarPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <CalendarDaysIcon className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
        </div>
        <p className="text-gray-600 mt-2">
          View and manage your scheduled events
        </p>
      </div>
      <Calendar />
    </main>
  );
}
