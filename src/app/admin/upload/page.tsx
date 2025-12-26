import { UploadForm } from "@/components/admin/upload-form";

export default function UploadPage() {
    return (
        <div className="max-w-2xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Upload Material</h1>
                <p className="text-muted-foreground">
                    Upload notes or previous year questions
                </p>
            </div>
            <UploadForm />
        </div>
    );
}
