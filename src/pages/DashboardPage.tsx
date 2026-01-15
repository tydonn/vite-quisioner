import { StatCards } from "@/components/dahsboard/StatCards"
import { OverviewChart } from "@/components/dahsboard/OverviewChart"
import { RecentResponses } from "@/components/dahsboard/RecentResponses"
import { IssueAlert } from "@/components/dahsboard/IssueAlert"
import QuickActions from "@/components/dahsboard/QuickActions"
import { ChartAreaInteractive } from "@/components/dahsboard/TotalOverviewChart"

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <StatCards />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <OverviewChart />
                <IssueAlert />
            </div>

            <RecentResponses />

            {/* <QuickActions /> */}
        </div>
    )
}
