"use client";

import { useState } from "react";
import TaskList from "../../components/TaskList";
import { useScheduleStore, Task } from "../../store/scheduleStore";
import {
  PlusIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  TagIcon,
  ExclamationCircleIcon,
  DocumentTextIcon,
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
  const [newTask, setNewTask] = useState<NewTask>({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    tags: [],
  });
  const { addTask } = useScheduleStore();

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
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Task
          </button>
        </div>
        <p className="text-gray-600">Manage and organize your tasks</p>
      </div>

      {isAddingTask && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 flex items-center"
              >
                <TagIcon className="h-4 w-4 mr-1" />
                Title
              </label>
              <input
                type="text"
                id="title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter task title"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 flex items-center"
              >
                <DocumentTextIcon className="h-4 w-4 mr-1" />
                Description
              </label>
              <textarea
                id="description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                placeholder="Enter task description"
              />
            </div>

            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 flex items-center"
              >
                <ExclamationCircleIcon className="h-4 w-4 mr-1" />
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium text-gray-700 flex items-center"
              >
                <CalendarDaysIcon className="h-4 w-4 mr-1" />
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsAddingTask(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}

      <TaskList />
    </main>
  );
}
