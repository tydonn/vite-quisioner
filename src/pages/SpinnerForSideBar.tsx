import { Spinner } from "@/components/ui/spinner"

export function SpinnerCustom() {
    return (
        <div className="flex items-center gap-4">
            <Spinner className="size-10" />
        </div>
    )
}

export default function SpinnerForSideBar() {
    return (
        <div className="flex min-h-[calc(100vh-8rem)] w-full items-center justify-center">
            <SpinnerCustom />
        </div>
    )
}
