"use client";

import { useState, useEffect } from "react";
import { Task, useScheduleStore } from "../store/scheduleStore";
import { format } from "date-fns";
import {
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import TaskModal from "./TaskModal";

interface TaskListProps {
  readOnly?: boolean;
}

// Priority order for sorting
const priorityOrder = {
  high: 0,
  medium: 1,
  low: 2,
};

export default function TaskList({ readOnly = false }: TaskListProps) {
  const { tasks, updateTask, deleteTask, loadTasks, isLoading, error } =
    useScheduleStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Sort tasks by priority (high → medium → low)
  const sortedTasks = [...tasks].sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        <p>Error loading tasks. Please try again later.</p>
      </div>
    );
  }

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    updateTask(taskId, { completed });
  };

  const handleDelete = (taskId: string) => {
    deleteTask(taskId);
  };

  const handleStartEdit = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (taskData: {
    title: string;
    description: string;
    priority: Task["priority"];
    dueDate: string;
    tags: string[];
  }) => {
    if (selectedTask) {
      updateTask(selectedTask.id, {
        ...taskData,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
      });
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {sortedTasks.map((task: Task) => (
          <div
            key={task.id}
            className={`flex items-center justify-between p-4 rounded-lg border ${
              task.completed ? "bg-gray-50" : "bg-white"
            }`}
          >
            <div className="flex items-center space-x-4">
              {!readOnly && (
                <button
                  onClick={() => handleToggleComplete(task.id, !task.completed)}
                  className="focus:outline-none"
                >
                  {task.completed ? (
                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircleIcon className="w-6 h-6 text-gray-300" />
                  )}
                </button>
              )}
              <div className="flex-1">
                <h3
                  className={`text-lg font-semibold ${
                    task.completed
                      ? "line-through text-gray-500"
                      : "text-gray-900"
                  }`}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-gray-700 mt-1">
                    {task.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  {task.dueDate && (
                    <p className="text-sm text-gray-700">
                      Due: {format(new Date(task.dueDate), "PPP")}
                    </p>
                  )}
                  <span
                    className={`text-sm font-medium ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority.charAt(0).toUpperCase() +
                      task.priority.slice(1)}
                  </span>
                  {task.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-sm bg-gray-100 text-gray-700 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              {!readOnly && (
                <>
                  <button
                    onClick={() => handleStartEdit(task)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-1 text-gray-500 hover:text-red-700"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {!readOnly && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTask(null);
          }}
          onSave={handleSaveTask}
          onDelete={
            selectedTask ? () => handleDelete(selectedTask.id) : undefined
          }
          mode={selectedTask ? "edit" : "add"}
          defaultValues={
            selectedTask
              ? {
                  title: selectedTask.title,
                  description: selectedTask.description || "",
                  priority: selectedTask.priority,
                  dueDate: selectedTask.dueDate
                    ? format(
                        new Date(selectedTask.dueDate),
                        "yyyy-MM-dd'T'HH:mm"
                      )
                    : "",
                  tags: selectedTask.tags,
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
