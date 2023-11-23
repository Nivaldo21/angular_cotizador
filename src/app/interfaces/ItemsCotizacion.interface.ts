import MateriaPrima from "./MateriaPrima.interface";

export interface itemsCotizacion{
    codigo_parte?:string;
    descripcion_parte?: string;
    flag_nueva_parte?:boolean;
    cav?:string;
    materias_primas?: MateriaPrima[];
    total_materia_prima: number;
    total_materia_prima_gk: number;
    total_materia_prima_margen_seguridad: number;
    total_materia_prima_margin_2: number;
    total_materia_prima_parte_g: number;

    tipo_maquina?: string;
    costo_hora_maquina?:number;
    cyclus?: string;
    pcs_hr?: string;
    ineficiencia_porcentaje?: string;
    production?: string;
    margin_4?: string;
    
    packing_cost?: string;
    pcs_packing?: string;
    packing?: string;
    pcs_entrega?: string;
    costo_flete?: string;
    costo_logistico?: string;
    packing_and_outside_service?: string;

    hr_mtto?: string;
    cost_hr?: string;
    pcs_mantto?: string;
    tooling_mantiance?: string;

    percent_overhead?: string;
    overhead?: string;
    margin_overhead?: string;
    percent_proffit?: string;
    proffit?: string;
    margin_profit?: string;
    unit_price: any;
    margin_total?: string;

    kg_material?: string;
    moq?: string;
    eau?: string;
    total?: string;

    tabla_total_produccion?: number;
    tabla_produccion_porc?:  number;
    tabla_total_empaque_logistica?:  number;
    tabla_empaque_logistica_porc?:  number;
    tabla_total_mantenimiento?:  number;
    tabla_mantenimiento_porc?:  number;
}