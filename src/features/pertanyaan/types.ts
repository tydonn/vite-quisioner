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
