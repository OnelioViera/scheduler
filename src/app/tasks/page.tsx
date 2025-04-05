"use client";

import { useState, useRef, useEffect } from "react";
import TaskList from "../../components/TaskList";
import { useScheduleStore, Task } from "../../store/scheduleStore";
import {
  PlusIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  TagIcon,
  ExclamationCircleIcon,
  DocumentTextIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

type NewTask = {
  title: string;
  description: string;
  priority: Task["priority"];
  dueDate: string;
  tags: string[];
};

export default function TasksPage() {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [newTask, setNewTask] = useState<NewTask>({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    tags: [],
  });
  const { addTask } = useScheduleStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsAddingTask(false);
      }
    };

    if (isAddingTask) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAddingTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    try {
      await addTask({
        ...newTask,
        completed: false,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null,
      });
      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
        tags: [],
      });
      setIsAddingTask(false);
      toast.success("Task added successfully!");
    } catch (error) {
      toast.error("Failed to add task");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <ClipboardDocumentListIcon className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          </div>
          <button
            onClick={() => setIsAddingTask(!isAddingTask)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Task
          </button>
        </div>
        <p className="text-gray-600">Manage and organize your tasks</p>
      </div>

      {isAddingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <PlusIcon className="w-5 h-5 mr-2 text-blue-600" />
                Add New Task
              </h2>
              <button
                onClick={() => setIsAddingTask(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 flex items-center mb-2"
                >
                  <TagIcon className="h-4 w-4 mr-2 text-blue-500" />
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none text-gray-900 placeholder-gray-500"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 flex items-center mb-2"
                >
                  <DocumentTextIcon className="h-4 w-4 mr-2 text-blue-500" />
                  Description
                </label>
                <textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none text-gray-900 placeholder-gray-500"
                  rows={3}
                  placeholder="Enter task description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="priority"
                    className="block text-sm font-medium text-gray-700 flex items-center mb-2"
                  >
                    <ExclamationCircleIcon className="h-4 w-4 mr-2 text-blue-500" />
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        priority: e.target.value as Task["priority"],
                      })
                    }
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 ${getPriorityColor(newTask.priority)}`}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="dueDate"
                    className="block text-sm font-medium text-gray-700 flex items-center mb-2"
                  >
                    <CalendarDaysIcon className="h-4 w-4 mr-2 text-blue-500" />
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none text-gray-900"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddingTask(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <TaskList />
    </main>
  );
}
