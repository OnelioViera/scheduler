import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: { title: string; description: string }) => void;
  onDelete?: () => void;
  defaultValues?: {
    title: string;
    description: string;
  };
  mode: "add" | "edit";
}

export default function EventModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  defaultValues,
  mode,
}: EventModalProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!title.trim()) {
      toast.error("Please enter an event title", {
        style: {
          border: "1px solid #fecaca",
          padding: "16px",
          color: "#dc2626",
          backgroundColor: "#fef2f2",
        },
      });
      return;
    }

    onSave({ title, description });
    onClose();
  };

  const handleDelete = () => {
    toast(
      (t) => (
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium text-gray-900">
            Are you sure you want to delete this event?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onDelete?.();
                onClose();
                toast.dismiss(t.id);
              }}
              className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: "top-center",
        style: {
          background: "white",
          padding: "16px",
          borderRadius: "12px",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
      }
    );
  };

  const inputClasses =
    "w-full rounded-xl border border-gray-100 py-3 px-4 text-base shadow-sm focus:outline-none focus:border-gray-200 hover:border-gray-200 text-gray-900 placeholder:text-gray-400 transition-colors";

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-6">
                      <Dialog.Title
                        as="h3"
                        className="text-2xl font-semibold leading-6 text-gray-900"
                      >
                        {mode === "add" ? "Add New Event" : "Edit Event"}
                      </Dialog.Title>
                      {mode === "edit" && onDelete && (
                        <button
                          type="button"
                          onClick={handleDelete}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 hover:text-red-800 focus:outline-none"
                        >
                          <TrashIcon className="h-5 w-5 mr-1" />
                          Delete
                        </button>
                      )}
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label
                          htmlFor="title"
                          className="block text-base font-semibold text-gray-900 mb-2"
                        >
                          Event Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          defaultValue={defaultValues?.title}
                          className={inputClasses}
                          placeholder="Enter event title"
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
                          name="description"
                          id="description"
                          rows={4}
                          defaultValue={defaultValues?.description}
                          className={inputClasses}
                          placeholder="Enter event description"
                        />
                      </div>
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                        <button
                          type="submit"
                          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none transition-colors duration-200"
                        >
                          {mode === "add" ? "Add Event" : "Save Changes"}
                        </button>
                        <button
                          type="button"
                          className="mt-3 sm:mt-0 w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-gray-900 font-medium border border-gray-200 hover:bg-gray-50 focus:outline-none transition-colors duration-200"
                          onClick={onClose}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
