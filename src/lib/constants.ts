import { University, MaterialType, NoteCategory } from './database.types'

export const UNIVERSITIES: Record<University, { name: string; fullName: string; color: string }> = {
    aktu: {
        name: 'AKTU',
        fullName: 'Dr. A.P.J. Abdul Kalam Technical University',
        color: '#2563eb'
    },
    abes_ec: {
        name: 'ABES EC',
        fullName: 'ABES Engineering College',
        color: '#7c3aed'
    },
    akgec: {
        name: 'AKGEC',
        fullName: 'Ajay Kumar Garg Engineering College',
        color: '#059669'
    },
    kiet: {
        name: 'KIET',
        fullName: 'KIET Group of Institutions',
        color: '#dc2626'
    }
}

export const MATERIAL_TYPES: Record<MaterialType, { name: string; icon: string }> = {
    notes: {
        name: 'Notes',
        icon: 'FileText'
    },
    pyq: {
        name: 'Previous Year Questions',
        icon: 'ClipboardList'
    }
}

export const NOTE_CATEGORIES: Record<NoteCategory, string> = {
    chapter_wise: 'Chapter Wise',
    subject_wise: 'Subject Wise'
}

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const

export const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i)

export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export const ACCEPTED_FILE_TYPES = {
    'application/pdf': ['.pdf']
}

export const APP_NAME = 'ExamPocket'
export const APP_DESCRIPTION = 'Your one-stop destination for AKTU, ABES EC, AKGEC, and KIET study materials. Access chapter-wise notes, subject notes, and previous year questions.'
