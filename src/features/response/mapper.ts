import type { DosenSummary, Response as ResponseApi } from "./types"
import type { ResponseView } from "./view-types"

function getNameFromDosenSummary(summary?: DosenSummary): string | undefined {
    return summary?.Nama ?? summary?.Name ?? summary?.nama
}

function extractDosenName(
    dosenValue: ResponseApi["dosen"],
    fallbackId: string
): string {
    if (!dosenValue) return "-"
    if (typeof dosenValue === "string") return dosenValue
    if (Array.isArray(dosenValue)) {
        const first = dosenValue[0]
        return getNameFromDosenSummary(first) ?? fallbackId
    }
    return getNameFromDosenSummary(dosenValue) ?? fallbackId
}

function buildDosenNama(item: ResponseApi): string {
    const fallbackId = String(item.DosenID)
    const candidate =
        extractDosenName(item.dosen, fallbackId) ??
        extractDosenName(item.Dosen, fallbackId)

    if (candidate && candidate !== "-") return candidate
    if (item.DosenNama) return item.DosenNama
    if (item.dosen_nama) return item.dosen_nama

    return "-"
}

export function mapResponseToView(item: ResponseApi): ResponseView {
    const dosenId = String(item.DosenID)

    return {
        id: item.ResponID,
        mahasiswaId: item.MahasiswaID,
        mahasiswaNama: item.mahasiswa?.Nama ?? "-",
        dosenId,
        dosenNama: buildDosenNama(item),
        matakuliahId: item.MatakuliahID,
        matakuliahNama: item.matakuliah?.Nama ?? "-",
        tahunAkademik: item.TahunAkademik,
        semester: item.Semester,
        createdAt: item.CreatedAt,
    }
}

export function mapResponseListToView(data: ResponseApi[]): ResponseView[] {
    return data.map(mapResponseToView)
}
