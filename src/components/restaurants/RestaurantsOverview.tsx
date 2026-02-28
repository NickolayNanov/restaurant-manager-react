import { useNavigate } from "react-router-dom";
import { restaurants } from "../../data/dashboard";

const StatusPill = ({ status }: { status: "Open" | "Closed" }) => {
  const cls =
    status === "Open"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-rose-50 text-rose-700 border-rose-200";

  return <span className={`rounded-full border px-2 py-1 text-xs font-medium ${cls}`}>{status}</span>;
}

const RestaurantsOverview = () => {
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
        {restaurants.map((r) => (
          <div key={r.id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-slate-200" />
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