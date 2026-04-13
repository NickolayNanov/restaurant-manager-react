import type { Employee, EmploymentStatus } from "../types/employees-types";

export const cx = (...v: Array<string | false | undefined>) => v.filter(Boolean).join(" ");

export const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export const normalizeCategory = (category: string) => {
  const c = (category ?? "").trim();
  return c.length ? c : "Uncategorized";
};

export const classNames = (...v: Array<string | undefined | false>) => {
  return v.filter(Boolean).join(" ");
}

export const statusBadge = (status: EmploymentStatus) => {
    switch (status) {
        case "Active":
            return "border-emerald-200 bg-emerald-50 text-emerald-700";
        case "OnLeave":
            return "border-blue-200 bg-blue-50 text-blue-700";
        case "Paused":
            return "border-amber-200 bg-amber-50 text-amber-800";
        case "Inactive":
            return "border-slate-200 bg-white text-slate-700";
    }
};

export const formatSalary = (e: Employee) => {
    return e.salary.toLocaleString(undefined, { maximumFractionDigits: 2 });
};