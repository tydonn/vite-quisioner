export type StatusAktif = "Aktif" | "Nonaktif"

export type TipeJawaban =
    | "Pilihan"
    | "Teks"
    | "Likert"

export interface PertanyaanView {
    id: number
    kode: string
    pertanyaan: string
    kategoriId: number
    kategori: string
    tipe: TipeJawaban
    urutan: number
    status: StatusAktif
}

export interface PertanyaanFilter {
    search: string
}
