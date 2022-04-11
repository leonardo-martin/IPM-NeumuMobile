import { UserPatientData, UserDoctorData } from "@models/User"
import { UseFormReturn } from "react-hook-form"

export interface RegisterParams {
    type: number
}

interface SignUpFuncs {
    onSubmit: (data: UserPatientData | UserDoctorData) => void
    register: RegisterParams
}

export interface PatientSignUpProps extends SignUpFuncs {
    form: UseFormReturn<UserPatientData, any>
    
}

export interface DoctorSignUpProps extends SignUpFuncs {
    form: UseFormReturn<UserDoctorData, any>
}