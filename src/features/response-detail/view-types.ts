export interface ResponseDetailView {
    id: number
    responId: number
    mahasiswaId: string
    dosenId: string
    matakuliahId: string
    tahunAkademik: string
    semester: string
    pertanyaan: string
    jawabanLabel: string
    jawabanNilai: number | null
    jawabanText: string | null
    jawabanNumber: number | null
    jawabanTampil: string
}
