import type { Aspect } from "./types"
import type { PertanyaanView, TipeJawaban, StatusAktif } from "./view-types"

function formatKode(id: number): string {
    return `P${id.toString().padStart(3, "0")}`
}

function mapAnswerType(type: string): TipeJawaban {
    switch (type) {
        case "CHOICE":
            return "Pilihan"
        case "TEXT":
            return "Teks"
        case "LIKERT":
            return "Likert"
        default:
            return "Pilihan"
    }
}

function mapStatus(isActive: number | string | null | undefined): StatusAktif {
    return Number(isActive) === 1 ? "Aktif" : "Nonaktif"
}

export function mapAspectToPertanyaanView(
    aspect: Aspect
): PertanyaanView {
    return {
        id: aspect.AspectID,
        kode: formatKode(aspect.AspectID),
        pertanyaan: aspect.AspectText,
        kategoriId: aspect.CategoryID,
        kategori: aspect.category?.CategoryName ?? "-",
        activityLog: aspect.activity_log
            ? {
                action: aspect.activity_log.action,
                actorName: aspect.activity_log.actor_name,
                actorEmail: aspect.activity_log.actor_email,
                createdAt: aspect.activity_log.created_at,
                module: aspect.activity_log.module,
                entityType: aspect.activity_log.entity_type,
                entityId: aspect.activity_log.entity_id,
                newData: aspect.activity_log.meta?.new_data,
            }
            : null,
        tipe: mapAnswerType(aspect.AnswerType),
        respondenId: aspect.RespondentID === null ? null : String(aspect.RespondentID),
        responden: aspect.respondent?.RespondentName ?? null,
        urutan: aspect.SortOrder,
        status: mapStatus(aspect.IsActive),
        prodiNama:
            aspect.prodis && aspect.prodis.length > 0
                ? aspect.prodis.map((item) => item.Nama).join(", ")
                : "-",
    }
}

export function mapAspectListToView(
    data: Aspect[]
): PertanyaanView[] {
    return data.map(mapAspectToPertanyaanView)
}
