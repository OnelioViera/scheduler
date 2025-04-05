"use client";

import { useState } from "react";
import { useScheduleStore } from "../store/scheduleStore";
import toast from "react-hot-toast";

interface AddTaskFormProps {
  onClose?: () => void;
}

export default function AddTaskForm({ onClose }: AddTaskFormProps) {
  const addTask = useScheduleStore((state) => state.addTask);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [tags, setTags] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a task title", {
        style: {
          border: "1px solid #fecaca",
          padding: "16px",
          color: "#dc2626",
          backgroundColor: "#fef2f2",
        },
      });
      return;
    }

    try {
      await addTask({
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        completed: false,
        priority,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      });

      toast.success("Task added successfully!", {
        style: {
          border: "1px solid #bbf7d0",
          padding: "16px",
          color: "#16a34a",
          backgroundColor: "#f0fdf4",
        },
      });

      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("medium");
      setTags("");

      if (onClose) {
        onClose();
      }
    } catch (error) {
      toast.error("Failed to add task. Please try again.", {
        style: {
          border: "1px solid #fecaca",
          padding: "16px",
          color: "#dc2626",
          backgroundColor: "#fef2f2",
        },
      });
    }
  };

  const inputClasses =
    "w-full rounded-xl border border-gray-100 py-3 px-4 text-base shadow-sm focus:outline-none focus:border-gray-200 hover:border-gray-200 text-gray-900 placeholder:text-gray-400 transition-colors";

  const selectClasses = `${inputClasses} [&:not(:focus)]:text-gray-400`;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Add New Task
        </h2>
      </div>

      <div>
        <label
          htmlFor="title"
          className="block text-base font-semibold text-gray-900 mb-2"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter task title"
          className={inputClasses}
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-base font-semibold text-gray-900 mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Enter task description"
          className={inputClasses}
        />
      </div>

      <div>
        <label
          htmlFor="dueDate"
          className="block text-base font-semibold text-gray-900 mb-2"
        >
          Due Date
        </label>
        <input
          type="datetime-local"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className={`${inputClasses} ${!dueDate && "text-gray-400"}`}
        />
      </div>

      <div>
        <label
          htmlFor="priority"
          className="block text-base font-semibold text-gray-900 mb-2"
        >
          Priority
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value as "low" | "medium" | "high")
          }
          className={selectClasses}
        >
          <option value="low" className="text-gray-900">
            Low Priority
          </option>
          <option value="medium" className="text-gray-900">
            Medium Priority
          </option>
          <option value="high" className="text-gray-900">
            High Priority
          </option>
        </select>
      </div>

      <div>
        <label
          htmlFor="tags"
          className="block text-base font-semibold text-gray-900 mb-2"
        >
          Tags
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Enter comma-separated tags"
          className={inputClasses}
        />
      </div>

      <div className="flex justify-end gap-4">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Task
        </button>
      </div>
    </form>
  );
}
