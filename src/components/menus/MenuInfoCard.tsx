import { ImageIcon, Tag, BadgeCheck, UtensilsCrossed, Copy } from "lucide-react";
import type { MenuWithItems } from "../../types/menu-types";
import Pill from "../shared/Pill";

const MenuInfoCard = ({
    menu
}: { menu: MenuWithItems }) => {
    const copyId = async (value: string | null) => {
        try {
            await navigator.clipboard.writeText(value ?? "");
        } catch { /* empty */ }
    };

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-4">
                    <div className="h-28 w-40 overflow-hidden rounded-xl bg-slate-100">
                        {menu.imgUrl ? (
                            <img src={menu.imgUrl} alt={menu.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-500">
                                <ImageIcon className="h-6 w-6" />
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="text-lg font-semibold text-slate-900">{menu.name}</div>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Pill tone="blue">
                                <Tag className="mr-2 h-3.5 w-3.5" />
                                {menu.type}
                            </Pill>

                            <Pill tone={menu.isActive ? "green" : "slate"}>
                                <BadgeCheck className="mr-2 h-3.5 w-3.5" />
                                {menu.isActive ? "Active" : "Inactive"}
                            </Pill>

                            <Pill tone="slate">
                                <UtensilsCrossed className="mr-2 h-3.5 w-3.5" />
                                {menu.items.length} item(s)
                            </Pill>
                        </div>
                    </div>
                </div>

                <div className="text-xs text-slate-500">
                    Menu ID: <span className="font-semibold text-slate-700">{menu.id}</span>
                    <button
                        onClick={() => copyId(menu.id)}
                        className="ml-2 inline-flex items-center rounded-md p-1 hover:bg-slate-100"
                        title="Copy"
                    >
                        <Copy className="h-3.5 w-3.5 text-slate-600" />
                    </button>
                </div>
            </div>

            <div className="mt-4 border-t border-slate-200 pt-4 text-sm text-slate-700">{menu.description}</div>
        </section>
    )
};

export default MenuInfoCard;