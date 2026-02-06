export type StatusAktif = "Aktif" | "Nonaktif"

export interface ChoiceTypeView {
    id: number
    kode: string
    nama: string
    deskripsi: string
    status: StatusAktif
}
