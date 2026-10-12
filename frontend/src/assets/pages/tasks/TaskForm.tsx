import {
  useEffect,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Alert from "../../components/ui/Alert";

import type {
  ProjectMember,
} from "../../types/member";

import type {
  CreateTaskInput,
  UpdateTaskInput,
} from "../../types/task";

interface TaskFormProps {
  initialData?: {
    title: string;
    description: string;
    dueDate: string;
    assignedToId: number;
  };

  members: ProjectMember[];

  onSubmit: (
    data:
      | CreateTaskInput
      | UpdateTaskInput
  ) => Promise<void>;

  onCancel: () => void;

  submitLabel?: string;
}

const TaskForm = ({
  initialData,
  members,
  onSubmit,
  onCancel,
  submitLabel = "Create Task",
}: TaskFormProps) => {
  const [title, setTitle] =
    useState(
      initialData?.title ?? ""
    );

  const [description, setDescription] =
    useState(
      initialData?.description ?? ""
    );

  const [dueDate, setDueDate] =
    useState(
      initialData?.dueDate
        ? initialData.dueDate.slice(
            0,
            10
          )
        : ""
    );

  const [assignedToId, setAssignedToId] =
    useState(
      initialData?.assignedToId
        ? String(
            initialData.assignedToId
          )
        : ""
    );

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (!initialData) {
      setTitle("");
      setDescription("");
      setDueDate("");
      setAssignedToId("");
      setError("");

      return;
    }

    setTitle(
      initialData.title
    );

    setDescription(
      initialData.description
    );

    setDueDate(
      initialData.dueDate
        ? initialData.dueDate.slice(
            0,
            10
          )
        : ""
    );

    setAssignedToId(
      initialData.assignedToId
        ? String(
            initialData.assignedToId
          )
        : ""
    );

    setError("");
  }, [initialData]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    const trimmedTitle =
      title.trim();

    const trimmedDescription =
      description.trim();

    if (!trimmedTitle) {
      setError(
        "Task title is required."
      );

      return;
    }

    if (
      trimmedTitle.length < 2
    ) {
      setError(
        "Task title must be at least 2 characters."
      );

      return;
    }

    if (
      trimmedTitle.length > 200
    ) {
      setError(
        "Task title must not exceed 200 characters."
      );

      return;
    }

    if (
      trimmedDescription.length >
      2000
    ) {
      setError(
        "Description must not exceed 2000 characters."
      );

      return;
    }

    if (!assignedToId) {
      setError(
        "Please assign the task to a project member."
      );

      return;
    }

    try {
      setLoading(true);

      const formattedDueDate =
        dueDate
          ? new Date(
              `${dueDate}T00:00:00`
            ).toISOString()
          : undefined;

      const data:
        | CreateTaskInput
        | UpdateTaskInput = {
        title: trimmedTitle,

        description:
          trimmedDescription ||
          undefined,

        dueDate:
          formattedDueDate,

        ...(initialData
          ? {}
          : {
              assignedToId:
                Number(
                  assignedToId
                ),
            }),
      };

      await onSubmit(data);
    } catch (err) {
      console.error(
        "Task form submission failed:",
        err
      );

      setError(
        "Unable to save task."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title={
        initialData
          ? "Edit Task"
          : "Create Task"
      }
      description={
        initialData
          ? "Update the task details."
          : "Add a new task to this project."
      }
      size="md"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {error && (
          <Alert
            message={error}
            variant="error"
            onClose={() =>
              setError("")
            }
          />
        )}

        {/* TITLE */}

        <Input
          id="task-title"
          type="text"
          label="Task title"
          value={title}
          onChange={(event) =>
            setTitle(
              event.target.value
            )
          }
          disabled={loading}
          placeholder="e.g. Build authentication UI"
        />

        {/* DESCRIPTION */}

        <div>
          <label
            htmlFor="task-description"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Description
          </label>

          <textarea
            id="task-description"
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            disabled={loading}
            rows={4}
            placeholder="Describe what needs to be done..."
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
          />
        </div>

        {/* MEMBER + DATE */}

        <div className="grid gap-5 sm:grid-cols-2">

          {/* ASSIGNEE */}

          <div>
            <label
              htmlFor="task-assignee"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Assign to
            </label>

            <select
              id="task-assignee"
              value={assignedToId}
              onChange={(event) =>
                setAssignedToId(
                  event.target.value
                )
              }
              disabled={
                loading ||
                members.length === 0
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            >
              <option value="">
                Select member
              </option>

              {members.map(
                (member) => (
                  <option
                    key={
                      member.userId
                    }
                    value={
                      member.userId
                    }
                  >
                    {member.user.name}
                  </option>
                )
              )}
            </select>

            {members.length ===
              0 && (
              <p className="mt-2 text-xs text-amber-600">
                Add a project member first.
              </p>
            )}
          </div>

          {/* DUE DATE */}

          <Input
            id="task-due-date"
            type="date"
            label="Due date"
            value={dueDate}
            onChange={(event) =>
              setDueDate(
                event.target.value
              )
            }
            disabled={loading}
          />

        </div>

        {/* ACTIONS */}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            loading={loading}
            disabled={
              loading ||
              members.length === 0
            }
          >
            {loading
              ? "Saving..."
              : submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskForm;