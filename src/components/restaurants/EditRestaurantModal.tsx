import type { Restaurant, RestaurantFormValues, RestaurantWithMenu } from "../../types/restaurants-types";
import ModalShell from "../modals/ModalShell";
import RestaurantForm from "./RestaurantForm";

const EditRestaurantModal = ({
    editTarget,
    setEditTarget,
    updateRestaurant
}: {
    editTarget: Restaurant;
    setEditTarget: (v: null | RestaurantWithMenu) => void;
	    updateRestaurant: (id: string, values: RestaurantFormValues) => Promise<void>;
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
	              imageFile: null,
	              existingImgUrl: editTarget.imgUrl,
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
