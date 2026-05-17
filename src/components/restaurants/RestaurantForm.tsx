import { useEffect, useState } from "react";
import type { RestaurantFormValues, RestaurantStatus } from "../../types/restaurants-types";
import { classNames } from "../helper";
import { IMAGE_ACCEPT, validateImageFile } from "../imageUpload";
import { getApiErrorMessages } from "../../api/apiFetch";
import FormErrorSummary from "../shared/FormErrorSummary";

const RestaurantForm = ({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial: RestaurantFormValues;
  submitLabel: string;
  onSubmit: (values: RestaurantFormValues) => Promise<void>;
  onCancel: () => void;
}) => {
  const [form, setForm] = useState<RestaurantFormValues>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState(initial.existingImgUrl ?? "");

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const validate = (v: RestaurantFormValues) => {
    const e: Record<string, string> = {};
    if (!v.name.trim()) e.name = "Name is required";
    if (!v.location.trim()) e.location = "Location is required";
    if (!v.cuisine.trim()) e.cuisine = "Cuisine is required";
    if (!v.description.trim()) e.description = "Description is required";
    if (!v.imageFile && !v.existingImgUrl) e.imageFile = "Image is required";
    const imageError = validateImageFile(v.imageFile);
    if (imageError) e.imageFile = imageError;
    return e;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiErrors([]);
    const eMap = validate(form);
    setErrors(eMap);
    if (Object.keys(eMap).length > 0) return;
    try {
      await onSubmit(form);
    } catch (err) {
      setApiErrors(getApiErrorMessages(err, "Restaurant could not be saved."));
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <FormErrorSummary messages={apiErrors} />

      <div>
        <label className="text-xs font-medium text-slate-700">Name</label>
        <input
          className={classNames(
            "mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-slate-400",
            errors.name ? "border-rose-300" : "border-slate-200"
          )}
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="e.g. Bella Italia"
        />
        {errors.name && <div className="mt-1 text-xs text-rose-600">{errors.name}</div>}
      </div>

      <div>
        <label className="text-xs font-medium text-slate-700">Description</label>
        <textarea
          className={classNames(
            "mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-slate-400",
            errors.description ? "border-rose-300" : "border-slate-200"
          )}
          value={form.description}
          rows={3}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          placeholder="e.g. Bella Italia"
        />
        {errors.description && <div className="mt-1 text-xs text-rose-600">{errors.description}</div>}
      </div>

      <div>
        <label className="text-xs font-medium text-slate-700">Location</label>
        <input
          className={classNames(
            "mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-slate-400",
            errors.location ? "border-rose-300" : "border-slate-200"
          )}
          value={form.location}
          onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
          placeholder="e.g. Sofia"
        />
        {errors.location && <div className="mt-1 text-xs text-rose-600">{errors.location}</div>}
      </div>

      <div>
        <label className="text-xs font-medium text-slate-700">Cuisine</label>
        <input
          className={classNames(
            "mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-slate-400",
            errors.cuisine ? "border-rose-300" : "border-slate-200"
          )}
          value={form.cuisine}
          onChange={(e) => setForm((p) => ({ ...p, cuisine: e.target.value }))}
          placeholder="e.g. Italian"
        />
        {errors.cuisine && <div className="mt-1 text-xs text-rose-600">{errors.cuisine}</div>}
      </div>

      <div>
        <label className="text-xs font-medium text-slate-700">Status</label>
        <select
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          value={form.status}
          onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as RestaurantStatus }))}
        >
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-700">Image</label>
        {previewUrl && (
          <div className="mt-2 h-32 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
            <img src={previewUrl} alt={form.name || "Restaurant preview"} className="h-full w-full object-cover" />
          </div>
        )}
        <input
          className={classNames(
            "mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-slate-400",
            errors.imageFile ? "border-rose-300" : "border-slate-200"
          )}
          type="file"
          accept={IMAGE_ACCEPT}
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            setForm((p) => ({ ...p, imageFile: file }));
            if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(file ? URL.createObjectURL(file) : form.existingImgUrl ?? "");
          }}
        />
        {errors.imageFile && <div className="mt-1 text-xs text-rose-600">{errors.imageFile}</div>}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export default RestaurantForm;
