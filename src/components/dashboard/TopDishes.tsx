import { ChevronRight } from "lucide-react";
import { topDishes } from "../../data/dashboard";

const TopDishes = () => {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Top Dishes</h3>
        <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
          View all
        </button>
      </div>

      <div className="mt-3 divide-y divide-slate-100">
        {topDishes.map((d) => (
          <div key={d.id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-200" />
              <div>
                <div className="text-sm font-medium text-slate-900">{d.name}</div>
                <div className="text-xs text-slate-500">{d.restaurant}</div>
              </div>
            </div>
            <button className="rounded-lg p-2 hover:bg-slate-100" aria-label="Open dish">
              <ChevronRight className="h-4 w-4 text-slate-600" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TopDishes;