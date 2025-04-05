"use client";

import { useEffect } from "react";
import { useScheduleStore } from "../store/scheduleStore";
import toast from "react-hot-toast";

export default function StoreInitializer() {
  const loadTasks = useScheduleStore((state) => state.loadTasks);

  useEffect(() => {
    const initializeStore = async () => {
      try {
        await loadTasks();
      } catch (error) {
        console.error("Failed to initialize store:", error);
        toast.error(
          "Error loading data. Please check your connection and try again.",
          {
            duration: 5000,
            style: {
              border: "1px solid #fecaca",
              padding: "16px",
              color: "#dc2626",
              backgroundColor: "#fef2f2",
            },
          }
        );
      }
    };

    initializeStore();
  }, [loadTasks]);

  return null;
}
