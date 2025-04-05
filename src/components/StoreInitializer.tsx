"use client";

import { useEffect } from "react";
import { useScheduleStore } from "../store/scheduleStore";

export default function StoreInitializer() {
  const loadTasks = useScheduleStore((state) => state.loadTasks);

  useEffect(() => {
    loadTasks().catch(console.error);
  }, [loadTasks]);

  return null;
}
