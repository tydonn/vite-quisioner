export interface ChoiceQuestion {
    AspectID: number
    CategoryID: number
    AspectText: string
    AnswerType: "CHOICE" | "TEXT" | "LIKERT"
    ChoiceTypeID: number | null
    SortOrder: number
    IsActive: number
    CreatedAt: string
}

export interface Choice {
    ChoiceID: number
    AspectID: number
    ChoiceLabel: string
    ChoiceValue: number
    SortOrder: number
    IsActive: number
    question?: ChoiceQuestion
}

export interface ChoiceResponse {
    data: Choice[]
}

export interface Pagination {
    current_page: number
    per_page: number
    total: number
    last_page: number
}

export interface ChoiceListResponse {
    success: boolean
    data: Choice[]
    pagination: Pagination
}
