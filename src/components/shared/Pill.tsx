import { cx } from "../helper";

const Pill = ({ children, tone }: { children: React.ReactNode; tone?: "green" | "blue" | "red" | "slate" }) => {
  const cls =
    tone === "green"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "blue"
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : tone === "red"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <span className={cx("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", cls)}>
      {children}
    </span>
  );
};

export default Pill;