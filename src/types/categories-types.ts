export type Category = {
    id: string,
    name: string,
    isActive: boolean
    menuItemsCount: number | null;
}

export type ListAllCategoriesApiResponse = {
    categories: Category[]
}
