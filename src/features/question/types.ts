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
    RespondentID: number | string | null
    ChoiceTypeID: number | null
    SortOrder: number
    IsActive: number
    CreatedAt: string
    activity_log?: {
        id: number
        module: string
        action: string
        entity_type: string
        entity_id: string
        actor_id: number
        actor_name: string
        actor_email: string
        meta?: {
            new_data?: Record<string, unknown>
        }
        created_at: string
        updated_at: string
    }
    prodi_ids?: string[]
    prodis?: Array<{
        ProdiID: string
        Nama: string
    }>
    category?: Category
    respondent?: {
        RespondentID: number | string
        RespondentName: string
    }
}

export interface Respondent {
    RespondentID: number
    RespondentName: string
    LevelID: string
}

export interface RespondentListResponse {
    success: boolean
    data: Respondent[]
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
