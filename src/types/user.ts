export interface User {
    userId: number,
    username: string,
    email: string,
    phone: string,
    gender?: boolean
    token?: string
    group: undefined
}