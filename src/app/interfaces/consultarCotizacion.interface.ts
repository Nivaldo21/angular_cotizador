interface CotizacionDetalleItem {
    folio_cotizacion: number;
    id_parte: number;
    codigo_parte: string;
    cav: number;
    machine_type: string;
    costo_hora_maquina: string;
    ciclos: number;
    pcs_hora: string;
    porc_ineficiencia: string;
    production: string;
    margin4: string;
    packing_cost: string;
    pcs_packing: number;
    packing: string;
    pcs_entrega: number;
    flete_cost: string;
    logistic_cost: string;
    packing_outside_service: string;
    hr_mantto: number;
    cost_hr_mtto: string;
    pcs_mtto: number;
    tooling_maintance: string;
    ovh_ind_porc: string;
    overhead: string;
    overhead_margin: string;
    profit_porc: string;
    profit: string;
    margin_profit: string;
    unit_price: string;
    margin_total: string;
    total_materias_primas: string;
    materias_primas_porc: string;
    total_produccion: string;
    produccion_porc: string;
    total_empaque_logistica: string;
    empaque_logistica_porc: string;
    total_mantenimiento: string;
    mantenimiento_porc: string;
    kg_material: string;
    moq: number;
    eau: number;
    total: string;
    ingresos: string;
    costo_ventas: string;
    costo_materia_prima: string;
    costo_mano_obra: string;
    gastos_fabricacion: string;
    utilidad_bruta: string;
    egresos: string;
    gastos_fijos: string;
    utilidad_antes_ebitda: string;
    isr: string;
    ptu: string;
    utilidad_neta: string;
    margen_neto: string;
}

interface CotizacionMaterialesItem {
    folio_cotizacion: number;
    id_parte: number;
    id_material: number;
    codigo_material: string;
    supplier_resin: string;
    part_g: string;
    runner_porc: string;
    runner_g: string;
    loss_porc: string;
    weigth: string;
    resin_basis: string;
    ovh_cost_porc: string;
    resin_cot: string;
    total_mat: string;
    gk_porc: string;
    gk: string;
    scrap_porc: string;
    margin_scrap: string;
    margin2: string;
    porc_margin_seguridad: string;
    margin_seguridad: string;
    total_mat_prima: string;
}

export interface CotizacionData {
    cotizacion: {
        folio_cotizacion: number;
        fecha_generacion: string;
        clase_cliente: string;
        codigo_cliente_prospecto: string;
        tipo_cliente: string;
        tipo_proceso: string;
        tipo_precio: string;
        total: string;
        estatus: string;
        codigo_vendedor: number;
    };
    cotizacion_items: Array<{
        cotizacion_detalle_item: CotizacionDetalleItem;
        cotizacion_mteriales_items: CotizacionMaterialesItem[];
    }>;
}
