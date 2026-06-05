import { useEffect, useState } from "react";
import type { MenuForm, MenuType } from "../../types/menu-types";
import { cx } from "../helper";
import { IMAGE_ACCEPT, validateImageFile } from "../imageUpload";
import { getApiErrorMessages } from "../../api/apiFetch";
import FormErrorSummary from "../shared/FormErrorSummary";

const MenuEditForm = ({
  initial,
  onCancel,
  onSubmit,
}: {
  initial: MenuForm;
  onCancel: () => void;
  onSubmit: (v: MenuForm) => Promise<void>;
}) => {
  const [form, setForm] = useState<MenuForm>(initial);
  const [err, setErr] = useState<Record<string, string>>({});
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState(initial.existingImgUrl ?? "");

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const validate = (x: MenuForm) => {
    const e: Record<string, string> = {};
    if (!x.name.trim()) e.name = "Name is required";
    if (!x.description.trim()) e.description = "Description is required";
    if (!x.imageFile && !x.existingImgUrl) e.imageFile = "Image is required";
    const imageError = validateImageFile(x.imageFile);
    if (imageError) e.imageFile = imageError;
    if (!x.type.trim()) e.type = "Restaurant type is required";
    return e;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiErrors([]);
    const eMap = validate(form);
    setErr(eMap);
    if (Object.keys(eMap).length) return;
    try {
      await onSubmit(form);
    } catch (error) {
      setApiErrors(getApiErrorMessages(error, "Menu could not be saved."));
    }
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <FormErrorSummary messages={apiErrors} />

      <div>
        <label className="text-xs font-medium text-slate-700">Name</label>
        <input
          className={cx(
            "mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-slate-400",
            err.name ? "border-rose-300" : "border-slate-200"
          )}
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        />
        {err.name && <div className="mt-1 text-xs text-rose-600">{err.name}</div>}
      </div>

      <div>
        <label className="text-xs font-medium text-slate-700">Description</label>
        <textarea
          className={cx(
            "mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-slate-400",
            err.description ? "border-rose-300" : "border-slate-200"
          )}
          rows={3}
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
        />
        {err.description && <div className="mt-1 text-xs text-rose-600">{err.description}</div>}
      </div>

      <div>
        <label className="text-xs font-medium text-slate-700">Image</label>
        {previewUrl && (
          <div className="mt-2 h-32 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
            <img src={previewUrl} alt={form.name || "Menu preview"} className="h-full w-full object-cover" />
          </div>
        )}
        <input
          className={cx(
            "mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-slate-400",
            err.imageFile ? "border-rose-300" : "border-slate-200"
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
        {err.imageFile && <div className="mt-1 text-xs text-rose-600">{err.imageFile}</div>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-slate-700">Type</label>
          <select
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
            value={form.type}
            onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as MenuType }))}
          >
            <option value="Default">All Year</option>
            <option value="Summer">Summer</option>
            <option value="Spring">Spring</option>
            <option value="Autumn">Autumn</option>
            <option value="Winter">Winter</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-700">Status</label>
          <select
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
            value={form.isActive ? "active" : "inactive"}
            onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.value === "active" }))}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
          Save
        </button>
      </div>
    </form>
  );
};

export default MenuEditForm;
