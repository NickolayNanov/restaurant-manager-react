import type { Restaurant, RestaurantWithMenu } from "../../types/restaurants";
import ModalShell from "../modals/ModalShell";

const DeleteRestaurantModal = ({
    deleteTarget,
    setDeleteTarget,
    deleteRestaurant
}: {
    deleteTarget: Restaurant;
    setDeleteTarget: (v: null | RestaurantWithMenu) => void;
    deleteRestaurant: (v: string) => void;
}) => {

    return (
        <ModalShell title="Delete restaurant?" onClose={() => setDeleteTarget(null)}>
            <div className="space-y-4">
                <p className="text-sm text-slate-700">
                    Are you sure you want to delete <span className="font-semibold">{deleteTarget.name}</span>?
                    This will remove it from the list. (Dummy data only for now)
                </p>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => setDeleteTarget(null)}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => deleteRestaurant(deleteTarget.id)}
                        className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </ModalShell>
    )
};

export default DeleteRestaurantModal;