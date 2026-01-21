import LoginForm from "@/components/login/LoginForm";


export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
            <div className="w-full max-w-md rounded-xl border bg-background p-6 shadow-sm">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-semibold">Login</h1>
                    <p className="text-sm text-muted-foreground">
                        Masuk ke sistem Quisioner
                    </p>
                </div>

                <LoginForm />
            </div>
        </div>
    )
}
