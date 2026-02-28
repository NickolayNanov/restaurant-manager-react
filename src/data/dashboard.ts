import type { MenuWithItems } from "../types/menu-types";
import type { Restaurant } from "../types/restaurants";

export const dashboardKpis = {
  totalRestaurants: 12,
  overallRating: 4.8,
  monthlyRevenue: 25860,
  totalReviews: 1330,
};

export const restaurants: Restaurant[] = [
  { id: "r1", name: "Bella Italia", status: "Open", cuisine: "Italian", location: "Sofia", rating: 4.7 },
  { id: "r2", name: "Sushi World", status: "Closed", cuisine: "Japanese", location: "Plovdiv", rating: 4.6 },
  { id: "r3", name: "Burger Palace", status: "Open", cuisine: "American", location: "Varna", rating: 4.5 },
  { id: "r4", name: "Taco Fiesta", status: "Open", cuisine: "Mexican", location: "Burgas", rating: 4.4 },
];

export const analytics = [
  { month: "Jan", revenue: 12000, rating: 4.6 },
  { month: "Feb", revenue: 18000, rating: 4.7 },
  { month: "Mar", revenue: 15500, rating: 4.7 },
  { month: "Apr", revenue: 16500, rating: 4.8 },
  { month: "May", revenue: 23500, rating: 4.8 },
  { month: "Jun", revenue: 25860, rating: 4.8 },
];

export const feedback = {
  fiveStar: 79,
  fourStar: 16,
  threeStar: 3,
  twoStar: 1,
  oneStar: 1,
};

export const topDishes = [
  { id: "d1", name: "Margherita Pizza", restaurant: "Bella Italia" },
  { id: "d2", name: "Spicy Tuna Roll", restaurant: "Sushi World" },
  { id: "d3", name: "Cheeseburger", restaurant: "Burger Palace" },
  { id: "d4", name: "Chicken Tacos", restaurant: "Taco Fiesta" },
];

export const seedMenu = (restaurantId: string, menuId: string): MenuWithItems => ({
  id: menuId,
  restaurantId,
  name: "Summer Menu",
  description: "Refreshing seasonal menu featuring light summer dishes and drinks.",
  imgUrl:
    "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=70",
  isActive: true,
  type: "Summer",
  items: [
    {
      id: "i1",
      name: "Caprese Salad",
      price: 6.99,
      imgUrl:
        "https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&w=400&q=70",
      isActive: true,
      category: "Salads",
    },
    {
      id: "i12",
      name: "Caprese Salad23",
      price: 1111,
      imgUrl:
        "https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&w=400&q=70",
      isActive: true,
      category: "Salads",
    },
    {
      id: "i13",
      name: "Caprese Salad23",
      price: 1111,
      imgUrl:
        "https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&w=400&q=70",
      isActive: true,
      category: "Salads",
    }
    ,
    {
      id: "i2",
      name: "Grilled Salmon",
      price: 15.99,
      imgUrl:
        "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=400&q=70",
      isActive: true,
      category: "Main Courses",
    },
    {
      id: "i3",
      name: "Strawberry Lemonade",
      price: 3.49,
      imgUrl:
        "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=400&q=70",
      isActive: true,
      category: "Drinks",
    },
    {
      id: "i4",
      name: "Watermelon Sorbet",
      price: 4.99,
      imgUrl:
        "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=400&q=70",
      isActive: false,
      category: "Desserts",
    },
  ],
});