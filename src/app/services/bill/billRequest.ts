export interface BillRequest {
    monto:number,
    categoria:string,
    idUsuario: string,
    formaPago:string
}


export interface BillSummary {
    idUser: string,
    monto: number
}