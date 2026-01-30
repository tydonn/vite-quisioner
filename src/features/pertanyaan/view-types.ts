export type StatusAktif = "Aktif" | "Nonaktif"

export type TipeJawaban =
    | "Pilihan"
    | "Teks"
    | "Likert"

export interface PertanyaanView {
    id: number
    kode: string
    pertanyaan: string
    kategori: string
    tipe: TipeJawaban
    wajib: boolean
    status: StatusAktif
}

export interface PertanyaanFilter {
    search: string
}
