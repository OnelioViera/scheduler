"use client";

import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { useScheduleStore, Event } from "../store/scheduleStore";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import EventModal from "./EventModal";
import toast from "react-hot-toast";

interface CalendarProps {
  readOnly?: boolean;
}

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Custom styling for the calendar
const calendarStyles = {
  className: "custom-calendar",
  dayPropGetter: (date: Date) => ({
    className: "text-gray-900 font-medium",
    style: {
      backgroundColor:
        date.getDay() === 0 || date.getDay() === 6 ? "#f8fafc" : "transparent",
    },
  }),
  eventPropGetter: () => ({
    className: "bg-blue-600 text-white rounded-lg border-none",
  }),
};

export default function Calendar({ readOnly = false }: CalendarProps) {
  const { events, addEvent, updateEvent, deleteEvent } = useScheduleStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    if (!readOnly) {
      setSelectedSlot({ start, end });
      setSelectedEvent(null);
      setIsModalOpen(true);
    }
  };

  const handleSelectEvent = (event: Event) => {
    if (!readOnly) {
      setSelectedEvent(event);
      setSelectedSlot(null);
      setIsModalOpen(true);
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id);
      toast.success("Event deleted successfully!", {
        style: {
          border: "1px solid #fecaca",
          padding: "16px",
          color: "#dc2626",
          backgroundColor: "#fef2f2",
        },
      });
    }
  };

  const handleSaveEvent = (eventData: {
    title: string;
    description: string;
  }) => {
    if (selectedEvent) {
      // Editing existing event
      updateEvent(selectedEvent.id, {
        ...eventData,
      });
      toast.success("Event updated successfully!", {
        style: {
          border: "1px solid #bbf7d0",
          padding: "16px",
          color: "#16a34a",
          backgroundColor: "#f0fdf4",
        },
      });
    } else if (selectedSlot) {
      // Adding new event
      addEvent({
        ...eventData,
        start: selectedSlot.start,
        end: selectedSlot.end,
        allDay: false,
      });
      toast.success("Event added successfully!", {
        style: {
          border: "1px solid #bbf7d0",
          padding: "16px",
          color: "#16a34a",
          backgroundColor: "#f0fdf4",
        },
      });
    }
  };

  return (
    <div className="h-[600px] mt-4">
      <style jsx global>{`
        .custom-calendar .rbc-header {
          padding: 12px 4px;
          font-weight: 600;
          font-size: 1rem;
          color: #1f2937;
        }
        .custom-calendar .rbc-date-cell {
          padding: 4px;
          font-weight: 500;
          color: #374151;
        }
        .custom-calendar .rbc-today {
          background-color: #ebf5ff !important;
          font-weight: 600;
        }
        .custom-calendar .rbc-event {
          background-color: #2563eb;
          border: none;
          border-radius: 6px;
          padding: 4px 8px;
          font-weight: 500;
        }
        .custom-calendar .rbc-event-content {
          font-size: 0.875rem;
        }
        .custom-calendar .rbc-current-time-indicator {
          background-color: #dc2626;
          height: 2px;
        }
        .custom-calendar .rbc-off-range-bg {
          background-color: #f8fafc;
        }
        .custom-calendar .rbc-off-range {
          color: #94a3b8;
        }
        .custom-calendar .rbc-calendar {
          color: #1f2937;
        }
        .custom-calendar .rbc-toolbar {
          margin-bottom: 2rem;
        }
        .custom-calendar .rbc-toolbar-label {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1e40af;
          text-transform: capitalize;
          padding: 0.5rem 0;
        }
        .custom-calendar .rbc-btn-group {
          background-color: #f8fafc;
          padding: 0.25rem;
          border-radius: 0.75rem;
          gap: 0.25rem;
        }
        .custom-calendar .rbc-btn-group button {
          color: #475569;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          border: none;
          background: transparent;
          transition: all 0.2s;
        }
        .custom-calendar .rbc-btn-group button.rbc-active {
          background-color: #2563eb;
          color: white;
        }
        .custom-calendar .rbc-btn-group button:hover:not(.rbc-active) {
          background-color: #e2e8f0;
        }
      `}</style>
      <BigCalendar
        {...calendarStyles}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable={!readOnly}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        views={["month", "week", "day"]}
        defaultView="month"
      />
      {!readOnly && (
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEvent}
          onDelete={selectedEvent ? handleDeleteEvent : undefined}
          mode={selectedEvent ? "edit" : "add"}
          defaultValues={
            selectedEvent
              ? {
                  title: selectedEvent.title,
                  description: selectedEvent.description,
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
