"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarIcon,
  ClipboardDocumentListIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-blue-600 dark:bg-gray-800 shadow-md">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white mr-8">
              Task & Event Scheduler
            </h1>
            <div className="flex space-x-4">
              <Link
                href="/"
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/")
                    ? "bg-blue-700 text-white"
                    : "text-white hover:bg-blue-700"
                }`}
              >
                <HomeIcon className="h-5 w-5 mr-2" />
                Home
              </Link>

              <Link
                href="/tasks"
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/tasks")
                    ? "bg-blue-700 text-white"
                    : "text-white hover:bg-blue-700"
                }`}
              >
                <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
                Tasks
              </Link>

              <Link
                href="/calendar"
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/calendar")
                    ? "bg-blue-700 text-white"
                    : "text-white hover:bg-blue-700"
                }`}
              >
                <CalendarIcon className="h-5 w-5 mr-2" />
                Calendar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
