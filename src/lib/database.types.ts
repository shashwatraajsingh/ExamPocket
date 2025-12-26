export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type University = 'aktu' | 'abes_ec' | 'akgec' | 'kiet'
export type MaterialType = 'notes' | 'pyq'
export type NoteCategory = 'chapter_wise' | 'subject_wise'

export interface Database {
    public: {
        Tables: {
            materials: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    university: University
                    material_type: MaterialType
                    note_category: NoteCategory | null
                    subject: string
                    semester: number | null
                    year: number | null
                    chapter: string | null
                    file_url: string
                    file_name: string
                    file_size: number
                    thumbnail_url: string | null
                    download_count: number
                    view_count: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    university: University
                    material_type: MaterialType
                    note_category?: NoteCategory | null
                    subject: string
                    semester?: number | null
                    year?: number | null
                    chapter?: string | null
                    file_url: string
                    file_name: string
                    file_size: number
                    thumbnail_url?: string | null
                    download_count?: number
                    view_count?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    university?: University
                    material_type?: MaterialType
                    note_category?: NoteCategory | null
                    subject?: string
                    semester?: number | null
                    year?: number | null
                    chapter?: string | null
                    file_url?: string
                    file_name?: string
                    file_size?: number
                    thumbnail_url?: string | null
                    download_count?: number
                    view_count?: number
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            subjects: {
                Row: {
                    id: string
                    name: string
                    code: string | null
                    university: University
                    semester: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    code?: string | null
                    university: University
                    semester: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    code?: string | null
                    university?: University
                    semester?: number
                    created_at?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            increment_download_count: {
                Args: { material_id: string }
                Returns: void
            }
            increment_view_count: {
                Args: { material_id: string }
                Returns: void
            }
        }
        Enums: {
            university_type: University
            material_type_enum: MaterialType
            note_category_enum: NoteCategory
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

export type Material = Database['public']['Tables']['materials']['Row']
export type MaterialInsert = Database['public']['Tables']['materials']['Insert']
export type MaterialUpdate = Database['public']['Tables']['materials']['Update']
export type Subject = Database['public']['Tables']['subjects']['Row']
export type SubjectInsert = Database['public']['Tables']['subjects']['Insert']
