export interface FormPdf {
    tipo_documento: string;
    condiciones_empaqueEstandar: boolean;
    condiciones_materiaPrima: boolean;
    condiciones_OCmoq: boolean;
    condiciones_EntregaCliente: boolean;
    tiempo_entrga: string;
    condiciones_pago: string;
    vigencia: string;
    num_cotizacion?: string;
}