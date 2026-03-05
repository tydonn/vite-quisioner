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
    const prodiId =
        item.matakuliah?.prodi?.ProdiID !== undefined &&
        item.matakuliah?.prodi?.ProdiID !== null
            ? String(item.matakuliah.prodi.ProdiID)
            : item.matakuliah?.ProdiID !== undefined &&
              item.matakuliah?.ProdiID !== null
            ? String(item.matakuliah.ProdiID)
            : "-"

    return {
        id: item.ResponID,
        mahasiswaId: item.MahasiswaID,
        mahasiswaNama: item.mahasiswa?.Nama ?? "-",
        dosenId,
        dosenNama: buildDosenNama(item),
        matakuliahId: item.MatakuliahID,
        matakuliahKode: item.matakuliah?.MKKode ?? "-",
        matakuliahNama: item.matakuliah?.Nama ?? "-",
        prodiId,
        prodiNama: item.matakuliah?.prodi?.Nama ?? "-",
        tahunAkademik: item.TahunAkademik,
        semester: item.Semester,
        createdAt: item.CreatedAt,
    }
}

export function mapResponseListToView(data: ResponseApi[]): ResponseView[] {
    return data.map(mapResponseToView)
}
