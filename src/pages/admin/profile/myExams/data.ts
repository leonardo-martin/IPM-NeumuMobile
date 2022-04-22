import { Exam } from "@models/Exam"

export const data: Exam[] = [
    {
        id: 1,
        patientId: 1,
        examType: 'Exame 1',
        examDate: new Date(2022, 1, 2),
        documentId: 1,
        examResultDate: new Date(),
        data: {
            examDescription: ''
        }
    },
    {
        id: 2,
        patientId: 2,
        examType: 'Exame 2',
        examDate: new Date(2022, 3, 4),
        documentId: 12,
        examResultDate: new Date(),
        data: {
            examDescription: ''
        }
    },
    {
        id: 3,
        patientId: 3,
        examType: 'Exame 3',
        examDate: new Date(2022, 0, 10),
        documentId: 123,
        examResultDate: new Date(),
        data: {
            examDescription: ''
        }
    },
    {
        id: 4,
        patientId: 4,
        examType: 'Exame 4',
        examDate: new Date(2021, 11, 12),
        documentId: 1234,
        examResultDate: new Date(),
        data: {
            examDescription: ''
        }
    }
]