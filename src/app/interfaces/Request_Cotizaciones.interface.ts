import { itemsCotizacion } from "./ItemsCotizacion.interface";

export interface Request_Cotizaciones{
    folio_cotizacion?: string;
    fecha_generacion_desde?: string;
    fecha_generacion_hasta?: string;
    cliente?: string;
    estatus?: string;
}

export interface Request_cotizacion_save{
    cliente_prospecto: any;
    tipo_cliente: string;
    tipo_proceso: string;
    precios: string;
    vendedor: string;
    cotizacion_array: itemsCotizacion[];
    total: number;
    impuestos: number;
    gran_total: number;
}