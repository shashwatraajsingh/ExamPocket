import Link from "next/link";
import {
  BookOpen,
  FileText,
  ClipboardList,
  GraduationCap,
  ArrowRight,
  Search,
  Download,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UNIVERSITIES } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="container mx-auto px-4 py-24 sm:py-32 relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium">
              <span className="mr-2">📚</span>
              Free Study Materials for Engineering Students
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Your Study Materials,{" "}
              <span className="text-muted-foreground">One Place</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Access chapter-wise notes, subject notes, and previous year questions
              for AKTU, ABES EC, AKGEC, and KIET. All materials available for free.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/notes">
                  <FileText className="mr-2 h-4 w-4" />
                  Browse Notes
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/pyqs">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  View PYQs
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Everything You Need to Succeed
            </h2>
            <p className="mt-4 text-muted-foreground">
              Organized study materials designed to help you ace your exams.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<FileText className="h-6 w-6" />}
              title="Chapter-wise Notes"
              description="Detailed notes organized by chapters for in-depth understanding."
            />
            <FeatureCard
              icon={<BookOpen className="h-6 w-6" />}
              title="Subject Notes"
              description="Complete subject notes for each semester and course."
            />
            <FeatureCard
              icon={<ClipboardList className="h-6 w-6" />}
              title="Previous Year Questions"
              description="Year-wise PYQs to understand exam patterns and prepare effectively."
            />
            <FeatureCard
              icon={<Eye className="h-6 w-6" />}
              title="In-App PDF Viewer"
              description="View all materials directly in browser without downloading."
            />
          </div>
        </div>
      </section>

      {/* Universities Section */}
      <section className="border-t">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Supported Universities & Colleges
            </h2>
            <p className="mt-4 text-muted-foreground">
              Materials available for top engineering institutions.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(UNIVERSITIES).map(([key, university]) => (
              <Link key={key} href={`/notes?university=${key}`}>
                <Card className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
                  <CardHeader className="pb-2">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-3"
                      style={{ backgroundColor: `${university.color}15` }}
                    >
                      <GraduationCap
                        className="h-6 w-6"
                        style={{ color: university.color }}
                      />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {university.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {university.fullName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      View Materials
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <StatCard number="4" label="Universities" />
            <StatCard number="8" label="Semesters" />
            <StatCard number="100+" label="Subjects" />
            <StatCard number="Free" label="Forever" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Ready to Start Learning?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Access all study materials for free. No registration required.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/notes">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="pb-2">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 text-primary">
          {icon}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold tracking-tight sm:text-4xl">
        {number}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
