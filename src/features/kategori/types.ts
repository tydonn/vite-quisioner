export type Kategori = {
    id: number
    kode: string
    nama: string
    deskripsi: string
    bobot: number
    tipe: "likert" | "boolean" | "numeric"
    aktif: boolean
}
