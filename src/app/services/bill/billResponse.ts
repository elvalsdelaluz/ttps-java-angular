export interface BillResponse {
    id:string
    monto:number,
    fechaCreacion: Date,
    usuario:Usuario,
    formaDivision:string,
    categoria:any,
    participantes: Deuda[]
}


export interface Deuda {
    id:string,
    monto: number,
    usuario: Usuario
}

export interface Usuario {
    id:string,
    apellido:string,
    nombre:string,
    email:string,
    fechaCreacion:Date
}