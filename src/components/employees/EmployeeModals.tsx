import { useEffect, useState } from "react";
import type { EmployeeDraft, EmploymentType, EmploymentStatus } from "../../types/employees-types";
import { classNames } from "../helper";
import { IMAGE_ACCEPT, validateImageFile } from "../imageUpload";

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

const EmployeeModal: React.FC<{
    title: string;
    initial: EmployeeDraft;
    onClose: () => void;
    onSave: (draft: EmployeeDraft) => void;
}> = ({ title, initial, onClose, onSave }) => {
    const [data, setData] = useState<EmployeeDraft>(initial);
    const [previewUrl, setPreviewUrl] = useState(initial.existingImgUrl ?? "");
    const [imageError, setImageError] = useState<string | null>(null);

    const salaryIsValid = data.salary.trim() !== "" && !Number.isNaN(Number(data.salary)) && Number(data.salary) >= 0;
    const imageIsValid = Boolean(data.imageFile || data.existingImgUrl) && !imageError;
    const canSave = data.name.trim()
        && data.position.trim()
        && data.email.trim()
        && data.phoneNumber.trim()
        && data.employmentType.trim()
        && salaryIsValid
        && imageIsValid;

    useEffect(() => {
        setData(initial);
        setPreviewUrl(initial.existingImgUrl ?? "");
        setImageError(null);
    }, [initial]);

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
                            value={data.name}
                            onChange={(e) => setData((p) => ({ ...p, name: e.target.value }))}
                            placeholder="e.g. Mila Petrova"
                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                    </Field>

                    <Field label="Role" required>
                        <input
                            value={data.position}
                            onChange={(e) => setData((p) => ({ ...p, position: e.target.value }))}
                            placeholder="e.g. Manager"
                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                    </Field>

                    <Field label="Email" required>
                        <input
                            value={data.email}
                            onChange={(e) => setData((p) => ({ ...p, email: e.target.value }))}
                            placeholder="e.g. mila@email.com"
                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                    </Field>

                    <Field label="Phone" required>
                        <input
                            value={data.phoneNumber}
                            onChange={(e) => setData((p) => ({ ...p, phoneNumber: e.target.value }))}
                            placeholder="e.g. +359 88 123 4567"
                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                    </Field>

                    <Field label="Employment type" required>
                        <select
                            value={data.employmentType}
                            onChange={(e) => setData((p) => ({ ...p, employmentType: e.target.value as EmploymentType }))}
                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="FullTime">Full-time</option>
                            <option value="PartTime">Part-time</option>
                            <option value="Contract">Contract</option>
                        </select>
                    </Field>

                    <Field label="Status">
                        <select
                            value={data.status}
                            onChange={(e) => setData((p) => ({ ...p, status: e.target.value as EmploymentStatus }))}
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
                                value={data.salary}
                                onChange={(e) => setData((p) => ({ ...p, salary: e.target.value }))}
                                placeholder={"e.g. 2800"}
                                inputMode="decimal"
                                className={classNames(
                                    "col-span-6 rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2",
                                    salaryIsValid
                                        ? "border-slate-200 focus:border-blue-300 focus:ring-blue-100"
                                        : "border-red-200 focus:border-red-300 focus:ring-red-100"
                                )}
                            />
                            <select
                                value={"Monthly"}
                                disabled
                                className="col-span-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="Monthly">Monthly</option>
                            </select>
                            <input
                                value={data.currency}
                                placeholder="EUR"
                                disabled
                                className="col-span-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                        {!salaryIsValid && (
                            <div className="mt-1 text-xs text-red-600">Please enter a valid salary amount.</div>
                        )}
                    </Field>

                    <div className="md:col-span-2">
                        <Field label="Profile image" required>
                            <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="h-20 w-20 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt={data.name || "Employee"} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full bg-slate-200" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept={IMAGE_ACCEPT}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] ?? null;
                                            const nextImageError = validateImageFile(file);

                                            setImageError(nextImageError);
                                            setData((p) => ({ ...p, imageFile: file }));
                                            setPreviewUrl(file ? URL.createObjectURL(file) : data.existingImgUrl ?? "");
                                        }}
                                        className={classNames(
                                            "w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200 focus:outline-none focus:ring-2",
                                            imageError ? "border-red-200 focus:border-red-300 focus:ring-red-100" : "border-slate-200 focus:border-blue-300 focus:ring-blue-100"
                                        )}
                                    />
                                    {imageError && <div className="mt-1 text-xs text-red-600">{imageError}</div>}
                                    {!data.imageFile && !data.existingImgUrl && (
                                        <div className="mt-1 text-xs text-red-600">Please select an employee image.</div>
                                    )}
                                </div>
                            </div>
                        </Field>
                    </div>
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
                        onClick={() => onSave(data)}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeModal;
