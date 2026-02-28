import { useEffect, useRef, useState } from "react";
import ManageRestaurantsHeader from "../components/restaurants/ManageRestaurantsHeader";
import ManageRestaurantsTable from "../components/restaurants/ManageRestaurantsTable";
import type { Restaurant, RestaurantFormValues, SingleRestaurantApiResponse } from "../types/restaurants";
import { apiFetch } from "../api/apiFetch";
import RestaurantForm from "../components/restaurants/RestaurantForm";
import ModalShell from "../components/modals/ModalShell";
import { classNames } from "../components/helper";
import DeleteRestaurantModal from "../components/restaurants/DeleteRestaurantModal";
import EditRestaurantModal from "../components/restaurants/EditRestaurantModal";

const emptyForm: RestaurantFormValues = {
  name: "",
  location: "",
  status: "Open",
  cuisine: "",
  description: "",
  imgUrl: "",
  ownerId: null
};

const ManageRestaurantsPage = () => {
  const [rows, setRows] = useState<Restaurant[]>([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Restaurant | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Restaurant | null>(null);

  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    void fetchRestaurants();
  }, []);

  const createRestaurant = async (formData: RestaurantFormValues) => {
    const response = await apiFetch("api/restaurants", {
      method: "POST",
      body: JSON.stringify(formData)
    });

    if (response) {
      const newRestaurant: Restaurant = {
        id: response.id,
        name: response.name,
        description: response.description,
        status: response.status,
        cuisine: response.cuisine,
        location: response.location,
        imgUrl: response.imgUrl,
        ownerId: response.ownerId
      }

      setRows((prev) => [newRestaurant, ...prev]);
      setCreateOpen(false);
    }
  }

  const updateRestaurant = async (id: string, formData: RestaurantFormValues) => {
    await apiFetch("api/restaurants", {
      method: "PUT",
      body: JSON.stringify({ id, ...formData })
    });

    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...formData } : r)));
    setEditTarget(null);
  }

  const deleteRestaurant = async (id: string) => {
    await apiFetch(`api/restaurants/${id}`, {
      method: "DELETE"
    });
    setRows((prev) => prev.filter((r) => r.id !== id));
    setDeleteTarget(null);
  }

  const fetchRestaurants = async () => {
    const data = await apiFetch("api/restaurants", {
      method: "GET"
    });
    
    const restaurants = data.restaurants.map((r: SingleRestaurantApiResponse) => {
      return {
        id: r.id,
        name: r.name,
        description: r.description,
        status: r.status,
        cuisine: r.cuisine,
        location: r.location,
        imgUrl: r.imgUrl,
        ownerId: r.ownerId
      }
    });

    if (restaurants) {
      setRows(restaurants);
    }
  }

  return (
    <div className="space-y-4">
      {/* Header area (matches your app's style) */}

      <ManageRestaurantsHeader setCreateOpen={setCreateOpen} />

      {/* Table card */}
      <ManageRestaurantsTable
        data={rows}
        setDeleteTarget={setDeleteTarget}
        setEditTarget={setEditTarget}
        classNames={classNames} 
        fetchRestaurants={fetchRestaurants} />

      {/* Create modal */}
      {createOpen && (
        <ModalShell title="New Restaurant" onClose={() => setCreateOpen(false)}>
          <RestaurantForm
            initial={emptyForm}
            submitLabel="Create"
            onSubmit={createRestaurant}
            onCancel={() => setCreateOpen(false)}
          />
        </ModalShell>
      )}

      {/* Edit modal */}
      {editTarget && (
        <EditRestaurantModal editTarget={editTarget} setEditTarget={setEditTarget} updateRestaurant={updateRestaurant} />
      )}

      {/* Delete modal */}
      {deleteTarget && (
        <DeleteRestaurantModal deleteTarget={deleteTarget} setDeleteTarget={setDeleteTarget} deleteRestaurant={deleteRestaurant} />
      )}
    </div>
  );
}

export default ManageRestaurantsPage