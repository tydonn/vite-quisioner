import { LoaderIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
    return (
        <LoaderIcon
            role="status"
            aria-label="Loading"
            className={cn("size-4 animate-spin", className)}
            {...props}
        />
    )
}

export function SpinnerCustom() {
    return (
        <div className="flex items-center gap-4">
            <Spinner />
            <span className="text-sm text-muted-foreground">
                Sedang memuat data ...
            </span>
        </div>
    )
}

export default function SpinnerPage() {
    return (
        <div className="flex min-h-[calc(100vh-6rem)] w-full items-center justify-center">
            <SpinnerCustom />
        </div>
    )
}
