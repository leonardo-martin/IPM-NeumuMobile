import { UserRole } from './UserRole'

export interface TokenModel {
    user: string
    userId: number
    userRole: UserRole[]
    exp: number
    iat: number
}
