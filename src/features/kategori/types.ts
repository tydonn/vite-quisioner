export type Kategori = {
    id: number
    kode: string
    nama: string
    deskripsi: string
    bobot: number
    tipe: "likert" | "boolean" | "numeric"
    aktif: boolean
}

export type Pertanyaan = {
    id: number
    kode: string
    pertanyaan: string
    kategori: string
    tipe: string
    wajib: true | false
    status: "Aktif" | "Nonaktif"
}
