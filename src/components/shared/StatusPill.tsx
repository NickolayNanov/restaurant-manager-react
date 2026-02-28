import type { RestaurantStatus } from "../../types/restaurants";
import { cx } from "../helper";

const StatusPill = ({ status }: { status: RestaurantStatus }) => {
    const cls =
        status === "Open"
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-rose-200 bg-rose-50 text-rose-700";

    return (
        <span className={cx("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", cls)}>
            {status}
        </span>
    );
};

export default StatusPill;