import { useState } from "react";
import { classNames } from "../helper";

const CategoryModal: React.FC<{
    title: string;
    initial: { name: string; isActive: boolean };
    onClose: () => void;
    onSave: (payload: { name: string; isActive: boolean }) => void;
}> = ({ title, initial, onClose, onSave }) => {
    const [name, setName] = useState(initial.name);
    const [isActive, setIsVisible] = useState(initial.isActive);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Dialog */}
            <div className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Categories are used to group menu items in the menu view.
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

                <div className="space-y-4 px-5 py-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700">Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Starters"
                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-3">
                        <div>
                            <div className="text-sm font-medium text-slate-900">Visible</div>
                            <div className="text-sm text-slate-500">Show this category in menu grouping.</div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsVisible((v) => !v)}
                            className={classNames(
                                "inline-flex items-center rounded-lg border px-3 py-2 text-sm font-medium transition",
                                isActive
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                            )}
                        >
                            {isActive ? "Visible" : "Hidden"}
                        </button>
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
                        disabled={!name.trim()}
                        onClick={() => onSave({ name: name.trim(), isActive })}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryModal;