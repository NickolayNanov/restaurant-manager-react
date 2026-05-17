import { CalendarDays, Pencil, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { apiFetch, getApiErrorMessages } from "../../api/apiFetch";
import type {
  ListRestaurantMonthlyReportsResponse,
  RestaurantMonthlyReport,
  RestaurantMonthlyReportFormValues,
} from "../../types/monthly-report-types";
import ModalShell from "../modals/ModalShell";
import FormErrorSummary from "../shared/FormErrorSummary";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentMonthValue = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const reportToMonthValue = (report: RestaurantMonthlyReport) =>
  `${report.year}-${String(report.month).padStart(2, "0")}`;

const emptyForm: RestaurantMonthlyReportFormValues = {
  monthValue: currentMonthValue(),
  revenue: "",
  rating: "",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

const formatUpdated = (report: RestaurantMonthlyReport) => {
  const value = report.updatedAt ?? report.createdAt;
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString();
};

const parseMonthValue = (value: string) => {
  const [year, month] = value.split("-").map(Number);
  return { year, month };
};

const MonthlyReportsSection = ({ restaurantId }: { restaurantId: string }) => {
  const [reports, setReports] = useState<RestaurantMonthlyReport[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<RestaurantMonthlyReportFormValues>(emptyForm);
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const fetchReports = useCallback(async () => {
    try {
      setLoadError(null);
      const response: ListRestaurantMonthlyReportsResponse = await apiFetch(
        `api/restaurants/${restaurantId}/monthly-reports`,
        { method: "GET" }
      );
      setReports(response.reports ?? []);
    } catch (error) {
      setLoadError(getApiErrorMessages(error, "Monthly reports could not be loaded.")[0]);
    }
  }, [restaurantId]);

  useEffect(() => {
    void fetchReports();
  }, [fetchReports]);

  const reportByMonth = useMemo(() => {
    const map = new Map<string, RestaurantMonthlyReport>();
    reports.forEach((report) => map.set(reportToMonthValue(report), report));
    return map;
  }, [reports]);

  const selectedReport = reportByMonth.get(form.monthValue) ?? null;

  const openCreate = () => {
    setForm({ ...emptyForm });
    setApiErrors([]);
    setModalOpen(true);
  };

  const openEdit = (report: RestaurantMonthlyReport) => {
    setForm({
      monthValue: reportToMonthValue(report),
      revenue: String(report.revenue),
      rating: String(report.rating),
    });
    setApiErrors([]);
    setModalOpen(true);
  };

  const handleMonthChange = (monthValue: string) => {
    const existing = reportByMonth.get(monthValue);
    setForm({
      monthValue,
      revenue: existing ? String(existing.revenue) : "",
      rating: existing ? String(existing.rating) : "",
    });
  };

  const saveReport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiErrors([]);
    setIsSaving(true);

    const { year, month } = parseMonthValue(form.monthValue);
    const payload = {
      year,
      month,
      revenue: Number(form.revenue),
      rating: Number(form.rating),
    };

    try {
      if (selectedReport) {
        await apiFetch(`api/restaurants/${restaurantId}/monthly-reports/${year}/${month}`, {
          method: "PUT",
          body: JSON.stringify(payload),
          showToast: false,
        });
        toast.success("Monthly report updated.");
      } else {
        await apiFetch(`api/restaurants/${restaurantId}/monthly-reports`, {
          method: "POST",
          body: JSON.stringify(payload),
          showToast: false,
        });
        toast.success("Monthly report submitted.");
      }

      await fetchReports();
      setModalOpen(false);
    } catch (error) {
      setApiErrors(getApiErrorMessages(error, "Monthly report could not be saved."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Monthly Reports</h3>
          <p className="mt-1 text-sm text-slate-600">
            Submit revenue and rating figures that feed the dashboard analytics.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Submit monthly report
        </button>
      </div>

      <div className="px-5 py-4">
        {loadError && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {loadError}
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="hidden grid-cols-12 gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
            <div className="col-span-4">Month</div>
            <div className="col-span-3 text-right">Revenue</div>
            <div className="col-span-2 text-right">Rating</div>
            <div className="col-span-2 text-right">Updated</div>
            <div className="col-span-1 text-right">Edit</div>
          </div>

          {reports.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <CalendarDays className="mx-auto h-8 w-8 text-slate-300" />
              <div className="mt-3 text-sm font-semibold text-slate-900">No monthly reports yet</div>
              <div className="mt-1 text-sm text-slate-500">
                Add the first report to start feeding dashboard analytics.
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-slate-200">
              {reports.map((report) => (
                <li key={report.id} className="grid grid-cols-1 gap-3 px-4 py-4 md:grid-cols-12 md:items-center md:gap-4">
                  <div className="md:col-span-4">
                    <div className="text-sm font-semibold text-slate-900">
                      {monthNames[report.month - 1]} {report.year}
                    </div>
                    <div className="text-xs text-slate-500 md:hidden">Updated {formatUpdated(report)}</div>
                  </div>
                  <div className="text-sm text-slate-700 md:col-span-3 md:text-right">
                    <span className="mr-2 text-xs font-semibold uppercase text-slate-400 md:hidden">Revenue</span>
                    {formatCurrency(report.revenue)}
                  </div>
                  <div className="text-sm text-slate-700 md:col-span-2 md:text-right">
                    <span className="mr-2 text-xs font-semibold uppercase text-slate-400 md:hidden">Rating</span>
                    {report.rating.toFixed(2)}
                  </div>
                  <div className="hidden text-sm text-slate-500 md:col-span-2 md:block md:text-right">
                    {formatUpdated(report)}
                  </div>
                  <div className="md:col-span-1 md:text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(report)}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 md:px-2"
                      aria-label={`Edit ${monthNames[report.month - 1]} ${report.year} report`}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="md:hidden">Edit</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {modalOpen && (
        <ModalShell
          title={selectedReport ? "Edit monthly report" : "Submit monthly report"}
          onClose={() => setModalOpen(false)}
        >
          <form className="space-y-4" onSubmit={saveReport}>
            <FormErrorSummary messages={apiErrors} />

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Month</span>
              <input
                type="month"
                value={form.monthValue}
                onChange={(event) => handleMonthChange(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Revenue</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.revenue}
                onChange={(event) => setForm((prev) => ({ ...prev, revenue: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Rating</span>
              <input
                type="number"
                min="0"
                max="5"
                step="0.01"
                value={form.rating}
                onChange={(event) => setForm((prev) => ({ ...prev, rating: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </label>

            {selectedReport && (
              <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-700">
                A report already exists for this month, so saving will update it.
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : selectedReport ? "Save report" : "Submit report"}
              </button>
            </div>
          </form>
        </ModalShell>
      )}
    </section>
  );
};

export default MonthlyReportsSection;
