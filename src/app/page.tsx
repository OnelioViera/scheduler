"use client";

import { JSX } from "react";
import TaskList from "../components/TaskList";
import Calendar from "../components/Calendar";
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

export default function HomePage(): JSX.Element {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <HomeIcon className="h-8 w-8 text-blue-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="grid gap-8">
        <section>
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Your Tasks</h2>
            </div>
            <p className="text-gray-600 mt-1">
              View your tasks overview. Go to the Tasks page to make changes.
            </p>
          </div>
          <TaskList readOnly />
        </section>

        <section>
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <CalendarDaysIcon className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Calendar</h2>
            </div>
            <p className="text-gray-600 mt-1">
              View your upcoming events. Go to the Calendar page to make
              changes.
            </p>
          </div>
          <Calendar readOnly />
        </section>
      </div>
    </main>
  );
}
