import { useState } from "react"
import { EyeIcon, EyeOffIcon, MailIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Link } from "react-router-dom"

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <form className="space-y-5">
            {/* Email */}
            <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <InputGroup>
                    <InputGroupInput
                        id="email"
                        type="email"
                        placeholder="nama@email.com"
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
            <Button type="submit" className="w-full">
                <Link to="/dashboard">Masuk</Link>

            </Button>
        </form>
    )
}
