export interface Category {
    CategoryID: number
    CategoryName: string
    Description: string
    SortOrder: number
    IsActive: number // 1 | 0
    CreatedAt: string
}

export interface Pagination {
    current_page: number
    per_page: number
    total: number
    last_page: number
}

export interface CategoryListResponse {
    success: boolean
    data: Category[]
    pagination: Pagination
}
