export const cx = (...v: Array<string | false | undefined>) => v.filter(Boolean).join(" ");

export const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export const normalizeCategory = (category: string) => {
  const c = (category ?? "").trim();
  return c.length ? c : "Uncategorized";
};

export const classNames = (...v: Array<string | undefined | false>) => {
  return v.filter(Boolean).join(" ");
}