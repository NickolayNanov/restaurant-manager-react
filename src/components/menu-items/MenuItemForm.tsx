import { useEffect, useState } from "react";
import { type MenuItemFormValues } from "../../pages/MenuEditorPage";
import type { Category } from "../../types/categories-types";
import { cx } from "../helper";
import { IMAGE_ACCEPT, validateImageFile } from "../imageUpload";

const MenuItemForm = ({
  initial,
  categories,
  submitLabel,
  onCancel,
  onSubmit,
}: {
  initial: MenuItemFormValues;
  categories: Category[];
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (v: MenuItemFormValues) => void;
}) => {
  const [v, setV] = useState<MenuItemFormValues>(initial);
  const [err, setErr] = useState<Record<string, string>>({});
  const [previewUrl, setPreviewUrl] = useState(initial.existingImgUrl ?? "");

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const validate = (x: MenuItemFormValues) => {
    const e: Record<string, string> = {};
    if (!x.name.trim()) e.name = "Name is required";
    if (!Number.isFinite(x.price) || x.price <= 0) e.price = "Price must be > 0";
    if (!x.category.name.trim()) e.category = "Category is required";
    if (!x.imageFile && !x.existingImgUrl) e.imageFile = "Image is required";
    const imageError = validateImageFile(x.imageFile);
    if (imageError) e.imageFile = imageError;
    return e;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const eMap = validate(v);
    setErr(eMap);
    if (Object.keys(eMap).length) return;

    onSubmit({
      name: v.name.trim(),
      price: Number(v.price),
      imageFile: v.imageFile,
      existingImgUrl: v.existingImgUrl,
      isActive: v.isActive,
      category: {
        ...v.category
      }
    });
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div>
        <label className="text-xs font-medium text-slate-700">Name</label>
        <input
          className={cx(
            "mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-slate-400",
            err.name ? "border-rose-300" : "border-slate-200"
          )}
          value={v.name}
          onChange={(e) => setV((p) => ({ ...p, name: e.target.value }))}
          placeholder="e.g. Grilled Salmon"
        />
        {err.name && <div className="mt-1 text-xs text-rose-600">{err.name}</div>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-slate-700">Price</label>
          <input
            type="number"
            step="0.01"
            className={cx(
              "mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-slate-400",
              err.price ? "border-rose-300" : "border-slate-200"
            )}
            value={v.price}
            onChange={(e) => setV((p) => ({ ...p, price: Number(e.target.value) }))}
          />
          {err.price && <div className="mt-1 text-xs text-rose-600">{err.price}</div>}
        </div>

        <div>
          <label className="text-xs font-medium text-slate-700">Category</label>
          <select
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
            value={v.category.id}
            onChange={(e) => setV((p) => ({ ...p, category: categories.find(c => c.id === e.target.value)! }))}
          >
            {categories?.map(c => {
              return <option key={c.id} value={c.id}>{c.name}</option>
            })}
          </select>
          {err.category && <div className="mt-1 text-xs text-rose-600">{err.category}</div>}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-700">Image</label>
        {previewUrl && (
          <div className="mt-2 h-32 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
            <img src={previewUrl} alt={v.name || "Menu item preview"} className="h-full w-full object-cover" />
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
            setV((p) => ({ ...p, imageFile: file }));
            if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(file ? URL.createObjectURL(file) : v.existingImgUrl ?? "");
          }}
        />
        {err.imageFile && <div className="mt-1 text-xs text-rose-600">{err.imageFile}</div>}
      </div>

      <div>
        <label className="text-xs font-medium text-slate-700">Status</label>
        <select
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          value={v.isActive ? "active" : "inactive"}
          onChange={(e) => setV((p) => ({ ...p, isActive: e.target.value == "active" }))}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default MenuItemForm;
