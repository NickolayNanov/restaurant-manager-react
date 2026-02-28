/* eslint-disable react-hooks/immutability */
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  RefreshCw,
  Trash2,
} from "lucide-react";
import type { MenuItem } from "../types/menu-item-types";
import type { MenuWithItems } from "../types/menu-types";
import ModalShell from "../components/modals/ModalShell";
import MenuItemForm from "../components/menu-items/MenuItemForm";
import MenuEditForm from "../components/menus/MenuEditForm";
import { apiFetch } from "../api/apiFetch";
import { type Category, type ListAllCategoriesApiResponse } from "../types/categories-types";
import MenuItemsSection from "../components/menu-items/MenuItemsSection";
import MenuInfoCard from "../components/menus/MenuInfoCard";
import type { SingleRestaurantApiResponse } from "../types/restaurants";

// ---------- forms ----------
export type MenuEditValues = Pick<MenuWithItems, "name" | "description" | "imgUrl" | "isActive" | "type">;
export type MenuItemFormValues = Pick<MenuItem, "name" | "price" | "imgUrl" | "isActive" | "category">;

const emptyItem: MenuItemFormValues = {
  name: "",
  price: 0,
  imgUrl: "",
  isActive: true,
  category: { name: "", id: "", isActive: false, menuItemsCount: 0 }
};

const initialEmpty: MenuWithItems = {
  id: "",
  name: "",
  description: "",
  imgUrl: "",
  isActive: false,
  type: "Default",
  restaurantId: "",
  items: []
};

const MenuEditorPage = () => {
  const { restaurantId = "r1", menuId = "m1" } = useParams();
  const navigate = useNavigate();

  const [menu, setMenu] = useState<MenuWithItems>(initialEmpty);
  const [restaurant, setRestaurant] = useState<SingleRestaurantApiResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>([])
  const [menuEditOpen, setMenuEditOpen] = useState(false);
  const [itemCreateOpen, setItemCreateOpen] = useState(false);
  const [itemEditTarget, setItemEditTarget] = useState<MenuItem | null>(null);
  const [itemDeleteTarget, setItemDeleteTarget] = useState<MenuItem | null>(null);
  const [menuDeleteOpen, setMenuDeleteOpen] = useState<boolean>(false);

  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    void fetchRestaurantData();
    void fetchMenuData();
    void fetchCategoriesData();
  }, []);

  const fetchMenuData = async () => {
    const menuData: MenuWithItems = await apiFetch(`api/menus/${menuId}`, {
      method: "GET"
    })

    if (menuData) {
      setMenu(menuData);
    }
  };

  const fetchRestaurantData = async () => {
    const restaurantData: SingleRestaurantApiResponse = await apiFetch(`api/restaurants/${restaurantId}`, {
      method: "GET"
    })

    if (restaurantData) {
      setRestaurant(restaurantData);
    }
  };

  const fetchMenuItems = async () => {
    const data = await apiFetch(`api/menu-items/by-menu/${menuId}`, {
      method: "GET"
    })

    if (data) {
      setMenu({ ...menu, items: data.menuItems });
    }
  };

  const fetchCategoriesData = async () => {
    const categoriesData: ListAllCategoriesApiResponse = await apiFetch("api/categories", {
      method: "GET"
    })

    if (categoriesData) {
      setCategories(categoriesData.categories);
    }
  };

  const deleteMenu = async (menuId: string) => {
    await apiFetch(`api/menus/${menuId}`, {
      method: "DELETE"
    });

    navigate('../..', { relative: 'path' });
  };

  const editMenu = async (formData: MenuEditValues) => {
    await apiFetch("api/menus", {
      method: "PUT",
      body: JSON.stringify(formData)
    })

    await fetchMenuData();
    setMenuEditOpen(false);
  };

  const addItem = async (formData: MenuItemFormValues) => {
    const newItem = await apiFetch('api/menu-items', {
      method: "POST",
      body: JSON.stringify({
        categoryId: formData.category.id,
        menuId: menu.id,
        name: formData.name,
        price: formData.price,
        imgUrl: formData.imgUrl,
        isActive: formData.isActive
      })
    });

    if (newItem) {
      setMenu((p) => ({ ...p, items: [newItem, ...p.items] }));
      setItemCreateOpen(false);
    }
  };

  const editItem = async (id: string, formData: MenuItemFormValues) => {
    await apiFetch('api/menu-items', {
      method: "PUT",
      body: JSON.stringify({
        id,
        categoryId: formData.category.id,
        name: formData.name,
        price: formData.price,
        imgUrl: formData.imgUrl,
        isActive: formData.isActive
      })
    });

    await fetchMenuItems();
    setItemEditTarget(null);
  };

  const deleteItem = async (id: string) => {
    await apiFetch(`api/menu-items/${id}`, {
      method: "DELETE"
    });

    await fetchMenuItems();
    setItemDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb + header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link to="/manage-restaurants" className="inline-flex items-center gap-2 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4" />
              Restaurants
            </Link>
            <span className="text-slate-400">/</span>
            <Link to={`/manage-restaurants/${restaurantId}`} className="hover:text-slate-900">
              {restaurant?.name}
            </Link>
            <span className="text-slate-400">/</span>
            <span className="font-medium text-slate-900">{menu.name}</span>
          </div>

          <h2 className="mt-2 text-xl font-semibold text-slate-900">{menu.name}</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMenuEditOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>

          <button
            onClick={() => setMenuDeleteOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>

          <button
            onClick={fetchMenuData}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            title="Refresh dummy data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Menu info card */}
      <MenuInfoCard menu={menu} />

      {/* Menu Items (grouped by category) */}
      <MenuItemsSection
        menu={menu}
        setItemCreateOpen={setItemCreateOpen}
        setItemDeleteTarget={setItemDeleteTarget}
        setItemEditTarget={setItemEditTarget} />

      {/* Modals */}
      {menuEditOpen && (
        <ModalShell title="Edit Menu" onClose={() => setMenuEditOpen(false)}>
          <MenuEditForm
            initial={{
              id: menu.id,
              name: menu.name,
              description: menu.description,
              imgUrl: menu.imgUrl ?? "",
              isActive: menu.isActive,
              type: menu.type,
              restaurantId: menu.restaurantId
            }}
            onCancel={() => setMenuEditOpen(false)}
            onSubmit={editMenu}
          />
        </ModalShell>
      )}

      {itemCreateOpen && (
        <ModalShell title="Add Menu Item" onClose={() => setItemCreateOpen(false)}>
          <MenuItemForm
            initial={emptyItem}
            categories={categories}
            submitLabel="Create"
            onCancel={() => setItemCreateOpen(false)} onSubmit={addItem} />
        </ModalShell>
      )}

      {itemEditTarget && itemDeleteTarget && (
        <ModalShell title={`Edit: ${itemEditTarget.name}`} onClose={() => setItemEditTarget(null)}>
          <MenuItemForm
            initial={{
              name: itemEditTarget.name,
              price: itemEditTarget.price,
              imgUrl: itemEditTarget.imgUrl ?? "",
              isActive: itemEditTarget.isActive,
              category: itemDeleteTarget.category
            }}
            categories={categories}
            submitLabel="Save"
            onCancel={() => setItemEditTarget(null)}
            onSubmit={(v) => editItem(itemEditTarget.id, v)}
          />
        </ModalShell>
      )}

      {itemDeleteTarget && (
        <ModalShell title="Delete item?" onClose={() => setItemDeleteTarget(null)}>
          <div className="space-y-4">
            <p className="text-sm text-slate-700">
              Are you sure you want to delete <span className="font-semibold">{itemDeleteTarget.name}</span>?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setItemDeleteTarget(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteItem(itemDeleteTarget.id)}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {menuDeleteOpen && (
        <ModalShell title="Delete item?" onClose={() => setItemDeleteTarget(null)}>
          <div className="space-y-4">
            <p className="text-sm text-slate-700">
              Are you sure you want to delete <span className="font-semibold">{menu.name}</span>?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setMenuDeleteOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMenu(menu.id)}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
};

export default MenuEditorPage;