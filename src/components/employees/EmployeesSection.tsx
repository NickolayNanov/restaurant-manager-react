import React, { useMemo, useState } from "react";

type EmploymentStatus = "Active" | "OnLeave" | "Paused" | "Inactive";
type EmploymentType = "FullTime" | "PartTime" | "Contract";
type SalaryType = "Monthly" | "Hourly";

type Employee = {
    id: string;
    fullName: string;
    email?: string;
    phone?: string;

    role: string; // Manager, Chef, Waiter...
    department?: string; // Kitchen, Service, Bar...
    employmentType: EmploymentType;

    status: EmploymentStatus;

    salaryAmount: number;
    salaryType: SalaryType;
    currency: string; // BGN, EUR...

    startDate?: string; // ISO date string
    updatedAtLabel: string; // "2 days ago" for UI
};

const sampleEmployees: Employee[] = [
    {
        id: "e1",
        fullName: "Mila Petrova",
        email: "mila.petrova@email.com",
        phone: "+359 88 123 4567",
        role: "Manager",
        department: "Front of House",
        employmentType: "FullTime",
        status: "Active",
        salaryAmount: 3200,
        salaryType: "Monthly",
        currency: "BGN",
        startDate: "2024-09-01",
        updatedAtLabel: "2 days ago",
    },
    {
        id: "e2",
        fullName: "Georgi Stoyanov",
        email: "georgi.stoyanov@email.com",
        phone: "+359 87 222 1100",
        role: "Chef",
        department: "Kitchen",
        employmentType: "FullTime",
        status: "OnLeave",
        salaryAmount: 2800,
        salaryType: "Monthly",
        currency: "BGN",
        startDate: "2023-03-15",
        updatedAtLabel: "1 week ago",
    },
    {
        id: "e3",
        fullName: "Ivan Dimitrov",
        email: "ivan.dimitrov@email.com",
        phone: "+359 88 999 2040",
        role: "Waiter",
        department: "Service",
        employmentType: "PartTime",
        status: "Paused",
        salaryAmount: 18,
        salaryType: "Hourly",
        currency: "BGN",
        startDate: "2025-06-10",
        updatedAtLabel: "3 weeks ago",
    },
];

function classNames(...xs: Array<string | false | undefined>) {
    return xs.filter(Boolean).join(" ");
}

function IconPlus(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
            <path d="M10 4.5a.75.75 0 0 1 .75.75v4h4a.75.75 0 0 1 0 1.5h-4v4a.75.75 0 0 1-1.5 0v-4h-4a.75.75 0 0 1 0-1.5h4v-4A.75.75 0 0 1 10 4.5Z" />
        </svg>
    );
}

function IconSearch(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
            <path
                fillRule="evenodd"
                d="M8.5 3.5a5 5 0 1 0 2.98 9.02l3.25 3.25a.75.75 0 1 0 1.06-1.06l-3.25-3.25A5 5 0 0 0 8.5 3.5Zm-3.5 5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0Z"
                clipRule="evenodd"
            />
        </svg>
    );
}

function formatSalary(e: Employee) {
    // Keep it simple for UI; change to Intl.NumberFormat when you wire real currency rules
    const num = e.salaryAmount.toLocaleString(undefined, { maximumFractionDigits: 2 });
    return e.salaryType === "Hourly" ? `${num} ${e.currency}/hr` : `${num} ${e.currency}`;
}

function statusBadge(status: EmploymentStatus) {
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
}

type EmployeeDraft = {
    fullName: string;
    email: string;
    phone: string;
    role: string;
    department: string;
    employmentType: EmploymentType;
    status: EmploymentStatus;
    salaryAmount: string; // keep as string in input
    salaryType: SalaryType;
    currency: string;
    startDate: string;
};

const defaultDraft: EmployeeDraft = {
    fullName: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    employmentType: "FullTime",
    status: "Active",
    salaryAmount: "",
    salaryType: "Monthly",
    currency: "BGN",
    startDate: "",
};

export const EmployeesSection: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>(sampleEmployees);

    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<EmploymentStatus | "All">("All");
    const [roleFilter, setRoleFilter] = useState<string>("All");
    const [sort, setSort] = useState<"Name" | "SalaryHigh" | "Updated">("Name");

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Employee | null>(null);

    const roles = useMemo(() => {
        const distinct = Array.from(new Set(employees.map((e) => e.role))).sort((a, b) =>
            a.localeCompare(b)
        );
        return ["All", ...distinct];
    }, [employees]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();

        let list = employees.filter((e) => {
            const matchesQ =
                !q ||
                e.fullName.toLowerCase().includes(q) ||
                (e.email ?? "").toLowerCase().includes(q) ||
                (e.phone ?? "").toLowerCase().includes(q) ||
                e.role.toLowerCase().includes(q) ||
                (e.department ?? "").toLowerCase().includes(q);

            const matchesStatus = statusFilter === "All" ? true : e.status === statusFilter;
            const matchesRole = roleFilter === "All" ? true : e.role === roleFilter;

            return matchesQ && matchesStatus && matchesRole;
        });

        if (sort === "Name") list = [...list].sort((a, b) => a.fullName.localeCompare(b.fullName));
        if (sort === "SalaryHigh")
            list = [...list].sort((a, b) => b.salaryAmount - a.salaryAmount);
        if (sort === "Updated") {
            // We only have label for now; keep current order (or replace with real date when you add it)
            list = [...list];
        }

        return list;
    }, [employees, query, statusFilter, roleFilter, sort]);

    const openCreate = () => {
        setEditing(null);
        setModalOpen(true);
    };

    const openEdit = (emp: Employee) => {
        setEditing(emp);
        setModalOpen(true);
    };

    const removeEmployee = (id: string) => {
        setEmployees((prev) => prev.filter((e) => e.id !== id));
    };

    const saveEmployee = (draft: EmployeeDraft) => {
        const salary = Number(draft.salaryAmount);
        if (!draft.fullName.trim() || !draft.role.trim() || Number.isNaN(salary)) return;

        const payload: Omit<Employee, "id"> = {
            fullName: draft.fullName.trim(),
            email: draft.email.trim() || undefined,
            phone: draft.phone.trim() || undefined,
            role: draft.role.trim(),
            department: draft.department.trim() || undefined,
            employmentType: draft.employmentType,
            status: draft.status,
            salaryAmount: salary,
            salaryType: draft.salaryType,
            currency: draft.currency.trim() || "BGN",
            startDate: draft.startDate || undefined,
            updatedAtLabel: "just now",
        };

        if (editing) {
            setEmployees((prev) =>
                prev.map((e) => (e.id === editing.id ? { ...e, ...payload } : e))
            );
        } else {
            setEmployees((prev) => [{ id: crypto.randomUUID(), ...payload }, ...prev]);
        }

        setModalOpen(false);
        setEditing(null);
    };

    return (
        <section className="mt-6 rounded-xl border border-slate-200 bg-white">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">Employees</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage staff profiles, roles, salaries and access to the admin panel.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        onClick={() => {
                            // optional: wire to "Invite employee" flow later
                            openCreate();
                        }}
                    >
                        Invite
                    </button>

                    <button
                        type="button"
                        onClick={openCreate}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <IconPlus className="h-4 w-4" />
                        Add Employee
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="px-6 py-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative w-full lg:max-w-md">
                        <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search employees..."
                            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-slate-500">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="All">All</option>
                                <option value="Active">Active</option>
                                <option value="OnLeave">On leave</option>
                                <option value="Paused">Paused</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm text-slate-500">Role</label>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            >
                                {roles.map((r) => (
                                    <option key={r} value={r}>
                                        {r}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm text-slate-500">Sort</label>
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value as any)}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="Name">Name</option>
                                <option value="SalaryHigh">Salary (high → low)</option>
                                <option value="Updated">Updated</option>
                            </select>
                        </div>

                        <button
                            type="button"
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            onClick={() => {
                                // optional: export CSV later
                                // For now, quick demo:
                                console.log("Export:", employees);
                            }}
                        >
                            Export
                        </button>
                    </div>
                </div>

                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    Salary is stored per employee (monthly or hourly). Use roles + status filters to manage large teams.
                </div>
            </div>

            {/* Table */}
            <div className="px-6 pb-6">
                <div className="overflow-hidden rounded-xl border border-slate-200">
                    {/* Table header (desktop) */}
                    <div className="hidden grid-cols-12 gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid">
                        <div className="col-span-4">Employee</div>
                        <div className="col-span-2">Role</div>
                        <div className="col-span-2">Salary</div>
                        <div className="col-span-1">Status</div>
                        <div className="col-span-2">Phone</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="px-6 py-10 text-center">
                            <div className="mx-auto max-w-sm">
                                <div className="text-sm font-semibold text-slate-900">No employees found</div>
                                <div className="mt-1 text-sm text-slate-500">
                                    Try a different search/filter, or add your first employee.
                                </div>
                                <button
                                    type="button"
                                    onClick={openCreate}
                                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                                >
                                    <IconPlus className="h-4 w-4" />
                                    Add Employee
                                </button>
                            </div>
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-200">
                            {filtered.map((e) => (
                                <li key={e.id} className="bg-white px-4 py-4 hover:bg-slate-50">
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-center sm:gap-4">
                                        {/* Employee */}
                                        <div className="sm:col-span-4">
                                            <div className="flex items-start gap-3">
                                                <div className="mt-0.5 h-10 w-10 rounded-full bg-slate-200" />
                                                <div className="min-w-0">
                                                    <div className="truncate text-sm font-semibold text-slate-900">
                                                        {e.fullName}
                                                    </div>
                                                    <div className="mt-0.5 flex flex-wrap gap-2 text-sm text-slate-500">
                                                        {e.email ? <span className="truncate">{e.email}</span> : <span>No email</span>}
                                                        <span className="text-slate-300">•</span>
                                                        <span className="truncate">
                                                            {e.department ?? "No department"}{" "}
                                                            <span className="text-slate-300">•</span>{" "}
                                                            {e.employmentType === "FullTime"
                                                                ? "Full-time"
                                                                : e.employmentType === "PartTime"
                                                                    ? "Part-time"
                                                                    : "Contract"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Role */}
                                        <div className="sm:col-span-2">
                                            <div className="text-sm font-medium text-slate-900">{e.role}</div>
                                            <div className="text-xs text-slate-500">Updated {e.updatedAtLabel}</div>
                                        </div>

                                        {/* Salary */}
                                        <div className="sm:col-span-2">
                                            <div className="text-sm font-semibold text-slate-900">{formatSalary(e)}</div>
                                            <div className="text-xs text-slate-500">{e.salaryType === "Hourly" ? "Hourly rate" : "Monthly salary"}</div>
                                        </div>

                                        {/* Status */}
                                        <div className="sm:col-span-1">
                                            <span
                                                className={classNames(
                                                    "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold",
                                                    statusBadge(e.status)
                                                )}
                                            >
                                                {e.status === "OnLeave" ? "On leave" : e.status}
                                            </span>
                                        </div>

                                        {/* Phone */}
                                        <div className="sm:col-span-2">
                                            <div className="text-sm text-slate-700">{e.phone ?? "—"}</div>
                                        </div>

                                        {/* Actions */}
                                        <div className="sm:col-span-1 sm:text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openEdit(e)}
                                                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeEmployee(e.id)}
                                                    className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile chips */}
                                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:hidden">
                                        <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5">
                                            Role: {e.role}
                                        </span>
                                        <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5">
                                            Salary: {formatSalary(e)}
                                        </span>
                                        <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5">
                                            Status: {e.status === "OnLeave" ? "On leave" : e.status}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Create/Edit Modal */}
            {modalOpen && (
                <EmployeeModal
                    title={editing ? "Edit Employee" : "Add Employee"}
                    initial={employeeToDraft(editing)}
                    onClose={() => {
                        setModalOpen(false);
                        setEditing(null);
                    }}
                    onSave={saveEmployee}
                />
            )}
        </section>
    );
};

function employeeToDraft(e: Employee | null): EmployeeDraft {
    if (!e) return { ...defaultDraft };

    return {
        fullName: e.fullName ?? "",
        email: e.email ?? "",
        phone: e.phone ?? "",
        role: e.role ?? "",
        department: e.department ?? "",
        employmentType: e.employmentType ?? "FullTime",
        status: e.status ?? "Active",
        salaryAmount: String(e.salaryAmount ?? ""),
        salaryType: e.salaryType ?? "Monthly",
        currency: e.currency ?? "BGN",
        startDate: e.startDate ?? "",
    };
}

const EmployeeModal: React.FC<{
    title: string;
    initial: EmployeeDraft;
    onClose: () => void;
    onSave: (draft: EmployeeDraft) => void;
}> = ({ title, initial, onClose, onSave }) => {
    const [d, setD] = useState<EmployeeDraft>(initial);

    const salaryIsValid = d.salaryAmount.trim() !== "" && !Number.isNaN(Number(d.salaryAmount));
    const canSave = d.fullName.trim() && d.role.trim() && salaryIsValid;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} aria-hidden="true" />

            <div className="relative w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-xl">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Store core profile details and payroll info (salary is required).
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Close
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 px-5 py-4 md:grid-cols-2">
                    <Field label="Full name" required>
                        <input
                            value={d.fullName}
                            onChange={(e) => setD((p) => ({ ...p, fullName: e.target.value }))}
                            placeholder="e.g. Mila Petrova"
                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                    </Field>

                    <Field label="Role" required>
                        <input
                            value={d.role}
                            onChange={(e) => setD((p) => ({ ...p, role: e.target.value }))}
                            placeholder="e.g. Manager"
                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                    </Field>

                    <Field label="Email">
                        <input
                            value={d.email}
                            onChange={(e) => setD((p) => ({ ...p, email: e.target.value }))}
                            placeholder="e.g. mila@email.com"
                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                    </Field>

                    <Field label="Phone">
                        <input
                            value={d.phone}
                            onChange={(e) => setD((p) => ({ ...p, phone: e.target.value }))}
                            placeholder="e.g. +359 88 123 4567"
                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                    </Field>

                    <Field label="Department">
                        <input
                            value={d.department}
                            onChange={(e) => setD((p) => ({ ...p, department: e.target.value }))}
                            placeholder="e.g. Kitchen"
                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                    </Field>

                    <Field label="Employment type">
                        <select
                            value={d.employmentType}
                            onChange={(e) => setD((p) => ({ ...p, employmentType: e.target.value as EmploymentType }))}
                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="FullTime">Full-time</option>
                            <option value="PartTime">Part-time</option>
                            <option value="Contract">Contract</option>
                        </select>
                    </Field>

                    <Field label="Status">
                        <select
                            value={d.status}
                            onChange={(e) => setD((p) => ({ ...p, status: e.target.value as EmploymentStatus }))}
                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="Active">Active</option>
                            <option value="OnLeave">On leave</option>
                            <option value="Paused">Paused</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </Field>

                    <Field label="Salary" required hint="Monthly or hourly. Required.">
                        <div className="mt-1 grid grid-cols-12 gap-2">
                            <input
                                value={d.salaryAmount}
                                onChange={(e) => setD((p) => ({ ...p, salaryAmount: e.target.value }))}
                                placeholder={d.salaryType === "Hourly" ? "e.g. 18" : "e.g. 2800"}
                                inputMode="decimal"
                                className={classNames(
                                    "col-span-6 rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2",
                                    salaryIsValid
                                        ? "border-slate-200 focus:border-blue-300 focus:ring-blue-100"
                                        : "border-red-200 focus:border-red-300 focus:ring-red-100"
                                )}
                            />
                            <select
                                value={d.salaryType}
                                onChange={(e) => setD((p) => ({ ...p, salaryType: e.target.value as SalaryType }))}
                                className="col-span-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="Monthly">Monthly</option>
                                <option value="Hourly">Hourly</option>
                            </select>
                            <input
                                value={d.currency}
                                onChange={(e) => setD((p) => ({ ...p, currency: e.target.value }))}
                                placeholder="BGN"
                                className="col-span-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                        {!salaryIsValid && (
                            <div className="mt-1 text-xs text-red-600">Please enter a valid salary amount.</div>
                        )}
                    </Field>

                    <Field label="Start date">
                        <input
                            type="date"
                            value={d.startDate}
                            onChange={(e) => setD((p) => ({ ...p, startDate: e.target.value }))}
                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                    </Field>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={!canSave}
                        onClick={() => onSave(d)}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

const Field: React.FC<{
    label: string;
    required?: boolean;
    hint?: string;
    children: React.ReactNode;
}> = ({ label, required, hint, children }) => {
    return (
        <div>
            <div className="flex items-baseline justify-between">
                <label className="text-sm font-medium text-slate-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                {hint && <span className="text-xs text-slate-500">{hint}</span>}
            </div>
            {children}
        </div>
    );
};

export default EmployeesSection;