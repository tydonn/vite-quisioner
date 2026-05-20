import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import type { PertanyaanView } from "@/features/question/view-types"

type Props = {
    open: boolean
    data: PertanyaanView | null
    onClose: () => void
}

export function ActivityLogDialog({ open, data, onClose }: Props) {
    const log = data?.activityLog

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Aktivitas Terakhir</DialogTitle>
                    <DialogDescription>
                        Detail aktivitas terakhir untuk pertanyaan ini.
                    </DialogDescription>
                </DialogHeader>

                {!log ? (
                    <div className="text-sm text-muted-foreground">Tidak ada data aktivitas.</div>
                ) : (
                    <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Aksi:</span> {log.action}</div>
                        <div><span className="font-medium">Aktor:</span> {log.actorName}</div>
                        <div><span className="font-medium">Email:</span> {log.actorEmail}</div>
                        <div><span className="font-medium">Waktu:</span> {log.createdAt}</div>
                        <div><span className="font-medium">Module:</span> {log.module}</div>
                        <div><span className="font-medium">Entity:</span> {log.entityType} ({log.entityId})</div>
                        <div className="pt-2">
                            <div className="mb-1 font-medium">Data Baru</div>
                            <pre className="max-h-56 overflow-auto rounded-md border bg-muted p-3 text-xs">
                                {JSON.stringify(log.newData ?? {}, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

