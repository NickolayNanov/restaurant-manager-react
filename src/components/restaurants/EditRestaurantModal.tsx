import type { Restaurant, RestaurantWithMenu } from "../../types/restaurants";
import ModalShell from "../modals/ModalShell";
import RestaurantForm from "./RestaurantForm";

const EditRestaurantModal = ({
    editTarget,
    setEditTarget,
    updateRestaurant
}: {
    editTarget: Restaurant;
    setEditTarget: (v: null | RestaurantWithMenu) => void;
    updateRestaurant: (id: string, values: any) => Promise<void>;
}) => {

    return(
        <ModalShell title={`Edit: ${editTarget.name}`} onClose={() => setEditTarget(null)}>
          <RestaurantForm
            initial={{
              name: editTarget.name,
              location: editTarget.location,
              cuisine: editTarget.cuisine,
              status: editTarget.status,
              description: editTarget.description,
              imgUrl: editTarget.imgUrl,
              ownerId: editTarget.ownerId
            }}
            submitLabel="Save"
            onSubmit={(values) => updateRestaurant(editTarget.id, values)}
            onCancel={() => setEditTarget(null)}
          />
        </ModalShell>
    )
};

export default EditRestaurantModal;