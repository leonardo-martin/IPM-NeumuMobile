import { UserPatientData, UserDoctorData } from "@models/User"
import { UseFormReturn } from "react-hook-form"

export interface RegisterParams {
    type: number
}

interface SignUpExtra {
    onSubmit: (data: UserPatientData | UserDoctorData) => void
    register?: RegisterParams
}

export interface PatientSignUpProps extends SignUpExtra {
    form: UseFormReturn<UserPatientData, any>
    
}

export interface DoctorSignUpProps extends SignUpExtra {
    form: UseFormReturn<UserDoctorData, any>
}