"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { University, MaterialType, NoteCategory } from "@/lib/database.types";
import {
    UNIVERSITIES,
    MATERIAL_TYPES,
    NOTE_CATEGORIES,
    SEMESTERS,
    YEARS,
    MAX_FILE_SIZE,
} from "@/lib/constants";
import { formatFileSize, generateFileName } from "@/lib/utils";

interface FormData {
    title: string;
    description: string;
    university: University | "";
    materialType: MaterialType | "";
    noteCategory: NoteCategory | "";
    subject: string;
    semester: string;
    year: string;
    chapter: string;
}

const initialFormData: FormData = {
    title: "",
    description: "",
    university: "",
    materialType: "",
    noteCategory: "",
    subject: "",
    semester: "",
    year: "",
    chapter: "",
};

export function UploadForm() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (selectedFile.type !== "application/pdf") {
            toast.error("Only PDF files are allowed");
            return;
        }

        if (selectedFile.size > MAX_FILE_SIZE) {
            toast.error(`File size must be less than ${formatFileSize(MAX_FILE_SIZE)}`);
            return;
        }

        setFile(selectedFile);
    };

    const removeFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            toast.error("Please select a file");
            return;
        }

        if (!formData.title || !formData.university || !formData.materialType || !formData.subject) {
            toast.error("Please fill in all required fields");
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            const supabase = createClient();

            // Generate unique filename
            const fileName = generateFileName(formData.title, "pdf");
            const filePath = `materials/${formData.university}/${fileName}`;

            // Upload file to Supabase Storage
            setUploadProgress(20);
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("materials")
                .upload(filePath, file, {
                    cacheControl: "3600",
                    upsert: false,
                });

            if (uploadError) {
                throw new Error(uploadError.message);
            }

            setUploadProgress(60);

            // Get public URL
            const { data: publicUrlData } = supabase.storage
                .from("materials")
                .getPublicUrl(filePath);

            const fileUrl = publicUrlData.publicUrl;

            // Insert material record
            setUploadProgress(80);
            const { error: insertError } = await supabase.from("materials").insert({
                title: formData.title,
                description: formData.description || null,
                university: formData.university as University,
                material_type: formData.materialType as MaterialType,
                note_category: formData.noteCategory as NoteCategory || null,
                subject: formData.subject,
                semester: formData.semester ? parseInt(formData.semester) : null,
                year: formData.year ? parseInt(formData.year) : null,
                chapter: formData.chapter || null,
                file_url: fileUrl,
                file_name: fileName,
                file_size: file.size,
            });

            if (insertError) {
                throw new Error(insertError.message);
            }

            setUploadProgress(100);
            toast.success("Material uploaded successfully!");

            // Reset form
            setFormData(initialFormData);
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            // Redirect to materials list
            router.push("/admin/materials");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error(error instanceof Error ? error.message : "Upload failed");
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <Card>
                <CardContent className="pt-6">
                    <Label className="mb-2 block">PDF File *</Label>
                    {file ? (
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                                <FileText className="h-8 w-8 text-primary" />
                                <div>
                                    <p className="text-sm font-medium">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatFileSize(file.size)}
                                    </p>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={removeFile}
                                disabled={uploading}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                        >
                            <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                            <p className="text-sm font-medium">Click to upload PDF</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Max file size: {formatFileSize(MAX_FILE_SIZE)}
                            </p>
                        </div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </CardContent>
            </Card>

            {/* Material Details */}
            <Card>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                                placeholder="e.g., Data Structures Unit 1 Notes"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject *</Label>
                            <Input
                                id="subject"
                                value={formData.subject}
                                onChange={(e) => handleChange("subject", e.target.value)}
                                placeholder="e.g., Data Structures"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            placeholder="Brief description of the material"
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>University *</Label>
                            <Select
                                value={formData.university}
                                onValueChange={(value) => handleChange("university", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select university" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(UNIVERSITIES).map(([key, uni]) => (
                                        <SelectItem key={key} value={key}>
                                            {uni.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Material Type *</Label>
                            <Select
                                value={formData.materialType}
                                onValueChange={(value) => handleChange("materialType", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(MATERIAL_TYPES).map(([key, type]) => (
                                        <SelectItem key={key} value={key}>
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {formData.materialType === "notes" && (
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Note Category</Label>
                                <Select
                                    value={formData.noteCategory}
                                    onValueChange={(value) => handleChange("noteCategory", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(NOTE_CATEGORIES).map(([key, name]) => (
                                            <SelectItem key={key} value={key}>
                                                {name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="chapter">Chapter (if chapter-wise)</Label>
                                <Input
                                    id="chapter"
                                    value={formData.chapter}
                                    onChange={(e) => handleChange("chapter", e.target.value)}
                                    placeholder="e.g., Chapter 1"
                                />
                            </div>
                        </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Semester</Label>
                            <Select
                                value={formData.semester}
                                onValueChange={(value) => handleChange("semester", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select semester" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SEMESTERS.map((sem) => (
                                        <SelectItem key={sem} value={sem.toString()}>
                                            Semester {sem}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {formData.materialType === "pyq" && (
                            <div className="space-y-2">
                                <Label>Year</Label>
                                <Select
                                    value={formData.year}
                                    onValueChange={(value) => handleChange("year", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {YEARS.map((year) => (
                                            <SelectItem key={year} value={year.toString()}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Progress Bar */}
            {uploading && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                </div>
            )}

            <Button type="submit" className="w-full" disabled={uploading || !file}>
                {uploading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                    </>
                ) : (
                    <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Material
                    </>
                )}
            </Button>
        </form>
    );
}
