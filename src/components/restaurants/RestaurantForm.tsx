import { useState } from "react";
import type { RestaurantFormValues, RestaurantStatus } from "../../types/restaurants";
import { classNames } from "../helper";

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

  const validate = (v: RestaurantFormValues) => {
    const e: Record<string, string> = {};
    if (!v.name.trim()) e.name = "Name is required";
    if (!v.location.trim()) e.location = "Location is required";
    if (!v.cuisine.trim()) e.cuisine = "Cuisine is required";
    if (!v.description.trim()) e.description = "Description is required";
    if (!v.imgUrl.trim()) e.imgUrl = "Img url is required";
    return e;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eMap = validate(form);
    setErrors(eMap);
    if (Object.keys(eMap).length > 0) return;
    await onSubmit(form);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
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
        {errors.name && <div className="mt-1 text-xs text-rose-600">{errors.description}</div>}
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
        <label className="text-xs font-medium text-slate-700">Img Url</label>
        <input
          className={classNames(
            "mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-slate-400",
            errors.cuisine ? "border-rose-300" : "border-slate-200"
          )}
          value={form.imgUrl}
          onChange={(e) => setForm((p) => ({ ...p, imgUrl: e.target.value }))}
          placeholder="e.g. http://localhost:7123/manage-restaurants"
        />
        {errors.cuisine && <div className="mt-1 text-xs text-rose-600">{errors.imgUrl}</div>}
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