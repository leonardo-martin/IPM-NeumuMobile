export class AbrafeuOptInDto {
    id!: number
    patientId!: number
    optIn!: boolean
    formAvailable!: boolean
}

export enum AbrafeuOptInStatus {
    NOT_REQUESTED = "not requested",
    AVAILABLE = "available",
    NOT_AVAILABLE = "not available"
}

export class AbrafeuFormDto {
    id!: number
    patientId!: number
    postingUserId!: number

    geneticTestResult!: string
    clinicDiagnostic!: string
    bestMotorFunction!: string
    wheelchairUse!: string
    nonInvasiveVentilation!: string
    invasiveVentilation!: string
    symptomsAgeStart!: string
    dvrDiagnostic!: string
    lossOfHearing!: string
    scapularFixing!: string
    gravidez!: string | null
    positiveFamilyHistory!: string
    ethnicity!: string
    anotherFSHDRegistry!: string
}

export class AbrafeuFormSelfReportDto {
    id!: number
    patientId!: number

    geneticTestResultSelfReport!: string
    symptomsSelfReport!: string
    bestMotorFunctionSelfReport!: string
    wheelchairUseSelfReport!: string
    nonInvasiveVentilationSelfReport!: string
    invasiveVentilationSelfReport!: string
    symptomsAgeStartSelfReport!: string
    dvrDiagnosticSelfReport!: string
    lossOfHearingSelfReport!: string
    scapularFixingSelfReport!: string
    gravidezSelfReport!: string | null
    positiveFamilyHistorySelfReport!: string
    ethnicitySelfReport!: string
    anotherFSHDRegistrySelfReport!: string
}

