import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export type PercentageDetailQuestion = {
    AspectID?: string | number
    AspectText?: string
    count?: number
}

export type PercentageDetailDialogState = {
    open: boolean
    loading: boolean
    title: string
    questions: PercentageDetailQuestion[]
    error: string
}

type Props = {
    state: PercentageDetailDialogState
    onOpenChange: (open: boolean) => void
}

export function PercentageDetailDialog({ state, onOpenChange }: Props) {
    return (
        <Dialog open={state.open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] max-w-6xl overflow-hidden sm:max-w-6xl">
                <DialogHeader>
                    <DialogTitle>Detail Pertanyaan</DialogTitle>
                    <DialogDescription className="break-words">
                        {state.title}
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-[70vh] overflow-y-auto rounded-md border">
                    {state.loading ? (
                        <div className="py-10 text-center text-sm text-muted-foreground">
                            <span className="inline-flex items-center gap-2">
                                <Spinner className="size-4" />
                                Sedang memuat detail...
                            </span>
                        </div>
                    ) : state.error ? (
                        <div className="py-10 text-center text-sm text-muted-foreground">
                            {state.error}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="sticky top-0 z-10 bg-background">
                                <TableRow>
                                    <TableHead>Pertanyaan</TableHead>
                                    <TableHead className="w-24 min-w-24 text-right">Count</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {state.questions.map((question) => (
                                    <TableRow key={String(question.AspectID ?? question.AspectText)}>
                                        <TableCell className="max-w-0 whitespace-normal break-words align-top">
                                            <div className="font-medium">
                                                {question.AspectID ? `#${question.AspectID}` : "-"}
                                            </div>
                                            <div className="whitespace-normal break-words text-sm leading-relaxed text-muted-foreground">
                                                {question.AspectText ?? "-"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="align-top text-right font-medium">
                                            {question.count ?? 0}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
