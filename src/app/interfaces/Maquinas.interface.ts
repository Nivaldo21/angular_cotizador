export default interface request_Maquinas{
    tipo_proceso: string;
}

export interface Maquinas_response{
    machine_type?: string;
    costo_hora?: number;
    tipo_proceso?: string;
}