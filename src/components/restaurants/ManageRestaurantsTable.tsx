import { ChefHat, ExternalLink, MapPin, Pencil, Trash2 } from "lucide-react";
import type { Restaurant, RestaurantStatus } from "../../types/restaurants";
import { useNavigate } from "react-router-dom";

type ManageRestaurantsTableProps = {
  data: Restaurant[];
  setDeleteTarget: (r: Restaurant) => void;
  setEditTarget: (r: Restaurant) => void;
  classNames: (...v: Array<string | undefined | false>) => string;
  fetchRestaurants: () => Promise<void>;
};

const StatusPill = ({ status, classNames }: { status: RestaurantStatus; classNames: (...v: Array<string | undefined | false>) => string }) => {
  const cls =
    status === "Open"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-rose-200 bg-rose-50 text-rose-700";

  return (
    <span className={classNames("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", cls)}>
      {status}
    </span>
  );
}

const ManageRestaurantsTable = ({
  data,
  setDeleteTarget,
  setEditTarget,
  classNames,
  fetchRestaurants
}: ManageRestaurantsTableProps) => {
  const navigate = useNavigate();

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold text-slate-600">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Location</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Cuisine</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {data.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/60">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                      <img src={r.imgUrl} alt={r.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{r.name}</div>
                      <div className="mt-0.5 text-xs text-slate-500">ID: {r.id.slice(0, 8)}…</div>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    {r.location}
                  </div>
                </td>

                <td className="px-5 py-4">
                  <StatusPill status={r.status} classNames={classNames} />
                </td>

                <td className="px-5 py-4">
                  <div className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <ChefHat className="h-4 w-4 text-slate-400" />
                    {r.cuisine}
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    {/* Open -> menus */}
                    <button
                      onClick={() => navigate(`${r.id}`)}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open
                    </button>

                    <button
                      onClick={() => setEditTarget(r)}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteTarget(r)}
                      className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-14 text-center">
                  <div className="text-sm font-medium text-slate-900">No restaurants yet</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Click <span className="font-semibold">New Restaurant</span> to create your first one.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-xs text-slate-600">
        <span>Showing {data.length} result(s)</span>
        <button
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          onClick={fetchRestaurants}
        >
          Refresh data
        </button>
      </div>
    </section>
  )
};

export default ManageRestaurantsTable

