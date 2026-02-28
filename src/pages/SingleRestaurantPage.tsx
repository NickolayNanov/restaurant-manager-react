/* eslint-disable react-hooks/set-state-in-effect */
import { Pencil, Trash2, RefreshCw, MapPin, UtensilsCrossed, Plus, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../api/apiFetch";
import type { RestaurantFormValues, RestaurantWithMenu, SingleRestaurantApiResponse } from "../types/restaurants";
import type { Menu, MenuForm } from "../types/menu-types";
import ModalShell from "../components/modals/ModalShell";
import DeleteRestaurantModal from "../components/restaurants/DeleteRestaurantModal";
import EditRestaurantModal from "../components/restaurants/EditRestaurantModal";
import MenuEditForm from "../components/menus/MenuEditForm";
import StatusPill from "../components/shared/StatusPill";
import CategoriesSection from "../components/categories/CategoriesSection";
import EmployeesSection from "../components/employees/EmployeesSection";

const cx = (...v: Array<string | false | undefined>) => v.filter(Boolean).join(" ");

const SingleRestaurantPage = () => {
    const { restaurantId } = useParams();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState<RestaurantWithMenu | null>(null);

    const [editTarget, setEditTarget] = useState<RestaurantWithMenu | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<RestaurantWithMenu | null>(null);

    const [createMenuModalVisible, setCreateMenuModalVisible] = useState<boolean>(false);

    const didInit = useRef(false);

    const fetchRestaurant = async () => {
        const restaurantData: SingleRestaurantApiResponse = await apiFetch(`api/restaurants/${restaurantId}`, {
            method: "GET"
        });

        if (restaurantData) {
            setRestaurant(restaurantData);
        }
    }

    useEffect(() => {
        if (didInit.current) return;
        didInit.current = true;

        void fetchRestaurant();
    }, []);

    const activeMenu = useMemo(() => {
        if (!restaurant) return null;
        return restaurant.menus.find((m) => m.isActive) ?? restaurant.menus[0] ?? null;
    }, [restaurant]);

    const [selectedMenuId, setSelectedMenuId] = useState<string | null>(activeMenu?.id ?? null);

    const selectedMenu = useMemo(() => {
        if (!restaurant) return null;
        return restaurant.menus.find((m) => m.id === (selectedMenuId ?? activeMenu?.id)) ?? activeMenu ?? null;
    }, [restaurant, selectedMenuId, activeMenu]);

    const setActiveMenu = (menuId: string) => {
        if (!restaurant) return;
        setRestaurant({
            ...restaurant,
            menus: restaurant.menus.map((m) => ({ ...m, isActive: m.id === menuId })),
        });
        setSelectedMenuId(menuId);
    };

    const updateRestaurant = async (id: string, formData: RestaurantFormValues) => {
        await apiFetch("api/restaurants", {
            method: "PUT",
            body: JSON.stringify({ id, ...formData })
        });

        await fetchRestaurant();
        setEditTarget(null);
    }

    const deleteRestaurant = async (id: string) => {
        await apiFetch(`api/restaurants/${id}`, {
            method: "DELETE"
        });

        navigate("/manage-restaurants");
    }

    const addMenu = async (formData: MenuForm) => {
        const menu: Menu = await apiFetch("api/menus", {
            method: "POST",
            body: JSON.stringify(formData)
        });
        if (menu && restaurant) {
            const newData: RestaurantWithMenu = {
                ...restaurant,
                menus: [...restaurant!.menus, menu]
            };

            setRestaurant(newData);
            setSelectedMenuId(menu.id);
            setCreateMenuModalVisible(false);
        }
    };

    if (!restaurant) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-sm text-slate-700">Restaurant not found.</div>
                <Link
                    to="/manage-restaurants"
                    className="mt-3 inline-flex rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                    Back to Restaurants
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Page header */}
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">{restaurant.name}</h2>

                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                        <Link to="/manage-restaurants" className="hover:text-slate-900">
                            Restaurants
                        </Link>
                        <span className="text-slate-400">/</span>
                        <span className="text-slate-700">{restaurant.name}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setEditTarget(restaurant)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        <Pencil className="h-4 w-4" />
                        Edit
                    </button>

                    <button
                        onClick={() => setDeleteTarget(restaurant)}
                        className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </button>

                    <button
                        onClick={fetchRestaurant}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        title="Refresh dummy data"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Restaurant info card */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-800">
                            <img src={restaurant.imgUrl} alt={restaurant.name} className="h-full w-full object-cover" />
                        </div>

                        <div>
                            <div className="text-lg font-semibold text-slate-900">{restaurant.name}</div>

                            <div className="mt-1 inline-flex items-center gap-2 text-sm text-slate-600">
                                <MapPin className="h-4 w-4 text-slate-400" />
                                {restaurant.location}
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <StatusPill status={restaurant.status} />

                                <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
                                    <UtensilsCrossed className="h-3.5 w-3.5 text-slate-400" />
                                    {restaurant.cuisine}
                                </span>

                                {activeMenu && (
                                    <span className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                        Active menu: {activeMenu.name}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="text-xs text-slate-500">
                        Restaurant ID: <span className="font-semibold text-slate-700">{restaurant.id}</span>
                    </div>
                </div>

                {restaurant.description && (
                    <div className="mt-4 border-t border-slate-200 pt-4 text-sm text-slate-700">{restaurant.description}</div>
                )}
            </section>

            {/* Menus */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900">Menus</h3>
                        <p className="mt-1 text-sm text-slate-600">
                            Switch between and edit the different menus offered by your restaurant.
                        </p>
                    </div>

                    <button
                        onClick={() => setCreateMenuModalVisible(true)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        <Plus className="h-4 w-4" />
                        Add Menu
                    </button>
                </div>

                {/* Tabs row */}
                <div className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                        {restaurant.menus.map((m) => {
                            const isSelected = (selectedMenuId ?? activeMenu?.id) === m.id;
                            const isActive = m.isActive;

                            return (
                                <button
                                    key={m.id}
                                    onClick={() => setSelectedMenuId(m.id)}
                                    className={cx(
                                        "relative rounded-lg border px-4 py-2 text-sm font-semibold transition",
                                        isSelected
                                            ? "border-blue-600 bg-blue-600 text-white"
                                            : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                                    )}
                                    title={isActive ? "Active menu" : "Not active"}
                                >
                                    {m.name}
                                    {isActive && (
                                        <span className={cx("absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full", isSelected ? "bg-white" : "bg-emerald-500")} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Selected menu card */}
                {selectedMenu && (
                    <div className="px-5 pb-5">
                        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-800">
                                    <img src={selectedMenu.imgUrl} alt={selectedMenu.name} className="h-full w-full object-cover" />
                                </div>

                                <div>
                                    <div className="text-base font-semibold text-slate-900">{selectedMenu.name}</div>
                                    <div className="mt-1 text-sm text-slate-600">
                                        {selectedMenu.description ?? "No description provided."}
                                    </div>

                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                        {selectedMenu.isActive ? (
                                            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                                Active
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => setActiveMenu(selectedMenu.id)}
                                                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                            >
                                                Set as active
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => navigate(`menus/${selectedMenu.id}`)}
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                >
                                    Go to Menu
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <CategoriesSection />

            <EmployeesSection />

            {/* Edit modal */}
            {editTarget && (
                <EditRestaurantModal editTarget={editTarget} setEditTarget={setEditTarget} updateRestaurant={updateRestaurant} />
            )}
            {/* Delete modal */}
            {deleteTarget && (
                <DeleteRestaurantModal deleteTarget={deleteTarget} setDeleteTarget={setDeleteTarget} deleteRestaurant={deleteRestaurant} />
            )}
            {createMenuModalVisible && (
                <ModalShell title="Edit Menu" onClose={() => setCreateMenuModalVisible(false)}>
                    <MenuEditForm
                        initial={{
                            id: null,
                            name: "",
                            description: "",
                            imgUrl: "",
                            isActive: false,
                            type: "Default",
                            restaurantId: restaurantId as string
                        }}
                        onCancel={() => setCreateMenuModalVisible(false)}
                        onSubmit={addMenu}
                    />
                </ModalShell>
            )}
        </div>
    );
};

export default SingleRestaurantPage;