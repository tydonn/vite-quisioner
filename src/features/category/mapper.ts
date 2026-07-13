import type { Aspect } from "../question/types"
import type { PertanyaanView, TipeJawaban } from "../question/view-types"
import type { Category } from "./types"
import type { KategoriView, StatusAktif } from "./view-types"

function formatKode(id: number): string {
    return `K${id.toString().padStart(2, "0")}`
}

function mapStatus(isActive: number | string | null | undefined): StatusAktif {
    return Number(isActive) === 1 ? "Aktif" : "Nonaktif"
}

function mapTipe(type: string): TipeJawaban {
    switch (type) {
        case "TEXT":
            return "Teks"
        case "LIKERT":
            return "Likert"
        case "CHOICE":
        default:
            return "Pilihan"
    }
}

export function mapCategoryToView(category: Category): KategoriView {
    return {
        id: category.CategoryID,
        kode: formatKode(category.CategoryID),
        nama: category.CategoryName,
        deskripsi: category.Description,
        urutan: category.SortOrder,
        status: mapStatus(category.IsActive),
    }
}

export function mapCategoryListToView(data: Category[]): KategoriView[] {
    return data.map(mapCategoryToView)
}

export function mapAspectToView(aspect: Aspect): PertanyaanView {
    return {
        id: aspect.AspectID,
        kode: formatKode(aspect.AspectID),
        pertanyaan: aspect.AspectText,
        kategoriId: aspect.CategoryID,
        kategori: aspect.category?.CategoryName ?? "-",
        tipe: mapTipe(aspect.AnswerType),

        // ← field respondent dipetakan di sini
        respondenId: aspect.RespondentID !== null ? String(aspect.RespondentID) : null,
        responden: aspect.respondent?.RespondentName ?? null,

        urutan: aspect.SortOrder,
        status: mapStatus(aspect.IsActive),
        prodiNama: aspect.prodis?.map((p) => p.Nama).join(", ") ?? "-",
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
    }
}

export function mapAspectListToView(data: Aspect[]): PertanyaanView[] {
    return data.map(mapAspectToView)
}
