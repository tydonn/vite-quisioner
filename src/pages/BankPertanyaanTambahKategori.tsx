import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import QuestionCategoryForm from "@/components/bank-pertanyaan/QuestionCategoryForm"

export default function BankPertanyaanTambahKategoriPage() {
    return (

        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Tambah kategori</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Tambah Kategori</CardTitle>
                </CardHeader>
                <CardContent>
                    <QuestionCategoryForm />
                </CardContent>
            </Card>
        </div>
    )
}
