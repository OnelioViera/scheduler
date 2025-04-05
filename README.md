# Modern Scheduler & Planner

A modern, full-featured task management and scheduling application built with Next.js, React, and Tailwind CSS. This application provides an intuitive interface for managing tasks and calendar events with real-time persistence using Vercel Blob Storage.

## Features

### Task Management
- Create, edit, and delete tasks
- Set task priorities (high, medium, low)
- Add task descriptions and tags
- Mark tasks as completed
- Set due dates for tasks
- Sort tasks by priority

### Calendar Management
- Interactive calendar interface using react-big-calendar
- Create, edit, and delete events
- Support for all-day events
- Multiple calendar views (month, week, day)
- Drag and drop event scheduling
- Event descriptions and details

### User Interface
- Modern, clean design with Tailwind CSS
- Responsive layout for all devices
- Dark mode support
- Toast notifications for user feedback
- Modal dialogs for event creation/editing
- Smooth animations and transitions

### Data Persistence
- Automatic data saving using Vercel Blob Storage
- Real-time synchronization
- Reliable data recovery on page refresh
- Error handling and recovery
- Secure data storage

## Technology Stack

- **Frontend Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Calendar**: react-big-calendar
- **Storage**: Vercel Blob Storage
- **Notifications**: react-hot-toast
- **Type Safety**: TypeScript
- **UI Components**: HeadlessUI

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- A Vercel account (for Blob Storage)

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/scheduler.git
cd scheduler
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a \`.env.local\` file in the root directory and add your Vercel Blob storage token:
\`\`\`env
BLOB_READ_WRITE_TOKEN=your_token_here
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

### Environment Variables

- `BLOB_READ_WRITE_TOKEN`: Your Vercel Blob storage access token (required for data persistence)

## Deployment

This application is optimized for deployment on Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Add your `BLOB_READ_WRITE_TOKEN` to the Vercel project environment variables
4. Deploy!

## Usage

### Task Management
- Click "Add Task" to create a new task
- Set task priority, due date, and description
- Use tags to organize tasks
- Click on a task to edit or delete it

### Calendar Management
- Click on any time slot to create a new event
- Drag and drop events to reschedule
- Click on events to edit or delete them
- Switch between month, week, and day views
- Create all-day events when needed

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Big Calendar](https://github.com/jquense/react-big-calendar)
- [Vercel](https://vercel.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [HeadlessUI](https://headlessui.dev/)
