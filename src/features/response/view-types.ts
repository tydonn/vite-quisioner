export type StatusAktif = "Aktif" | "Nonaktif"

export interface ResponseView {
    id: number
    mahasiswaId: string
    mahasiswaNama: string
    dosenId: string
    dosenNama: string
    matakuliahId: string
    tahunAkademik: string
    semester: string
    createdAt: string
}
