import { useNavigate } from "react-router-dom";
import type { Restaurant } from "../../types/restaurants-types";

const StatusPill = ({ status }: { status: "Open" | "Closed" }) => {
  const cls =
    status === "Open"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-rose-50 text-rose-700 border-rose-200";

  return <span className={`rounded-full border px-2 py-1 text-xs font-medium ${cls}`}>{status}</span>;
}

type RestaurantsOverviewProps = {
  restaurants: Restaurant[];
  isLoading: boolean;
};

const RestaurantsOverview = ({ restaurants, isLoading }: RestaurantsOverviewProps) => {
  const navigate = useNavigate();
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Restaurants Overview</h3>
        <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          onClick={() => navigate("/manage-restaurants")}>
          Manage Restaurants
        </button>
      </div>

      <div className="mt-3 divide-y divide-slate-100">
        {isLoading ? (
          <div className="flex min-h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
          </div>
        ) : restaurants.length === 0 ? (
          <div className="flex min-h-48 items-center justify-center px-4 text-center">
            <div>
              <div className="text-sm font-semibold text-slate-900">No restaurants yet</div>
              <div className="mt-1 text-sm text-slate-500">
                Create your first restaurant to see it appear here.
              </div>
            </div>
          </div>
        ) : restaurants.map((r) => (
          <div key={r.id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-lg bg-slate-200">
                {r.imgUrl ? (
                  <img src={r.imgUrl} alt={r.name} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div>
                <div className="text-sm font-medium text-slate-900">{r.name}</div>
                <div className="text-xs text-slate-500">
                  {r.cuisine} • {r.location} • {3} ★
                </div>
              </div>
            </div>
            <StatusPill status={r.status} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default RestaurantsOverview;
