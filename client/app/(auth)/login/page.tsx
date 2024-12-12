import { LoginPage } from "@/features/auth-page/login";

export const metadata = {
    title: "Login",
    description: "Login page",
};


export default async function Login() {
    return (
        <main className="h-screen flex items-center justify-center">
            <LoginPage />
        </main>
    )
}