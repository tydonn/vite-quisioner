export interface Response {
    ResponID: number
    MahasiswaID: string
    DosenID: string
    MatakuliahID: string
    TahunAkademik: string
    Semester: string
    CreatedAt: string
    dosen?: DosenSummary | DosenSummary[] | string
    Dosen?: DosenSummary | DosenSummary[] | string
    DosenNama?: string
    dosen_nama?: string
    mahasiswa?: MahasiswaSummary
    matakuliah?: MatakuliahSummary
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

export interface MatakuliahSummary {
    MKID?: string | number
    Nama?: string
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
