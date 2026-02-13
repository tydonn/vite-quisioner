import type { ResponseDetail } from "./types"
import type { ResponseDetailView } from "./view-types"

function buildJawabanTampil(
    label: string,
    answerText: string | null,
    answerNumber: number | null
): string {
    if (label && label !== "-") return label
    if (answerText) return answerText
    if (answerNumber !== null && answerNumber !== undefined) return String(answerNumber)
    return "-"
}

function getNama(value?: {
    Nama?: string
    Name?: string
    nama?: string
}): string {
    return value?.Nama ?? value?.Name ?? value?.nama ?? "-"
}

export function mapResponseDetailToView(
    item: ResponseDetail
): ResponseDetailView {
    const jawabanLabel = item.choice?.ChoiceLabel ?? "-"
    const jawabanNilai = item.choice?.ChoiceValue ?? null

    return {
        id: item.DetailID,
        responId: item.ResponID,
        mahasiswaId: item.response?.MahasiswaID ?? "-",
        mahasiswaNama: getNama(item.response?.mahasiswa),
        dosenId: item.response?.DosenID ?? "-",
        dosenNama: getNama(item.response?.dosen),
        matakuliahId: item.response?.MatakuliahID ?? "-",
        matakuliahNama: getNama(item.response?.matakuliah),
        tahunAkademik: item.response?.TahunAkademik ?? "-",
        semester: item.response?.Semester ?? "-",
        pertanyaan: item.question?.AspectText ?? "-",
        jawabanLabel,
        jawabanNilai,
        jawabanText: item.AnswerText ?? null,
        jawabanNumber: item.AnswerNumber ?? null,
        jawabanTampil: buildJawabanTampil(
            jawabanLabel,
            item.AnswerText ?? null,
            item.AnswerNumber ?? null
        ),
    }
}

export function mapResponseDetailListToView(
    data: ResponseDetail[]
): ResponseDetailView[] {
    return data.map(mapResponseDetailToView)
}
