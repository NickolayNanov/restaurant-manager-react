import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { analytics } from "../../data/dashboard";

const PerformanceAnalytics = () => {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Performance Analytics</h3>
        <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
          Last 6 months
        </button>
      </div>

      <div className="mt-3 h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          {/* A combo look: bars for revenue + line for rating */}
          <BarChart data={analytics} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" />
            {/* Line overlays in same chart visually; simple and clean */}
            <Line type="monotone" dataKey="rating" strokeWidth={2} dot={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex gap-3 text-xs text-slate-600">
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-slate-900" /> Revenue
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-slate-500" /> Rating
        </span>
      </div>
    </section>
  );
};

export default PerformanceAnalytics;