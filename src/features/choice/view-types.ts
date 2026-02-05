export type StatusAktif = "Aktif" | "Nonaktif"

export interface ChoiceView {
    id: number
    kode: string
    label: string
    nilai: number
    urutan: number
    status: StatusAktif
    pertanyaan: string
}
