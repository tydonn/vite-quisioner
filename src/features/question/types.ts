export interface Category {
    CategoryID: number
    CategoryName: string
    Description: string
    SortOrder: number
    IsActive: number
    CreatedAt: string
}

export interface Aspect {
    AspectID: number
    CategoryID: number
    AspectText: string
    AnswerType: "CHOICE" | "TEXT" | "LIKERT"
    ChoiceTypeID: number | null
    SortOrder: number
    IsActive: number
    CreatedAt: string
    category?: Category
}

export interface AspectResponse {
    data: Aspect[]
}

export interface Pagination {
    current_page: number
    per_page: number
    total: number
    last_page: number
}

export interface AspectListResponse {
    success: boolean
    data: Aspect[]
    pagination: Pagination
}
