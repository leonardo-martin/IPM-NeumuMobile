import { Exam } from "@models/Exam"

export const data: Exam[] = [
    {
        id: 1,
        patientId: '1',
        examType: 'Exame 1',
        examDescription: 'Oil - SesameSesameSesameSesameSesameSesameSesameSesameSesameSesameSesame',
        examDate: new Date(2022, 1, 2),
        documentId: 1,
        examResultDate: new Date(),
        shortenedDescription: 'Oil - SesameSesameSesameSesameSesameSesameSesameSesameSesameSesameSesame',
        dateToString: '02/02/2022'
    },
    {
        id: 2,
        patientId: '2',
        examType: 'Exame 2',
        examDescription: 'Oil - Sesame',
        examDate: new Date(2022, 3, 4),
        documentId: 12,
        examResultDate: new Date(),
        shortenedDescription: 'Oil - Sesame',
        dateToString: '04/04/2022'
    },
    {
        id: 3,
        patientId: '3',
        examType: 'Exame 3',
        examDescription: 'Oil - Sesame',
        examDate: new Date(2022, 0, 10),
        documentId: 123,
        examResultDate: new Date(),
        shortenedDescription: 'Oil - Sesame',
        dateToString: '10/01/2022'
    },
    {
        id: 4,
        patientId: '4',
        examType: 'Exame 4',
        examDescription: 'Oil - Sesame',
        examDate: new Date(2021, 11, 12),
        documentId: 1234,
        examResultDate: new Date(),
        shortenedDescription: 'Oil - Sesame',
        dateToString: '12/12/2021'
    }
]