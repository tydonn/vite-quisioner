import * as React from "react"
import { Link, useLocation } from "react-router-dom"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function AppBreadcrumbs() {
    const location = useLocation()
    const segments = location.pathname
        .split("/")
        .filter(Boolean)
        .filter((seg) => seg !== "responden")

    const labelMap: Record<string, string> = {
        response: "Response",
        detail: "Response Detail",
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link to="/dashboard">Dashboard</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {segments.map((seg, i) => {
                    const href = "/" + segments.slice(0, i + 1).join("/")
                    const label =
                        labelMap[seg] ?? seg.replace("-", " ")

                    return (
                        <React.Fragment key={href}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                {i === segments.length - 1 ? (
                                    <BreadcrumbPage className="capitalize">
                                        {label}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link to={href} className="capitalize">
                                            {label}
                                        </Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
