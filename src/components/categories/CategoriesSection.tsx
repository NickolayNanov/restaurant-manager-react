/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useMemo, useRef, useState } from "react";
import CategoryModal from "./CategoryModal";
import { classNames } from "../helper";
import IconDots from "./IconDots";
import IconPlus from "./IconPlus";
import IconSearch from "./IconSearch";
import { apiFetch } from "../../api/apiFetch";
import type { Category, ListAllCategoriesApiResponse } from "../../types/categories-types";

const CategoriesSection: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState<"order" | "name" | "items">("order");

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);

    const fetchCategoriesData = async () => {
        const categoriesData: ListAllCategoriesApiResponse = await apiFetch("api/categories", {
            method: "GET"
        })

        if (categoriesData) {
            setCategories(categoriesData.categories);
        }
    };

    const didInit = useRef(false);

    useEffect(() => {
        if (didInit.current) return;
        didInit.current = true;

        void fetchCategoriesData();
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();

        let list = categories.filter((c) => {
            if (!q) return true;
            return (
                c.name.toLowerCase().includes(q) ||
                (c.name ?? "").toLowerCase().includes(q)
            );
        });

        if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        if (sort === "items") list = [...list].sort((a, b) => b.menuItemsCount - a.menuItemsCount);

        // sort === "order" => keep current array order
        return list;
    }, [categories, query, sort]);

    const openCreate = () => {
        setEditing(null);
        setModalOpen(true);
    };

    const openEdit = (category: Category) => {
        setEditing(category);
        setModalOpen(true);
    };

    const toggleVisible = async (category: Category) => {
        await apiFetch('api/categories', {
            method: "PUT",
            body: JSON.stringify({
                id: category.id,
                name: category.name,
                isActive: !category.isActive
            })
        });

        setCategories((prev) =>
            prev.map((c) => (c.id === category.id ? { ...c, isActive: !c.isActive } : c))
        );
    };

    const deleteCategory = async (id: string) => {
        await apiFetch(`api/categories/${id}`, {
            method: "DELETE"
        });

        setCategories((prev) => prev.filter((c) => c.id !== id));
    };

    const saveCategory = async (payload: { name: string; isActive: boolean }) => {
        if (editing) {
            await apiFetch('api/categories', {
                method: "PUT",
                body: JSON.stringify({
                    id: editing.id,
                    ...payload
                })
            });
        } else {
            await apiFetch('api/categories', {
                method: "POST",
                body: JSON.stringify({
                    ...payload
                })
            });
        }

        await fetchCategoriesData();
        setModalOpen(false);
        setEditing(null);
    };

    return (
        <section className="mt-6 rounded-xl border border-slate-200 bg-white">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">Categories</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Create and organize categories used to group menu items across your menus.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={openCreate}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <IconPlus className="h-4 w-4" />
                        Add Category
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="px-6 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-md">
                        <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search categories..."
                            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm text-slate-500">Sort</label>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value as "order" | "name" | "items")}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="order">Custom order</option>
                            <option value="name">Name</option>
                            <option value="items">Items count</option>
                        </select>
                    </div>
                </div>

                {/* Info callout */}
                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    Tip: If you hide a category, it won’t appear in menu item grouping, but existing items keep their category.
                </div>
            </div>

            {/* List */}
            <div className="px-6 pb-6">
                <div className="overflow-hidden rounded-xl border border-slate-200">
                    {/* Table header */}
                    <div className="hidden grid-cols-12 gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid">
                        <div className="col-span-5">Category</div>
                        <div className="col-span-2">Items</div>
                        <div className="col-span-2 text-right">Visibility</div>
                        <div className="col-span-3 text-right">Actions</div>
                    </div>

                    {/* Rows */}
                    {filtered.length === 0 ? (
                        <div className="px-6 py-10 text-center">
                            <div className="mx-auto max-w-sm">
                                <div className="text-sm font-semibold text-slate-900">No categories found</div>
                                <div className="mt-1 text-sm text-slate-500">
                                    Try a different search, or create your first category.
                                </div>
                                <button
                                    type="button"
                                    onClick={openCreate}
                                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                                >
                                    <IconPlus className="h-4 w-4" />
                                    Add Category
                                </button>
                            </div>
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-200">
                            {filtered.map((c) => (
                                <li key={c.id} className="group bg-white px-4 py-4 hover:bg-slate-50">
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-center sm:gap-4">
                                        {/* Category cell */}
                                        <div className="sm:col-span-5">
                                            <div className="flex items-start gap-3">
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <div className="truncate text-sm font-semibold text-slate-900">
                                                            {c.name}
                                                        </div>
                                                        {!c.isActive && (
                                                            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-600">
                                                                Hidden
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Items */}
                                        <div className="sm:col-span-2">
                                            <div className="text-sm font-medium text-slate-900">{c.menuItemsCount}</div>
                                            <div className="text-xs text-slate-500">menu items</div>
                                        </div>

                                        {/* Visibility */}
                                        <div className="sm:col-span-2 sm:text-right">
                                            <button
                                                type="button"
                                                onClick={() => toggleVisible(c)}
                                                className={classNames(
                                                    "inline-flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm font-medium transition sm:w-auto sm:min-w-[140px]",
                                                    c.isActive
                                                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                                )}
                                            >
                                                {c.isActive ? "Visible" : "Hidden"}
                                                <span
                                                    className={classNames(
                                                        "ml-3 inline-flex h-5 w-9 items-center rounded-full p-0.5 transition",
                                                        c.isActive ? "bg-emerald-600" : "bg-slate-300"
                                                    )}
                                                    aria-hidden="true"
                                                >
                                                    <span
                                                        className={classNames(
                                                            "h-4 w-4 rounded-full bg-white transition",
                                                            c.isActive ? "translate-x-4" : "translate-x-0"
                                                        )}
                                                    />
                                                </span>
                                            </button>
                                        </div>

                                        {/* Actions */}
                                        <div className="sm:col-span-3 sm:text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openEdit(c)}
                                                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => deleteCategory(c.id)}
                                                    className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                                >
                                                    Delete
                                                </button>

                                                <button
                                                    type="button"
                                                    className="hidden rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 group-hover:inline-flex"
                                                    title="More"
                                                >
                                                    <IconDots className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile helper row */}
                                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:hidden">
                                        <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5">
                                            Items: {c.menuItemsCount}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Modal (Create/Edit) */}
            {modalOpen && (
                <CategoryModal
                    title={editing ? "Edit Category" : "Create Category"}
                    initial={{
                        name: editing?.name ?? "",
                        isActive: editing?.isActive ?? true,
                    }}
                    onClose={() => {
                        setModalOpen(false);
                        setEditing(null);
                    }}
                    onSave={saveCategory}
                />
            )}
        </section>
    );
};



export default CategoriesSection;