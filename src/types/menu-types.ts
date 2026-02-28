import type { MenuItem } from "./menu-item-types";

export type Menu = {
  id: string;
  name: string;
  description: string;
  imgUrl: string;
  isActive: boolean;
  type: MenuType;
};

export type MenuWithItems = Menu & {
  restaurantId: string;
  items: MenuItem[];
};

export type MenuForm = {
  id: string | null;
  name: string;
  description: string;
  imgUrl: string;
  isActive: boolean;
  type: MenuType;
  restaurantId: string;
}

export type MenuApiResponse = {
  id: string;
  name: string;
  description: string;
  imgUrl: string;
  isActive: boolean;
  type: MenuType;
}

export type MenuType = "Default" | "Summer" | "Winter" | "Spring" | "Autumn";