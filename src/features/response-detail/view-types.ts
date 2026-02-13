export interface ResponseDetailView {
    id: number
    responId: number
    mahasiswaId: string
    mahasiswaNama: string
    dosenId: string
    dosenNama: string
    matakuliahId: string
    matakuliahNama: string
    tahunAkademik: string
    semester: string
    pertanyaan: string
    jawabanLabel: string
    jawabanNilai: number | null
    jawabanText: string | null
    jawabanNumber: number | null
    jawabanTampil: string
}
