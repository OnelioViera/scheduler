"use client";

import { useState } from "react";
import Calendar from "../components/Calendar";
import TaskList from "../components/TaskList";
import AddTaskForm from "../components/AddTaskForm";

export default function Home() {
  const [view, setView] = useState<"calendar" | "tasks">("calendar");

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-[1600px] mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Scheduler & Planner
            </h1>
            <p className="text-gray-600 text-lg">
              Organize your time efficiently
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setView("calendar")}
              className={`px-6 py-3 rounded-xl text-lg font-medium transition-all duration-200 ${
                view === "calendar"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
              }`}
            >
              Calendar View
            </button>
            <button
              onClick={() => setView("tasks")}
              className={`px-6 py-3 rounded-xl text-lg font-medium transition-all duration-200 ${
                view === "tasks"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
              }`}
            >
              Task List
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-8 min-h-[700px]">
              {view === "calendar" ? (
                <div className="h-full">
                  <Calendar />
                </div>
              ) : (
                <TaskList />
              )}
            </div>
          </div>
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Add New Task
                </h2>
                <AddTaskForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
