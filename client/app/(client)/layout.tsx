
import Footer from "@/components/Footer";
import Navbar from "@/components/nav-bar/Navbar";
import { AuthenticatedProviders } from "@/features/globals/providers";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Temosco Shop",
    description: "Temosco Shop",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthenticatedProviders>
            <div className={cn("flex flex-col flex-1 items-stretch min-h-screen")}>
                <Navbar />
                <div className="flex-1 flex">{children}</div>
                <Footer />
            </div>
        </AuthenticatedProviders>
    );
}
