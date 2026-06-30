export type RestaurantMonthlyReport = {
  id: string;
  restaurantId: string;
  year: number;
  month: number;
  revenue: number;
  rating: number;
  createdAt: string;
  updatedAt: string | null;
};

export type ListRestaurantMonthlyReportsResponse = {
  reports: RestaurantMonthlyReport[];
};

export type RestaurantMonthlyReportFormValues = {
  monthValue: string;
  revenue: string;
  rating: string;
};

export type PerformanceAnalyticsMonth = {
  year: number;
  month: number;
  label: string;
  revenue: number;
  rating: number | null;
};

export type PerformanceAnalyticsResponse = {
  months: PerformanceAnalyticsMonth[];
  averageMonthlyRevenue: number;
};
