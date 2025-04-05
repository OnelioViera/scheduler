import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date | null;
  completed: boolean;
  priority: "low" | "medium" | "high";
  tags: string[];
}

export interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description: string;
  allDay: boolean;
}

interface StoredTask extends Omit<Task, "dueDate"> {
  dueDate: string | null;
}

interface ApiResponse {
  tasks: StoredTask[];
  error?: string;
}

interface ScheduleState {
  tasks: Task[];
  events: Event[];
  isLoading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, "id">) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addEvent: (event: Omit<Event, "id">) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  loadTasks: () => Promise<void>;
}

// Helper function to save tasks to Blob storage
async function saveTasks(tasks: Task[]) {
  try {
    const response = await fetch("/api/blob", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tasks }),
    });

    if (!response.ok) {
      throw new Error("Failed to save tasks");
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to save tasks";
    console.error("Error saving tasks:", errorMessage);
    throw error;
  }
}

export const useScheduleStore = create<ScheduleState>()((set, get) => ({
  tasks: [],
  events: [],
  isLoading: false,
  error: null,

  loadTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/blob");
      if (!response.ok) {
        throw new Error("Failed to load tasks");
      }
      const data: ApiResponse = await response.json();
      set({
        tasks: data.tasks.map((task: StoredTask) => ({
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
        })),
        isLoading: false,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load tasks";
      console.error("Error loading tasks:", errorMessage);
      set({ error: errorMessage, isLoading: false });
    }
  },

  addTask: async (task: Omit<Task, "id">) => {
    const newTask = {
      ...task,
      id: uuidv4(),
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
    };

    set((state) => ({ tasks: [...state.tasks, newTask] }));

    try {
      await saveTasks([...get().tasks]);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save task";
      // Rollback on error
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== newTask.id),
        error: errorMessage,
      }));
    }
  },

  updateTask: async (id: string, updatedTask: Partial<Task>) => {
    const previousTasks = get().tasks;

    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updatedTask,
              dueDate: updatedTask.dueDate
                ? new Date(updatedTask.dueDate)
                : task.dueDate,
            }
          : task
      ),
    }));

    try {
      await saveTasks(get().tasks);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update task";
      // Rollback on error
      set({
        tasks: previousTasks,
        error: errorMessage,
      });
    }
  },

  deleteTask: async (id: string) => {
    const previousTasks = get().tasks;

    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));

    try {
      await saveTasks(get().tasks);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete task";
      // Rollback on error
      set({
        tasks: previousTasks,
        error: errorMessage,
      });
    }
  },

  // Event methods remain unchanged for now
  addEvent: (event: Omit<Event, "id">) =>
    set((state) => ({
      events: [
        ...state.events,
        {
          ...event,
          id: uuidv4(),
          start: new Date(event.start),
          end: new Date(event.end),
        },
      ],
    })),

  updateEvent: (id: string, updatedEvent: Partial<Event>) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.id === id
          ? {
              ...event,
              ...updatedEvent,
              start: updatedEvent.start
                ? new Date(updatedEvent.start)
                : event.start,
              end: updatedEvent.end ? new Date(updatedEvent.end) : event.end,
            }
          : event
      ),
    })),

  deleteEvent: (id: string) =>
    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
    })),
}));
