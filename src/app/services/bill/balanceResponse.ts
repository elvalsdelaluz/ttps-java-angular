export interface BalanceResponse {
    email:string
    deudas: Deuda[]
}


export interface Deuda {
    email: string,
    monto: number
}
