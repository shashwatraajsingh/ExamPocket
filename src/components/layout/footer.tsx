import Link from "next/link";
import { BookOpen, Github, Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t bg-muted/40">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                <BookOpen className="h-4 w-4 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-semibold tracking-tight">
                                Exam<span className="text-muted-foreground">Pocket</span>
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Your one-stop destination for engineering study materials.
                            Free notes and PYQs for all semesters.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/notes" className="hover:text-foreground transition-colors">
                                    Notes
                                </Link>
                            </li>
                            <li>
                                <Link href="/pyqs" className="hover:text-foreground transition-colors">
                                    Previous Year Questions
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Universities */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold">Universities</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/notes?university=aktu" className="hover:text-foreground transition-colors">
                                    AKTU
                                </Link>
                            </li>
                            <li>
                                <Link href="/notes?university=abes_ec" className="hover:text-foreground transition-colors">
                                    ABES EC
                                </Link>
                            </li>
                            <li>
                                <Link href="/notes?university=akgec" className="hover:text-foreground transition-colors">
                                    AKGEC
                                </Link>
                            </li>
                            <li>
                                <Link href="/notes?university=kiet" className="hover:text-foreground transition-colors">
                                    KIET
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold">Connect</h3>
                        <div className="flex space-x-4">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} ExamPocket. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
