import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import { apiFetch, getApiErrorMessages } from "../../api/apiFetch";
import type { PerformanceAnalyticsResponse } from "../../types/monthly-report-types";

const formatRevenue = (value: number) => `$${value.toLocaleString()}`;
const formatRating = (value: number) => value.toFixed(1);

const PerformanceAnalytics = () => {
  const [data, setData] = useState<Array<{ month: string; revenue: number; rating: number | null }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadAnalytics = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const response: PerformanceAnalyticsResponse = await apiFetch("api/dashboard/performance-analytics?months=6", {
          method: "GET",
        });

        if (!mounted) return;
        setData(
          response.months.map((month) => ({
            month: month.label,
            revenue: month.revenue,
            rating: month.rating,
          }))
        );
      } catch (error) {
        if (!mounted) return;
        setLoadError(getApiErrorMessages(error, "Performance analytics could not be loaded.")[0]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    void loadAnalytics();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Performance Analytics</h3>
        <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
          Last 6 months
        </button>
      </div>

      <div className="mt-3 h-[260px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-500">
            Loading analytics...
          </div>
        ) : loadError ? (
          <div className="flex h-full items-center justify-center rounded-lg border border-rose-200 bg-rose-50 px-4 text-center text-sm text-rose-700">
            {loadError}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis
                yAxisId="revenue"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickFormatter={(value) => `$${Number(value) / 1000}k`}
              />
              <YAxis
                yAxisId="rating"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                domain={[0, 5]}
                tickFormatter={formatRating}
              />
              <Tooltip
                cursor={{ fill: "#eff6ff" }}
                formatter={(value, name) => {
                  if (name === "Revenue") return [formatRevenue(Number(value)), name];
                  if (value == null) return ["No rating submitted", name];
                  return [formatRating(Number(value)), name];
                }}
                labelStyle={{ color: "#0f172a", fontWeight: 600 }}
                contentStyle={{
                  borderRadius: 8,
                  borderColor: "#e2e8f0",
                  boxShadow: "0 12px 28px rgba(15, 23, 42, 0.12)",
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: "#475569" }} />
              <Bar yAxisId="revenue" dataKey="revenue" name="Revenue" fill="#2563eb" radius={[6, 6, 0, 0]} />
              <Line
                yAxisId="rating"
                type="monotone"
                dataKey="rating"
                name="Rating"
                stroke="#f59e0b"
                strokeWidth={3}
                connectNulls={false}
                dot={{ r: 4, fill: "#f59e0b", stroke: "#fff", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#f59e0b", stroke: "#fff", strokeWidth: 2 }}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
};

export default PerformanceAnalytics;
