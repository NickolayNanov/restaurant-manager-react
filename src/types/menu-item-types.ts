import type { Category } from "./categories-types";

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  imgUrl?: string;
  isActive: boolean;
  category: Category;
};