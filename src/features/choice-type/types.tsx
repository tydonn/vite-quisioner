export interface ChoiceType {
    ChoiceTypeID: number
    TypeCode: string
    TypeName: string
    Description: string | null
    IsActive: number
}

export interface ChoiceTypeListResponse {
    success: boolean
    data: ChoiceType[]
    pagination?: {
        current_page: number
        per_page: number
        total: number
        last_page: number
    }
}
