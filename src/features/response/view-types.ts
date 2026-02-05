export type StatusAktif = "Aktif" | "Nonaktif"

export interface ResponseView {
    id: number
    mahasiswaId: string
    dosenId: string
    matakuliahId: string
    tahunAkademik: string
    semester: string
    createdAt: string
}
