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
  CreateProjectInput,
  UpdateProjectInput,
} from "../../types/project";

interface ProjectFormProps {
  initialData?: {
    title: string;
    description: string;
  };

  onSubmit: (
    data:
      | CreateProjectInput
      | UpdateProjectInput
  ) => Promise<void>;

  onCancel: () => void;

  submitLabel?: string;
}

const ProjectForm = ({
  initialData,
  onSubmit,
  onCancel,
  submitLabel,
}: ProjectFormProps) => {
  const [title, setTitle] =
    useState(
      initialData?.title || ""
    );

  const [description, setDescription] =
    useState(
      initialData?.description || ""
    );

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    setTitle(
      initialData?.title || ""
    );

    setDescription(
      initialData?.description || ""
    );

    setError("");
  }, [initialData]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedTitle =
      title.trim();

    const trimmedDescription =
      description.trim();

    if (!trimmedTitle) {
      setError(
        "Project title is required."
      );

      return;
    }

    if (
      trimmedTitle.length < 2
    ) {
      setError(
        "Project title must be at least 2 characters."
      );

      return;
    }

    if (
      trimmedTitle.length > 200
    ) {
      setError(
        "Project title must not exceed 200 characters."
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

    try {
      setLoading(true);
      setError("");

      await onSubmit({
        title: trimmedTitle,
        description:
          trimmedDescription ||
          undefined,
      });
    } catch (err) {
      console.error(
        "Project form error:",
        err
      );

      setError(
        "Unable to save project."
      );
    } finally {
      setLoading(false);
    }
  };

  const isEditing =
    Boolean(initialData);

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title={
        isEditing
          ? "Edit Project"
          : "Create Project"
      }
      description={
        isEditing
          ? "Update your project details."
          : "Create a project to organize your team's work."
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
          id="project-title"
          type="text"
          label="Project Title"
          value={title}
          onChange={(event) =>
            setTitle(
              event.target.value
            )
          }
          placeholder="e.g. Website Redesign"
          disabled={loading}
          error={
            error.includes("title")
              ? error
              : undefined
          }
        />

        {/* DESCRIPTION */}

        <div>
          <label
            htmlFor="project-description"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Description
            <span className="ml-1 font-normal text-slate-400">
              (optional)
            </span>
          </label>

          <textarea
            id="project-description"
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            placeholder="Describe what this project is about..."
            rows={5}
            disabled={loading}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
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
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : submitLabel ||
                (isEditing
                  ? "Save Changes"
                  : "Create Project")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectForm;