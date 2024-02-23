import { BillSummary } from "../../services/bill/billRequest";

export interface Gasto{
    id: string;
    monto: number,
    usuario: any,
    formaDivision: any,
    //categoria: any,
    fechaCreacion: any,
    participantes: BillSummary[]
    
}