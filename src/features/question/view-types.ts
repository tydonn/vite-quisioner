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
    activityLog: {
        action: string
        actorName: string
        actorEmail: string
        createdAt: string
        module: string
        entityType: string
        entityId: string
        newData?: Record<string, unknown>
    } | null
    tipe: TipeJawaban
    urutan: number
    status: StatusAktif
}

export interface PertanyaanFilter {
    search: string
}
