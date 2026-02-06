export interface ResponseSummary {
    ResponID: number
    MahasiswaID: string
    DosenID: string
    MatakuliahID: string
    TahunAkademik: string
    Semester: string
    dosen?: {
        Login?: string | number
        Nama?: string
        Name?: string
        nama?: string
    }
    mahasiswa?: {
        MhswID?: string
        Nama?: string
        Name?: string
        nama?: string
    }
}

export interface QuestionSummary {
    AspectID: number
    CategoryID: number
    AspectText: string
    AnswerType: "CHOICE" | "TEXT" | "LIKERT"
}

export interface ChoiceSummary {
    ChoiceID: number
    ChoiceLabel: string
    ChoiceValue: number
}

export interface DosenSummary {
    Login?: string | number
    Nama?: string
    Name?: string
    nama?: string
}

export interface MahasiswaSummary {
    MhswID?: string | number
    Nama?: string
}

export interface ResponseDetail {
    DetailID: number
    ResponID: number
    AspectID: number
    ChoiceID: number | null
    AnswerText: string | null
    AnswerNumber: number | null
    response?: ResponseSummary
    question?: QuestionSummary
    choice?: ChoiceSummary
    mahasiswa?: MahasiswaSummary
    dosen?: DosenSummary
}

export interface ResponseDetailListResponse {
    success: boolean
    data: ResponseDetail[]
    pagination: {
        current_page: number
        per_page: number
        total: number
        last_page: number
    }
}
