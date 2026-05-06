import React, { useEffect, useMemo, useState } from "react";
import type {
    Employee,
    EmployeeDraft,
    EmployeesSectionProps,
    EmploymentStatus,
    ListEmployeesByRestaurantResponse,
    CreateEmployeeRequest,
    UpdateEmployeeRequest
} from "../../types/employees-types";
import { classNames, formatSalary, statusBadge } from "../helper";
import EmployeeModal from "./EmployeeModals";
import { apiFetch } from "../../api/apiFetch";
import IconPlus from "../categories/IconPlus";
import IconSearch from "../categories/IconSearch";

const sampleEmployees: Employee[] = [
    {
        id: "e1",
        name: "Mila Petrova",
        email: "mila.petrova@email.com",
        phoneNumber: "+359 88 123 4567",
        position: "Manager",
        employmentType: "FullTime",
        status: "Active",
        salary: 3200,
        currency: "EUR",
        createdAt: "2024-09-01",
        updatedAt: "2 days ago",
    },
    {
        id: "e2",
        name: "Georgi Stoyanov",
        email: "georgi.stoyanov@email.com",
        phoneNumber: "+359 87 222 1100",
        position: "Chef",
        employmentType: "FullTime",
        status: "OnLeave",
        salary: 2800,
        currency: "EUR",
        createdAt: "2023-03-15",
        updatedAt: "1 week ago",
    },
    {
        id: "e3",
        name: "Ivan Dimitrov",
        email: "ivan.dimitrov@email.com",
        phoneNumber: "+359 88 999 2040",
        position: "Waiter",
        employmentType: "PartTime",
        status: "Paused",
        salary: 18,
        currency: "EUR",
        createdAt: "2025-06-10",
        updatedAt: "3 weeks ago",
    },
];

const defaultDraft: EmployeeDraft = {
    name: "",
    email: "",
    phoneNumber: "",
    position: "",
    employmentType: "FullTime",
    status: "Active",
    salary: '0',
    currency: "EUR",
    createdAt: "",
};

const EmployeesSection: React.FC<EmployeesSectionProps> = ({
    restaurantId,
}) => {
    const [employees, setEmployees] = useState<Employee[]>(sampleEmployees);

    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<EmploymentStatus | "All">("All");
    const [roleFilter, setRoleFilter] = useState<string>("All");
    const [sort, setSort] = useState<"Name" | "SalaryHigh" | "Updated">("Name");

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Employee | null>(null);

    const fetchEmployeesPerRestaurant = async () => {
        const employeesResponse: ListEmployeesByRestaurantResponse = await apiFetch(`api/employees/per-restaurant/${restaurantId}`, {
            method: "GET"
        });

        if (employeesResponse) {
            setEmployees(
                (employeesResponse?.employees ?? []).map((e): Employee => ({
                    ...e,
                    status: "Active",
                    currency: "EUR",
                    updatedAt: e.updatedAt
                        ? new Date(e.updatedAt).toLocaleDateString()
                        : "N/A",
                }))
            );
        }
    };

    useEffect(() => {
        const timer = window.setTimeout(() => {
            void fetchEmployeesPerRestaurant();
        }, 0);

        return () => window.clearTimeout(timer);
    }, []);

    const roles = useMemo(() => {
        const distinct = Array.from(new Set(employees.map((e) => e.position))).sort((a, b) =>
            a.localeCompare(b)
        );
        return ["All", ...distinct];
    }, [employees]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();

        let list = employees.filter((e) => {
            const matchesQ =
                !q ||
                e.name.toLowerCase().includes(q) ||
                (e.email ?? "").toLowerCase().includes(q) ||
                (e.phoneNumber ?? "").toLowerCase().includes(q) ||
                e.position.toLowerCase().includes(q);

            const matchesStatus = statusFilter === "All" ? true : e.status === statusFilter;
            const matchesRole = roleFilter === "All" ? true : e.position === roleFilter;

            return matchesQ && matchesStatus && matchesRole;
        });

        if (sort === "Name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        if (sort === "SalaryHigh")
            list = [...list].sort((a, b) => b.salary - a.salary);
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

    const removeEmployee = async (id: string) => {
        await apiFetch(`api/employees/${id}`, {
            method: "DELETE"
        });
        await fetchEmployeesPerRestaurant();
    };

    const saveEmployee = async (draft: EmployeeDraft) => {
        const salary = Number(draft.salary);
        if (!draft.name.trim() || !draft.position.trim() || Number.isNaN(salary)) return;

        if (editing) {
            await apiFetch('api/employees', {
                method: "PUT",
                body: JSON.stringify(draftToUpdateEmployeeRequest(draft, editing.id))
            });
        } else {
            await apiFetch('api/employees', {
                method: "POST",
                body: JSON.stringify(draftToCreateEmployeeRequest(draft, restaurantId))
            });
        }

        await fetchEmployeesPerRestaurant();
        setModalOpen(false);
        setEditing(null);
    };

    const draftToCreateEmployeeRequest = (draft: EmployeeDraft, restaurantId: string | null): CreateEmployeeRequest => ({
        name: draft.name.trim(),
        email: draft.email.trim(),
        phoneNumber: draft.phoneNumber.trim(),
        position: draft.position.trim(),
        employmentType: draft.employmentType,
        salary: Number(draft.salary),
        restaurantId,
    });

    const draftToUpdateEmployeeRequest = (draft: EmployeeDraft, id: string | null): UpdateEmployeeRequest => ({
        name: draft.name.trim(),
        email: draft.email.trim(),
        phoneNumber: draft.phoneNumber.trim(),
        position: draft.position.trim(),
        employmentType: draft.employmentType,
        salary: Number(draft.salary),
        id,
    });

    const employeeToDraft = (e: Employee | null): EmployeeDraft => {
        if (!e) return { ...defaultDraft };

        return {
            name: e.name ?? "",
            email: e.email ?? "",
            phoneNumber: e.phoneNumber ?? "",
            position: e.position ?? "",
            employmentType: e.employmentType ?? "FullTime",
            status: e.status ?? "Active",
            salary: String(e.salary ?? ""),
            currency: e.currency ?? "EUR",
            createdAt: e.createdAt ?? "",
        };
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
                                onChange={(e) => setStatusFilter(e.target.value as EmploymentStatus | "All")}
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
                                onChange={(e) => setSort(e.target.value as "Name" | "SalaryHigh" | "Updated")}
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
                                                        {e.name}
                                                    </div>
                                                    <div className="mt-0.5 flex flex-wrap gap-2 text-sm text-slate-500">
                                                        {e.email ? <span className="truncate">{e.email}</span> : <span>No email</span>}
                                                        <span className="text-slate-300">•</span>
                                                        <span className="truncate">
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

                                        {/* Position */}
                                        <div className="sm:col-span-2">
                                            <div className="text-sm font-medium text-slate-900">{e.position}</div>
                                            <div className="text-xs text-slate-500">Updated {e.updatedAt}</div>
                                        </div>

                                        {/* Salary */}
                                        <div className="sm:col-span-2">
                                            <div className="text-sm font-semibold text-slate-900">{formatSalary(e)}</div>
                                            <div className="text-xs text-slate-500">Monthly salary</div>
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
                                            <div className="text-sm text-slate-700">{e.phoneNumber ?? "—"}</div>
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
                                            Position: {e.position}
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

export default EmployeesSection;
