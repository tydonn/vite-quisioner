export type StatusAktif = "Aktif" | "Nonaktif"

export interface KategoriView {
    id: number
    kode: string
    nama: string
    deskripsi: string
    urutan: number
    status: StatusAktif
}
