import type { Menu } from "./menu-types";

export type SingleRestaurantApiResponse = { 
  id: string; 
  name: string; 
  description: string; 
  status: RestaurantStatus; 
  cuisine: string; 
  location: string; 
  imgUrl: string; 
  ownerId: string|null;
  menus: Menu[];
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}

export type Restaurant = {
  id: string;
  name: string;
  description: string;
  status: RestaurantStatus;
  cuisine: string;
  location: string;
  imgUrl: string;
  ownerId: string|null;
};

export type RestaurantWithMenu = Restaurant & {
  menus: Menu[];
};

export type RestaurantFormValues = {
  name: string;
  description: string;
  status: RestaurantStatus;
  cuisine: string;
  location: string;
  imgUrl: string;
  ownerId: string|null;
};

export type RestaurantStatus = "Open" | "Closed";