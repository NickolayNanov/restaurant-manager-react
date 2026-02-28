import { Plus } from "lucide-react";

type ManageRestaurantsHeaderProps = {
    setCreateOpen: (v: boolean) => void;
};

const ManageRestaurantsHeader = ({ setCreateOpen } : ManageRestaurantsHeaderProps) => {
    return (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
                <p className="mt-1 text-sm text-slate-600">Manage restaurants in your portfolio. Create, edit, open menus, or remove old entries.</p>
            </div>

            <button
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
                <Plus className="h-4 w-4" />
                New Restaurant
            </button>
        </div>
    )
};

export default ManageRestaurantsHeader;