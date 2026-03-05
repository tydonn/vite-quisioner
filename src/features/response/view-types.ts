export type StatusAktif = "Aktif" | "Nonaktif"

export interface ResponseView {
    id: number
    mahasiswaId: string
    mahasiswaNama: string
    dosenId: string
    dosenNama: string
    matakuliahId: string
    matakuliahKode: string
    matakuliahNama: string
    prodiId: string
    prodiNama: string
    tahunAkademik: string
    semester: string
    createdAt: string
}
