export interface Response {
    ResponID: number
    MahasiswaID: string
    DosenID: string
    MatakuliahID: string
    TahunAkademik: string
    Semester: string
    CreatedAt: string
}

export interface ResponseListResponse {
    success: boolean
    data: Response[]
    pagination: {
        current_page: number
        per_page: number
        total: number
        last_page: number
    }
}
