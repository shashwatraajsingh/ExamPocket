"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BookOpen,
    LayoutDashboard,
    Upload,
    FileText,
    Settings,
    LogOut,
    Menu,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { AdminAuth } from "./admin-auth";

const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Upload", href: "/admin/upload", icon: Upload },
    { name: "Materials", href: "/admin/materials", icon: FileText },
];

interface AdminLayoutProps {
    children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const authStatus = localStorage.getItem("admin_authenticated");
        if (authStatus === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("admin_authenticated");
        setIsAuthenticated(false);
    };

    if (!isAuthenticated) {
        return <AdminAuth onSuccess={() => setIsAuthenticated(true)} />;
    }

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Top Bar */}
            <header className="sticky top-0 z-50 border-b bg-background">
                <div className="flex h-14 items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild className="lg:hidden">
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-64 p-0">
                                <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
                                <Sidebar onNavigate={() => setOpen(false)} />
                            </SheetContent>
                        </Sheet>
                        <Link href="/admin" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                <BookOpen className="h-4 w-4 text-primary-foreground" />
                            </div>
                            <span className="font-semibold">
                                ExamPocket <span className="text-muted-foreground">Admin</span>
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/" target="_blank">
                                View Site
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleLogout}>
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-64 border-r bg-background min-h-[calc(100vh-56px)]">
                    <Sidebar />
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full py-4">
            <nav className="flex-1 px-3">
                <ul className="space-y-1">
                    {navigation.map((item) => (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                onClick={onNavigate}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    pathname === item.href
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}
