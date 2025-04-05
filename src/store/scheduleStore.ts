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

interface StoredEvent extends Omit<Event, "start" | "end"> {
  start: string;
  end: string;
}

interface ApiResponse {
  tasks: StoredTask[];
  events: StoredEvent[];
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
  addEvent: (event: Omit<Event, "id">) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  loadTasks: () => Promise<void>;
}

// Helper function to save data to Blob storage
async function saveData(tasks: Task[], events: Event[]) {
  try {
    const response = await fetch("/api/blob", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tasks,
        events: events.map((event) => ({
          ...event,
          start: event.start.toISOString(),
          end: event.end.toISOString(),
        })),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save data");
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to save data";
    console.error("Error saving data:", errorMessage);
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
        throw new Error("Failed to load data");
      }
      const data: ApiResponse = await response.json();

      set({
        tasks: data.tasks.map((task: StoredTask) => ({
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
        })),
        events: (data.events || []).map((event: StoredEvent) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        })),
        isLoading: false,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load data";
      console.error("Error loading data:", errorMessage);
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
      await saveData([...get().tasks], get().events);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save task";
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
      await saveData(get().tasks, get().events);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update task";
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
      await saveData(get().tasks, get().events);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete task";
      set({
        tasks: previousTasks,
        error: errorMessage,
      });
    }
  },

  addEvent: async (event: Omit<Event, "id">) => {
    const newEvent = {
      ...event,
      id: uuidv4(),
      start: new Date(event.start),
      end: new Date(event.end),
    };

    set((state) => ({
      events: [...state.events, newEvent],
    }));

    try {
      await saveData(get().tasks, [...get().events]);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save event";
      set((state) => ({
        events: state.events.filter((e) => e.id !== newEvent.id),
        error: errorMessage,
      }));
    }
  },

  updateEvent: async (id: string, updatedEvent: Partial<Event>) => {
    const previousEvents = get().events;

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
    }));

    try {
      await saveData(get().tasks, get().events);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update event";
      set({
        events: previousEvents,
        error: errorMessage,
      });
    }
  },

  deleteEvent: async (id: string) => {
    const previousEvents = get().events;

    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
    }));

    try {
      await saveData(get().tasks, get().events);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete event";
      set({
        events: previousEvents,
        error: errorMessage,
      });
    }
  },
}));
