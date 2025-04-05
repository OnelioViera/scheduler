import { useState, useEffect } from "react";
import { Task, useScheduleStore } from "../store/scheduleStore";
import { format } from "date-fns";
import {
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

// Priority order for sorting
const priorityOrder = {
  high: 0,
  medium: 1,
  low: 2,
};

export default function TaskList() {
  const { tasks, updateTask, deleteTask, loadTasks, isLoading, error } =
    useScheduleStore();
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

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
    setEditingTask(task.id);
    setEditTitle(task.title);
  };

  const handleSaveEdit = (taskId: string) => {
    if (editTitle.trim()) {
      updateTask(taskId, { title: editTitle });
      setEditingTask(null);
      setEditTitle("");
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditTitle("");
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
      <h2 className="text-2xl font-bold text-[#1e40af]">Tasks</h2>
      <div className="space-y-2">
        {sortedTasks.map((task: Task) => (
          <div
            key={task.id}
            className={`flex items-center justify-between p-4 rounded-lg border ${
              task.completed ? "bg-gray-50" : "bg-white"
            }`}
          >
            <div className="flex items-center space-x-4">
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
              <div>
                {editingTask === task.id ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="px-2 py-1 border rounded-md"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(task.id)}
                      className="px-2 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-2 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <h3
                    className={`text-lg font-medium ${
                      task.completed
                        ? "line-through text-gray-500"
                        : "text-gray-900"
                    }`}
                  >
                    {task.title}
                  </h3>
                )}
                <p className="text-sm text-gray-700">{task.description}</p>
                {task.dueDate && (
                  <p className="text-sm text-gray-700">
                    Due: {format(new Date(task.dueDate), "PPP")}
                  </p>
                )}
                <div className="flex space-x-2 mt-1">
                  <span
                    className={`text-sm font-medium ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
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
              {!editingTask && (
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
    </div>
  );
}
