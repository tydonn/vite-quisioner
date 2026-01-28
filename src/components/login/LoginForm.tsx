import { useState } from "react"
import { EyeIcon, EyeOffIcon, MailIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"

import api from "@/lib/api"

import { useAuth } from "@/contexts/AuthContext"

export default function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const { fetchUser } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await api.post("/login", {
                email,
                password,
            })

            // simpan token & user
            localStorage.setItem("token", res.data.token)
            await fetchUser()
            navigate("/dashboard")
        } catch (err: any) {
            alert("Email atau password salah")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <InputGroup>
                    <InputGroupInput
                        id="email"
                        type="email"
                        placeholder="nama@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <InputGroupAddon>
                        <MailIcon className="h-4 w-4" />
                    </InputGroupAddon>
                </InputGroup>
                <FieldDescription>Gunakan email yang terdaftar</FieldDescription>
            </Field>

            {/* Password */}
            <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <InputGroup>
                    <InputGroupInput
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <InputGroupAddon
                        align="inline-end"
                        className="cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeOffIcon className="h-4 w-4" />
                        ) : (
                            <EyeIcon className="h-4 w-4" />
                        )}
                    </InputGroupAddon>
                </InputGroup>
                <FieldDescription>Minimal 8 karakter</FieldDescription>
            </Field>

            {/* Action */}
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Memproses..." : "Masuk"}
            </Button>
        </form>
    )
}
