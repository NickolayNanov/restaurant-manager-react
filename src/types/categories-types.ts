export type Category = {
    id: string,
    name: string,
    isActive: boolean
    menuItemsCount: number;
}

export type ListAllCategoriesApiResponse = {
    categories: Category[]
}
