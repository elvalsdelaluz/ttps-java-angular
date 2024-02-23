export interface BillRequest {
    monto:number,
    miembro:string,
    formapago:string,
    interests: BillSummary[]
}


export interface BillSummary {
    user_id: string,
    deuda: number
}