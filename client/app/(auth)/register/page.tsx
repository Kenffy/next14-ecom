import { RegisterPage } from "@/features/auth-page/register";

export const metadata = {
    title: "Register",
    description: "Register page",
};

export default async function Login() {
    return (
        <main className="h-screen flex items-center justify-center">
            <RegisterPage />
        </main>
    )
}