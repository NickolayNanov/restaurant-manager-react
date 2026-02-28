import { ChefHat, ImageIcon, Pencil, Trash2 } from "lucide-react";
import type { MenuItem } from "../../types/menu-item-types";
import { cx, money } from "../helper";

const FragmentCategoryGroup = ({
  category,
  items,
  onEdit,
  onDelete,
}: {
  category: string;
  items: MenuItem[];
  onEdit: (it: MenuItem) => void;
  onDelete: (it: MenuItem) => void;
}) => {
  return (
    <>
      {/* Group header row */}
      <tr className="bg-slate-50">
        <td colSpan={4} className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
              <ChefHat className="h-4 w-4 text-slate-500" />
              {category}
            </div>
            <div className="text-xs text-slate-600">{items.length} item(s)</div>
          </div>
        </td>
      </tr>

      {items.map((it) => (
        <tr key={it.id} className="hover:bg-slate-50/60">
          <td className="px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-lg bg-slate-100">
                {it.imgUrl ? (
                  <img src={it.imgUrl} alt={it.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-500">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm font-semibold text-slate-900">{it.name}</div>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={cx(
                      "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                      it.isActive ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-700"
                    )}
                  >
                    {it.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="text-xs text-slate-500">ID: {it.id.slice(0, 8)}…</span>
                </div>
              </div>
            </div>
          </td>

          <td className="px-4 py-4 text-sm font-semibold text-slate-900">{money(it.price)}</td>
          <td className="px-4 py-4 text-sm text-slate-700">{category}</td>

          <td className="px-4 py-4">
            <div className="flex justify-end gap-2">
              <button
                onClick={() => onEdit(it)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>

              <button
                onClick={() => onDelete(it)}
                className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default FragmentCategoryGroup;