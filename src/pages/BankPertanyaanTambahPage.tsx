import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import QuestionForm from "@/components/bank-pertanyaan/QuestionForm"

export default function BankPertanyaanTambahPage() {
    return (

        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Tambah Pertanyaan</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Tambah Pertanyaan</CardTitle>
                </CardHeader>
                <CardContent>
                    <QuestionForm />
                </CardContent>
            </Card>
        </div>
    )
}
