import { useEffect, useState } from "react";
import ManageRestaurantsHeader from "../components/restaurants/ManageRestaurantsHeader";
import ManageRestaurantsTable from "../components/restaurants/ManageRestaurantsTable";
import type { Restaurant, RestaurantFormValues, SingleRestaurantApiResponse } from "../types/restaurants-types";
import { apiFetch } from "../api/apiFetch";
import RestaurantForm from "../components/restaurants/RestaurantForm";
import ModalShell from "../components/modals/ModalShell";
import { classNames } from "../components/helper";
import DeleteRestaurantModal from "../components/restaurants/DeleteRestaurantModal";
import EditRestaurantModal from "../components/restaurants/EditRestaurantModal";
import { appendFileIfSelected } from "../components/imageUpload";

const emptyForm: RestaurantFormValues = {
  name: "",
  location: "",
  status: "Open",
  cuisine: "",
  description: "",
  imageFile: null,
  ownerId: null
};

const buildRestaurantFormData = (values: RestaurantFormValues, id?: string) => {
  const data = new FormData();
  if (id) data.append("id", id);
  data.append("name", values.name);
  data.append("description", values.description);
  data.append("location", values.location);
  data.append("cuisine", values.cuisine);
  data.append("status", values.status);
  if (values.ownerId) data.append("ownerId", values.ownerId);
  appendFileIfSelected(data, values.imageFile);
  return data;
};

const ManageRestaurantsPage = () => {
  const [rows, setRows] = useState<Restaurant[]>([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Restaurant | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Restaurant | null>(null);

  async function fetchRestaurants() {
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

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchRestaurants();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const createRestaurant = async (formData: RestaurantFormValues) => {
    const response = await apiFetch("api/restaurants", {
      method: "POST",
      body: buildRestaurantFormData(formData)
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
      body: buildRestaurantFormData(formData, id)
    });

    await fetchRestaurants();
    setEditTarget(null);
  }

  const deleteRestaurant = async (id: string) => {
    await apiFetch(`api/restaurants/${id}`, {
      method: "DELETE"
    });
    setRows((prev) => prev.filter((r) => r.id !== id));
    setDeleteTarget(null);
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
