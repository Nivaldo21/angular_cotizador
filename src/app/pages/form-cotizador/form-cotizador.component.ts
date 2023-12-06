import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { itemsCotizacion } from 'src/app/interfaces/ItemsCotizacion.interface';
import request_Maquinas, { Maquinas_response } from 'src/app/interfaces/Maquinas.interface';
import MateriaPrima from 'src/app/interfaces/MateriaPrima.interface';
import Request_ParamIndustria from 'src/app/interfaces/Params_Industria.interace';
import { Request_cotizacion_save } from 'src/app/interfaces/Request_Cotizaciones.interface';
import { CotizacionData } from 'src/app/interfaces/consultarCotizacion.interface';
import { CotizadorService } from 'src/app/services/cotizador.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-form-cotizador',
  templateUrl: './form-cotizador.component.html',
  styleUrls: ['./form-cotizador.component.css']
})
export class FormCotizadorComponent {

  @Input() action?:boolean;
  @Input() cot?:string;

  @ViewChild('botonStart') botonStartRef: ElementRef | undefined;
  
  clienteOptions:any[] = [];
  selectedCliente:any = null;

  vendedoresOptions:any[] = [];
  selectedVendedor:any = null;

  precio_selected:string = '';
  proceso_selected:string = '';
  cliente_selected:string = '';

  partesOptions:any[] = [];
  selectedParte_codigo:any = null;
  selectedParte_descripcion:any = null;

  materialesOptions:any[] = [];
  form_materiaPrima: FormGroup;
  array_materiaPrimas: MateriaPrima[] = [];

  cav:any = null;

  form_maquina: FormGroup;
  opcionesMaquinas:Maquinas_response[]=[];

  form_empaqueEntrega: FormGroup;

  form_mantenimientoHerramental: FormGroup;

  form_totalesPiezas: FormGroup;
  
  form_totales:FormGroup;

  array_items_cotizacion:itemsCotizacion[] = [];

  total_cotizacion: number = 0;
  impuetsos_cotizacion:number = 0;
  gran_total_cotizacion: number= 0;

  dataConsult_items:CotizacionData[] =[];

  form_pdf: FormGroup; 

  constructor(private cotizadorService:CotizadorService, private fb: FormBuilder, private toast:ToastService, private route:Router){
    this.form_materiaPrima = this.fb.group({
      codigo_materia_prima:[null, [Validators.required]],
      descripcion_materia_prima:[null, [Validators.required]],
      SUPPLIER_RESIN:['', [Validators.required,Validators.maxLength(100)]],
      parte_g:['',[Validators.required,Validators.pattern(/^\d{1,7}(\.\d{1,4})?$/)]],
      RUNNER_percent:['',[Validators.required,Validators.pattern(/^\d{0,2}(\.\d{1,4})?$/)]],
      RUNNER_g:['',[Validators.required,Validators.pattern(/^\d{1,7}(\.\d{1,4})?$/)]],
      loss_percent:['',[Validators.required,Validators.pattern(/^\d{0,2}(\.\d{1,4})?$/)]],
      weigth:['',[Validators.required,Validators.pattern(/^\d{1,7}(\.\d{1,4})?$/)]],
      resin_basis:['',[Validators.required,Validators.pattern(/^\d{1,7}(\.\d{1,4})?$/)]],
      overhead_cost:['',[Validators.required,Validators.pattern(/^\d{0,2}(\.\d{1,4})?$/)]],
      resin_cot:['',[Validators.required,Validators.pattern(/^\d{1,7}(\.\d{1,4})?$/)]],
      total_mat:['',[Validators.required,Validators.pattern(/^\d{0,2}(\.\d{1,4})?$/)]],
      GK_percent:['',[Validators.required,Validators.pattern(/^\d{0,2}(\.\d{1,4})?$/)]],
      GK:['',[Validators.required,Validators.pattern(/^\d{1,7}(\.\d{1,4})?$/)]],
      scrap_percent:['',[Validators.required,Validators.pattern(/^\d{0,2}(\.\d{1,4})?$/)]],
      margin_scrap:['',[Validators.required,Validators.pattern(/^\d{1,7}(\.\d{1,4})?$/)]],
      margin_2:['',[Validators.required,Validators.pattern(/^\d{1,7}(\.\d{1,4})?$/)]],
      margen_seguridad_percent:['',[Validators.required,Validators.pattern(/^\d{0,2}(\.\d{1,4})?$/)]],
      margen_seguridad:['',[Validators.required,Validators.pattern(/^\d{1,7}(\.\d{1,4})?$/)]],
    });

    this.form_maquina = this.fb.group({
      seletcedMaquina :[{}, [Validators.required]],
      precioMaquina :['', [Validators.required,Validators.pattern(/^\d{1,7}(\.\d{1,4})?$/)]],
      ciclo :['', [Validators.required]],
      pcs_hr :['', [Validators.required,Validators.pattern(/^\d{1,7}(\.\d{1,4})?$/)]],
      production :['', [Validators.required,Validators.pattern(/^\d{1,7}(\.\d{1,4})?$/)]],
      ineficiencia_percent :['', [Validators.required,Validators.pattern(/^\d{0,2}(\.\d{1,4})?$/)]],
      margin_4 :['', [Validators.required,Validators.pattern(/^\d{1,7}(\.\d{1,4})?$/)]],
    });

    this.form_empaqueEntrega = this.fb.group({
      packing_cost:['',[Validators.required,Validators.pattern(/^\d{1,7}(\.\d{1,4})?$/)]],
      parking_pcs:['',[Validators.required]],
      packing:['',[Validators.required,Validators.pattern(/^\d{1,7}(\.\d{1,4})?$/)]],
      pcs_entrega:['',[Validators.required]],
      costo_flete:['',[Validators.required,Validators.pattern(/^\d{1,7}(\.\d{1,4})?$/)]],
      costo_logistico:['',[Validators.required,Validators.pattern(/^\d{1,7}(\.\d{1,4})?$/)]],
      packing_outside_service:['',[Validators.required,Validators.pattern(/^\d{1,7}(\.\d{1,4})?$/)]]
    });

    this.form_mantenimientoHerramental = this.fb.group({
      hr_mantto: [null,[Validators.required,Validators.pattern(/^\d{1,7}(\.\d{1,4})?$/)]],
      precioMaquina: [null,[Validators.required]],
      pcs_mtto: [null,[Validators.required]],
      tooling_maintance: [null,[Validators.required,Validators.pattern(/^\d{1,7}(\.\d{1,4})?$/)]],
    });

    this.form_totalesPiezas = this.fb.group({
      ovh_ind_porc: ['',[Validators.required,Validators.pattern(/^\d{0,2}(\.\d{1,4})?$/)]],
      overhead: ['',[Validators.required,Validators.pattern(/^\d{1,7}(\.\d{1,4})?$/)]],
      margin_overhead: ['',[Validators.required,Validators.pattern(/^\d{1,7}(\.\d{1,4})?$/)]],
      profitt_percent: ['',[Validators.required,Validators.pattern(/^\d{0,2}(\.\d{1,4})?$/)]],
      profitt: ['',[Validators.required,Validators.pattern(/^\d{1,7}(\.\d{1,4})?$/)]],
      margin_profitt: ['',[Validators.required,Validators.pattern(/^\d{1,7}(\.\d{1,4})?$/)]],
      unit_price: ['',[Validators.required,Validators.pattern(/^\d{1,7}(\.\d{1,4})?$/)]],
      margin_total: ['',[Validators.required,Validators.pattern(/^\d{1,7}(\.\d{1,4})?$/)]],
    });

    this.form_totales = this.fb.group({
      kg_material: ['',[Validators.required,Validators.pattern(/^\d{1,7}(\.\d{1,4})?$/)]],
      moq: ['',[Validators.required]],
      eau: ['',[Validators.required]],
      total: ['',[Validators.required,Validators.pattern(/^\d{1,7}(\.\d{1,4})?$/)]],
    });
    this.form_pdf = this.fb.group({
      tipo_documento: [null,[Validators.required]],
      condiciones_empaqueEstandar: [false,[]],
      condiciones_materiaPrima: [false,[]],
      condiciones_OCmoq: [false,[]],
      condiciones_EntregaCliente: [false,[]],
      tiempo_entrga: ['',[Validators.required]],
      condiciones_pago: ['',[Validators.required]],
      vigencia: ['',[Validators.required]]
    })
  }

  ngAfterViewInit() {
    if (this.botonStartRef) {
      const botonSalirElement: HTMLButtonElement = this.botonStartRef.nativeElement;
      botonSalirElement.addEventListener('click', () => { 
        this.form_pdf.reset();
      });
    }
  }

  ngOnInit(): void {
    this.initCombos();
    if (this.action) {
      this.form_maquina.disable();
      this.form_empaqueEntrega.disable();
      this.form_mantenimientoHerramental.disable();
      this.form_totalesPiezas.disable();
      this.form_totales.disable();
      this.cotizadorService.getDeatalleCotizacion(this.cot ? this.cot : '').subscribe((resp:any)=>{
        this.setData(resp);
      });
    }
  }

  checkItem(item:any){
    this.array_materiaPrimas = [];
    console.log(item);
    this.selectedParte_codigo = item.codigo_parte;
    this.selectedParte_descripcion = item.descripcion_parte;
    this.cav = item.cav;

    item.materias_primas.forEach((element:any) =>{
      const obj = this.materialesOptions.find(item => item.codigo_material == element.codigo_material)
      this.array_materiaPrimas.push({
        codigo_materia_prima: element.codigo_material,
        descripcion_materia_prima: obj.nombre_material,
        SUPPLIER_RESIN: element.supplier_resin,
        parte_g: element.part_g,
        RUNNER_percent: element.runner_porc,
        RUNNER_g: element.runner_g,
        loss_percent: element.loss_porc,
        weigth: element.weigth,
        resin_basis: element.resin_basis,
        overhead_cost: element.ovh_cost_porc,
        resin_cot: element.resin_cot,
        total_mat: element.total_mat,
        GK_percent: element.gk_porc,
        GK: element.gk,
        scrap_percent: element.scrap_porc,
        margin_scrap: element.margin_scrap,
        margin_2: element.margin2,
        margen_seguridad: element.margin_seguridad,
        margen_seguridad_percent: element.porc_margin_seguridad
      });
    })

    let obj:request_Maquinas = {
      tipo_proceso:this.proceso_selected
    }
    this.cotizadorService.postMaquinas(obj).subscribe((resp:any)=>{
      if(resp) this.opcionesMaquinas = resp;
      const seletcedMaquina = this.opcionesMaquinas.find(element => element.machine_type == item.tipo_maquina);

      this.form_maquina.patchValue({
        seletcedMaquina: seletcedMaquina,
        precioMaquina: item.costo_hora_maquina,
        ciclo: item.cyclus,
        pcs_hr: item.pcs_hr,
        production: item.production,
        ineficiencia_percent: item.ineficiencia_porcentaje,
        margin_4: item.margin_4,
      }); 
      this.form_empaqueEntrega.patchValue({
        packing_cost: item.packing_cost,
        parking_pcs: item.pcs_entrega,
        packing: item.packing,
        pcs_entrega: item.pcs_entrega,
        costo_flete: item.costo_flete,
        costo_logistico: item.costo_logistico,
        packing_outside_service: item.packing_and_outside_service,
      });
  
      this.form_mantenimientoHerramental.patchValue({
        hr_mantto: item.hr_mtto,
        precioMaquina: item.cost_hr,
        pcs_mtto: item.pcs_mantto,
        tooling_maintance: item.tooling_mantiance,
      });
  
      this.form_totalesPiezas.patchValue({
        ovh_ind_porc: item.percent_overhead,
        overhead: item.overhead,
        margin_overhead: item.margin_overhead,
        profitt_percent: item.percent_proffit,
        profitt: item.proffit,
        margin_profitt: item.margin_profit,
        unit_price: item.unit_price,
        margin_total: item.margin_total,
      });
      
      this.form_totales.patchValue({
        kg_material: item.kg_material,
        moq: item.moq,
        eau: item.eau,
        total: item.total,
      });
    })

    this.toast.info("La informacion del item de la cotizacion se plasmo correctamente","Informacion mostrada");
  }

  calculate_totals_materials_consultar(data:any){
    const gk_Total = data.reduce((acumulador:any, objeto:any) => acumulador + Number(objeto.gk), 0);
    const margen_seguridad_Total = data.reduce((acumulador:any, objeto:any) => acumulador + Number(objeto.margin_seguridad), 0);
    const margin_2_materiales_Total = data.reduce((acumulador:any, objeto:any) => acumulador + Number(objeto.margin2), 0);
    const parte_g_Total = data.reduce((acumulador:any, objeto:any) => acumulador + Number(objeto.part_g), 0);
    const total_mat = data.reduce((acumulador:any, objeto:any) => acumulador + Number(objeto.total_mat), 0);
    return {
      gk_total_materiales: gk_Total,
      totalMateriales: total_mat,
      margen_seguridad_Total: margen_seguridad_Total,
      margin_2_materiales_Total: margin_2_materiales_Total,
      parte_g_Total: parte_g_Total
    }
  }

  setData(data:CotizacionData){
    let objCliente = this.clienteOptions.find(element => element.CLI_CLAVE == data.cotizacion.codigo_cliente_prospecto);
    if (!objCliente) {
      objCliente =  this.clienteOptions.find(element => element.codigo_prospecto == Number(data.cotizacion.codigo_cliente_prospecto));
    }
    let objVendedor = this.vendedoresOptions.find(element => element.codigo_vendedor == data.cotizacion.codigo_vendedor);

    this.selectedCliente = objCliente;
    this.cliente_selected = data.cotizacion.tipo_cliente;
    this.proceso_selected = data.cotizacion.tipo_proceso;
    this.precio_selected = data.cotizacion.tipo_precio;
    this.selectedVendedor = objVendedor;
    
    const items = data.cotizacion_items;
    for (let index = 0; index < items.length; index++) {
      //OBTENER LOS DATOS DE LOS TOTALES NEVIANDOLE LOS ITEMS MATERIAS PRIMAS
      const obj_materias:any =  this.calculate_totals_materials_consultar(items[index].cotizacion_mteriales_items);
      const objParte =  this.partesOptions.find(element => element.codigo_parte == items[index].cotizacion_detalle_item.codigo_parte);

      let obj:itemsCotizacion = {
        codigo_parte: items[index].cotizacion_detalle_item.codigo_parte,
        descripcion_parte: objParte ? objParte.nombre_parte : '',
        flag_nueva_parte: false,
        cav: items[index].cotizacion_detalle_item.cav.toString(),
        materias_primas: items[index].cotizacion_mteriales_items,
        total_materia_prima: Number(items[index].cotizacion_detalle_item.total_materias_primas),
        total_materia_prima_gk: obj_materias.gk_total_materiales,
        total_materia_prima_margen_seguridad: obj_materias.margen_seguridad_Total,
        total_materia_prima_margin_2: obj_materias.margin_2_materiales_Total,
        total_materia_prima_parte_g: obj_materias.parte_g_Total,
        tipo_maquina:items[index].cotizacion_detalle_item.machine_type,
        costo_hora_maquina: Number(items[index].cotizacion_detalle_item.costo_hora_maquina),
        cyclus: items[index].cotizacion_detalle_item.ciclos.toString(),
        pcs_hr: items[index].cotizacion_detalle_item.pcs_hora,
        ineficiencia_porcentaje: items[index].cotizacion_detalle_item.porc_ineficiencia,
        production: items[index].cotizacion_detalle_item.production,
        margin_4: items[index].cotizacion_detalle_item.margin4,
        packing_cost: items[index].cotizacion_detalle_item.packing_cost,
        pcs_packing: items[index].cotizacion_detalle_item.pcs_packing.toString(),
        packing: items[index].cotizacion_detalle_item.packing,
        pcs_entrega: items[index].cotizacion_detalle_item.pcs_entrega.toString(),
        costo_flete: items[index].cotizacion_detalle_item.flete_cost,
        costo_logistico: items[index].cotizacion_detalle_item.logistic_cost,
        packing_and_outside_service: items[index].cotizacion_detalle_item.packing_outside_service,
        hr_mtto: items[index].cotizacion_detalle_item.hr_mantto.toString(),
        cost_hr: items[index].cotizacion_detalle_item.cost_hr_mtto,
        pcs_mantto:  items[index].cotizacion_detalle_item.pcs_mtto.toString(),
        tooling_mantiance: items[index].cotizacion_detalle_item.tooling_maintance,
        percent_overhead:  items[index].cotizacion_detalle_item.ovh_ind_porc,
        overhead:  items[index].cotizacion_detalle_item.overhead,
        margin_overhead:  items[index].cotizacion_detalle_item.overhead_margin,
        percent_proffit:  items[index].cotizacion_detalle_item.profit_porc,
        proffit:  items[index].cotizacion_detalle_item.profit,
        margin_profit:  items[index].cotizacion_detalle_item.margin_profit,
        unit_price:  items[index].cotizacion_detalle_item.unit_price,
        margin_total:  items[index].cotizacion_detalle_item.margin_total,
        kg_material:  items[index].cotizacion_detalle_item.kg_material,
        moq:  items[index].cotizacion_detalle_item.moq.toString(),
        eau:  items[index].cotizacion_detalle_item.eau.toString(),
        total:  items[index].cotizacion_detalle_item.total,
      }

      obj.tabla_total_materias_primas = this.obtener_totalMateriaPrima(obj);
      const aux1 = (obj.tabla_total_materias_primas/Number(obj.unit_price))*100;
      obj.tabla_total_materias_primas_percent = parseFloat(aux1.toFixed(4));

      obj.tabla_total_produccion = this.obtener_totalProduction(obj);
      const aux = (obj.tabla_total_produccion/Number(obj.unit_price))*100;
      obj.tabla_produccion_porc = parseFloat(aux.toFixed(4));
  
      obj.tabla_total_empaque_logistica= this.obtener_totalEmpaqueLogistica(obj);
      const aux2 = (obj.tabla_total_empaque_logistica/Number(obj.unit_price))*100;
      obj.tabla_empaque_logistica_porc= parseFloat(aux2.toFixed(4));
  
      obj.tabla_total_mantenimiento= this.obtener_mantenimiento(obj);
      const aux3 =  (obj.tabla_total_mantenimiento / Number(obj.unit_price))*100;
      obj.tabla_mantenimiento_porc=  parseFloat(aux3.toFixed(4));
  
      this.array_items_cotizacion.push(obj);
    }
    this.obtener_totalCotizacfion();
    
  }

  obtener_totalMateriaPrima(item:itemsCotizacion):number{
    const Monto_base_Mat =  Number(item.total_materia_prima)+Number(item.total_materia_prima_gk);
    const Monto_overhead_Mat= Monto_base_Mat*Number(item.percent_overhead);
    const Monto_profit_Mat = ((Monto_base_Mat+Monto_overhead_Mat)/(1-Number(item.percent_proffit)))-(Monto_base_Mat+Monto_overhead_Mat);
    const total_materias_primas = Monto_base_Mat + Monto_overhead_Mat + Monto_profit_Mat;
    return Number(total_materias_primas);
  }

  obtener_totalProduction(item:any):number {
    const Monto_base_Prod = Number(item.production);
    const Monto_overhead_Prod = (item.production*item.percent_overhead);
    const Monto_profit_Prod = ((Number(item.production)+Monto_overhead_Prod)/(1-Number(item.percent_proffit)))-(Number(item.production)+Monto_overhead_Prod);
    const total_produccion = Monto_base_Prod + Monto_overhead_Prod + Monto_profit_Prod;
    return Number(total_produccion.toFixed(4));
  }

  obtener_totalEmpaqueLogistica(item:any): number{
    const Monto_base_emp_log = Number(item.packing_and_outside_service);
    const Monto_overhead_emp_log = (Number(item.packing_and_outside_service) * Number(item.percent_overhead));
    const Monto_profit_emp_log = ((Number(item.packing_and_outside_service)+Monto_overhead_emp_log)/(1-Number(item.percent_proffit)))-(Number(item.packing_and_outside_service)+Monto_overhead_emp_log)
    const total_empaque_logistica = Monto_base_emp_log + Monto_overhead_emp_log + Monto_profit_emp_log;
    return Number(total_empaque_logistica.toFixed(4))
  }

  obtener_mantenimiento(item:any):number{
    const Monto_base_mantto = Number(item.tooling_mantiance);
    const Monto_overhead_mantto = (Number(item.tooling_mantiance)*Number(item.percent_overhead))
    const Monto_profit_mantto = ((Number(item.tooling_mantiance)+Monto_overhead_mantto)/(1-Number(item.percent_proffit)))-(Number(item.tooling_mantiance)+Monto_overhead_mantto)
    const total_mantenimiento = Monto_base_mantto + Monto_overhead_mantto + Monto_profit_mantto;
    return Number(total_mantenimiento.toFixed(4));
  }

  obtener_totalCotizacfion(){
    this.total_cotizacion = this.array_items_cotizacion.reduce((acumulador:any, objeto) => acumulador + Number(objeto.total), 0);
    this.impuetsos_cotizacion = this.total_cotizacion * .16;
    this.gran_total_cotizacion= this.total_cotizacion + this.impuetsos_cotizacion;
  }

  isProgrammaticChange_2:boolean = false;
  onParteSelected(option:number,material:any) {
    if (material) {
      // Verifica si la selección se debe a una acción del usuario o no
      if (!this.isProgrammaticChange_2) {
        // Establece la bandera para evitar llamadas recursivas
        this.isProgrammaticChange_2 = true;
        if (option === 1) {
          if (material.nombre_parte)  this.selectedParte_descripcion = material.nombre_parte;
        } else if (option === 2) {
          if ( material.codigo_parte) this.selectedParte_codigo = material.codigo_parte;
        }
        // Restablece la bandera después de hacer los cambios
        this.isProgrammaticChange_2 = false;
      }
    }
  }
  
  isProgrammaticChange:boolean = false;
  onMaterialSelected(option:number,material:any) {
    if (material) {
      // Verifica si la selección se debe a una acción del usuario o no
      if (!this.isProgrammaticChange) {
        // Establece la bandera para evitar llamadas recursivas
        this.isProgrammaticChange = true;
        console.log("material",material);
        if (option === 1) {
          if (material.nombre_material) {
            this.form_materiaPrima.get('descripcion_materia_prima')?.setValue(material.nombre_material);
            this.form_materiaPrima.get('resin_basis')?.setValue(material.resin_basis? material.resin_basis: '');
          }
          this.calculateResinCot();
        } else if (option === 2) {
          if (material.codigo_material) {
            this.form_materiaPrima.get('codigo_materia_prima')?.setValue(material.codigo_material);
            this.form_materiaPrima.get('resin_basis')?.setValue(material.resin_basis ? material.resin_basis : '');
          }
          this.calculateResinCot();
        }
        // Restablece la bandera después de hacer los cambios
        this.isProgrammaticChange = false;
      }
    }
  }

  onParam_industria(){
    let data:Request_ParamIndustria = {
      tipo_cliente: this.cliente_selected,
      tipo_precio: this.precio_selected
    }
    if(!this.cliente_selected || !this.precio_selected) return;
    this.cotizadorService.postParamIndustria(data).subscribe((resp:any) => {
      console.log("resp",resp);
      if (resp) {
        this.form_materiaPrima.get('loss_percent')?.setValue(resp.loss_porc ? resp.loss_porc : '');
        this.form_materiaPrima.get('GK_percent')?.setValue(resp.gk_porc ? resp.gk_porc : '');
        this.form_materiaPrima.get('scrap_percent')?.setValue(resp.scrap_porc ? resp.scrap_porc : '');
        this.form_materiaPrima.get('overhead_cost')?.setValue(resp.overhead_cost_porc ? resp.overhead_cost_porc : '');
        this.form_materiaPrima.get('overhead_cost')?.markAllAsTouched();
        this.form_maquina.get('ineficiencia_percent')?.setValue(resp.ineficiencia_porc ? resp.ineficiencia_porc : '');
        this.form_totalesPiezas.get('ovh_ind_porc')?.patchValue(resp.overhead_porc ? resp.overhead_porc : '');
        this.form_totalesPiezas.get('profitt_percent')?.patchValue(resp.profit_porc ? resp.profit_porc : '');
        this.form_mantenimientoHerramental.get('precioMaquina')?.patchValue(resp.mtto_cost_hr ? resp.mtto_cost_hr : '');
        this.calculateResinCot();
      }
    });
  }

  calculatedValue(){
    // Realiza tu cálculo aquí
    const calculatedRunnerG = this.form_materiaPrima.value.parte_g * this.form_materiaPrima.value.RUNNER_percent;
    // Actualiza el valor del campo RUNNER_g
    this.form_materiaPrima.get('RUNNER_g')?.setValue(calculatedRunnerG ? calculatedRunnerG.toFixed(4) : '');
    this.calculateWeigth();
  }

  calculateWeigth(){
    const result = ((this.form_materiaPrima.value.RUNNER_g / (this.cav * this.form_materiaPrima.value.loss_percent)) + this.form_materiaPrima.value.parte_g) / 1000;

    const formattedResult = result.toFixed(4);
    this.form_materiaPrima.get('weigth')?.setValue(result ? formattedResult : '');
    this.calculateTotal_mat();
    this.caclulate_production();
    this.calculate_PCS_HR();
  }
  
  calculateResinCot(){
    const result = Number(this.form_materiaPrima.value.resin_basis)*(1+Number(this.form_materiaPrima.value.overhead_cost));
    this.form_materiaPrima.get('resin_cot')?.setValue(result ? result.toFixed(4) : '');
    this.calculateTotal_mat();
    this.calculateMarginScrap();
  }

  calculateTotal_mat(){
    const result = this.form_materiaPrima.value.weigth*this.form_materiaPrima.value.resin_basis;
    this.form_materiaPrima.get('total_mat')?.setValue(result ? result.toFixed(4) : '');
    this.calculateGK();
    this.calculateMargin_2();
  }

  calculateGK(){
    const result = this.form_materiaPrima.value.total_mat*this.form_materiaPrima.value.GK_percent;
    this.form_materiaPrima.get('GK')?.setValue(result ? result.toFixed(4) : '');
  }

  calculateMarginScrap(){
    const result = this.form_materiaPrima.value.resin_basis*this.form_materiaPrima.value.scrap_percent;
    this.form_materiaPrima.get('margin_scrap')?.setValue(result ? result.toFixed(4) : '');
    this.calculateMargin_2();
  }

  calculateMargin_2(){
    const result = ((Number(this.form_materiaPrima.value.resin_basis)+Number(this.form_materiaPrima.value.margin_scrap)) * Number(this.form_materiaPrima.value.weigth))-Number(this.form_materiaPrima.value.total_mat);
    this.form_materiaPrima.get('margin_2')?.setValue(result ? result.toFixed(4) : '');
    this.calculateMarginSecurity();
  }

  calculateMarginSecurity(){
    const result = Number(this.form_materiaPrima.value.margin_2) * this.form_materiaPrima.value.margen_seguridad_percent;
    this.form_materiaPrima.get('margen_seguridad')?.setValue(result ? result.toFixed(4) : '');
  }

  initCombos(){
    this.cotizadorService.getClientesProspectos().subscribe((resp:any) => {
      this.clienteOptions = resp.CLIENTES;
      resp.PROSPECTOS.map((prospecto:any) => {
        let obj = {
          codigo_prospecto: prospecto.codigo_prospecto,
          nombre_prospecto: prospecto.nombre_prospecto,
          CLI_NOMBRE: prospecto.nombre_prospecto,
        };
        this.clienteOptions.push(obj)
      });
    });

    this.cotizadorService.getVendedores().subscribe((resp:any)=>{
      this.vendedoresOptions = resp;
    })

    this.cotizadorService.getPartes().subscribe((resp:any)=>{
      this.partesOptions = resp;
    })

    this.cotizadorService.getMateriales().subscribe((resp:any)=>{
      this.materialesOptions = resp;
    })
  }

  onProceso_Maquina(){
    if(!this.proceso_selected) return;
    let obj:request_Maquinas = {
      tipo_proceso:this.proceso_selected
    }
    this.cotizadorService.postMaquinas(obj).subscribe((resp:any)=>{
      console.log("maquinas types",resp)
      if(resp) this.opcionesMaquinas = resp;
    })
  }

  setCostoMaquina(){
    console.log("this.form_maquina.value.seletcedMaquina ",this.form_maquina.value.seletcedMaquina)
    if (this.form_maquina.value.seletcedMaquina) {
      console.log("ENTRE ");
      this.form_maquina.get('precioMaquina')?.patchValue(this.form_maquina.value.seletcedMaquina.costo_hora ? this.form_maquina.value.seletcedMaquina.costo_hora : null);
    }
  }

  caclulate_production(){
    const result = ((this.form_maquina.value.precioMaquina*this.form_maquina.value.ciclo/this.cav)/3600)
    this.form_maquina.get('production')?.setValue(result ? result.toFixed(4) : '');
    this.calculate_PCS_HR();
    this.calculateMargin_4();
    this.calculate_tooling_mantiance();
    this.calculate_overhead();
  }

  calculate_PCS_HR(){
    const result = (3600/this.form_maquina.value.ciclo)*this.cav;;
    this.form_maquina.get('pcs_hr')?.setValue(result ? result.toFixed(4) : '');
    this.calculate_moq();
  }

  calculateMargin_4(){
    const result = ( this.form_maquina.value.production*this.form_maquina.value.ineficiencia_percent)
    this.form_maquina.get('margin_4')?.patchValue(result ? result.toFixed(4) : '');
    this.calculate_margin_overhead();
    this.calculate_margin_total();
    this.calculate_margin_profit();
  }

  calculate_PACKING(){
    const result = this.form_empaqueEntrega.value.packing_cost/this.form_empaqueEntrega.value.parking_pcs;
    this.form_empaqueEntrega.get('packing')?.patchValue(result ? result.toFixed(4) : '');
    this.calculate_packingOutsideService();
  }

  caclulate_logisticCost(){
    const result = this.form_empaqueEntrega.value.costo_flete/this.form_empaqueEntrega.value.pcs_entrega;
    this.form_empaqueEntrega.get('costo_logistico')?.patchValue(result ? result.toFixed(4) : '');
    this.calculate_packingOutsideService();
  }

  calculate_packingOutsideService(){
    const result = Number(this.form_empaqueEntrega.value.packing)+ Number(this.form_empaqueEntrega.value.costo_logistico);
    this.form_empaqueEntrega.get('packing_outside_service')?.patchValue(result ? result.toFixed(4) : '');
    this.calculate_overhead();
  }

  calculate_pcs_mtto(){
    if (!this.form_totales.value.eau) {
      console.log("no se calcula nada en EAU");
      return
    }
    console.log("si se calcula");
    const result:number = Number(this.form_totales.value.eau)/12;
    this.form_mantenimientoHerramental.get('pcs_mtto')?.patchValue(result ? result.toFixed(4) : null);
    this.calculate_tooling_mantiance();
    this.calculate_kg_material();
    this.calculate_total();
  }

  calculate_tooling_mantiance(){
    const result = (this.form_mantenimientoHerramental.value.hr_mantto*this.form_mantenimientoHerramental.value.precioMaquina)/this.form_mantenimientoHerramental.value.pcs_mtto;
   this.form_mantenimientoHerramental.get('tooling_maintance')?.patchValue(result ? result.toFixed(4) : '');
   this.calculate_overhead();
  }

  calculate_overhead(){
    const obj:any = this.calculate_totals_materials();
    const toolingMaintance = Number(this.form_mantenimientoHerramental.value.tooling_maintance);
    const packingOutsideService = Number(this.form_empaqueEntrega.value.packing_outside_service);
    const production = Number(this.form_maquina.value.production);
    const totalMateriales = obj.totalMateriales;
    const gkTotalMateriales = obj.gk_total_materiales;
    const ovhIndPorc = Number(this.form_totalesPiezas.value.ovh_ind_porc);
    const resultado = (toolingMaintance + packingOutsideService + production + totalMateriales + gkTotalMateriales) * ovhIndPorc;


    this.form_totalesPiezas.get('overhead')?.patchValue(resultado.toFixed(2));
    this.calculate_margin_overhead();
    this.calculate_profit();
    this.calculate_margin_profit();
    this. calculate_unit_price();
  }
  
  calculate_totals_materials(){
    const gk_Total = this.array_materiaPrimas.reduce((acumulador:any, objeto) => acumulador + Number(objeto.GK), 0);
    const margen_seguridad_Total = this.array_materiaPrimas.reduce((acumulador:any, objeto) => acumulador + Number(objeto.margen_seguridad), 0);
    const margin_2_materiales_Total = this.array_materiaPrimas.reduce((acumulador:any, objeto) => acumulador + Number(objeto.margin_2), 0);
    const parte_g_Total = this.array_materiaPrimas.reduce((acumulador:any, objeto) => acumulador + Number(objeto.parte_g), 0);
    const total_mat = this.array_materiaPrimas.reduce((acumulador:any, objeto) => acumulador + Number(objeto.total_mat), 0);

    return {
      gk_total_materiales: gk_Total,
      totalMateriales: total_mat,
      margen_seguridad_Total: margen_seguridad_Total,
      margin_2_materiales_Total: margin_2_materiales_Total,
      parte_g_Total: parte_g_Total
    }
  }

  calculate_margin_overhead(){
    const obj:any = this.calculate_totals_materials();
    // Obteniendo referencias a los valores utilizados en la fórmula
    const margin4 = this.form_maquina.value.margin_4;
    const margenSeguridadTotal = obj.margen_seguridad_Total;
    const margin2MaterialesTotal = obj.margin_2_materiales_Total;
    const ovhIndPorc = this.form_totalesPiezas.value.ovh_ind_porc;

      // Realizando el cálculo basado en la fórmula original
    const resultado = ( Number(margin4)+ margenSeguridadTotal + margin2MaterialesTotal) * Number(ovhIndPorc);

    this.form_totalesPiezas.get('margin_overhead')?.patchValue(resultado.toFixed(4));
    this.calculate_margin_total();
    this.calculate_margin_profit();
  }

  calculate_profit(){
    const obj:any = this.calculate_totals_materials();
    // Obteniendo referencias a los valores utilizados en la fórmula
    const totalMateriales = Number(obj.totalMateriales);
    const production = Number(this.form_maquina.value.production);
    const packingOutsideService = Number(this.form_empaqueEntrega.value.packing_outside_service);
    const toolingMaintance = Number(this.form_mantenimientoHerramental.value.tooling_maintance);
    const overhead = Number(this.form_totalesPiezas.value.overhead);
    const gkTotalMateriales = obj.gk_total_materiales;
    const profittPercent = Number(this.form_totalesPiezas.value.profitt_percent);

    const numerator:number =
      totalMateriales +
      production +
      packingOutsideService +
      toolingMaintance +
      overhead +
      gkTotalMateriales;

    const denominator:number = 1 - profittPercent;

    let result:number = (numerator / denominator) - numerator;
    this.form_totalesPiezas.get('profitt')?.patchValue(result ? result.toFixed(4) : '');
    this.calculate_unit_price();
  }

  calculate_margin_profit(){
    const obj:any = this.calculate_totals_materials();
    const result:number =  (obj.margin_2_materiales_Total + obj.margen_seguridad_Total + Number(this.form_maquina.value.margin_4) + Number(this.form_totalesPiezas.value.margin_overhead)) / (1-Number(this.form_totalesPiezas.value.profitt_percent)) - (obj.margin_2_materiales_Total + obj.margen_seguridad_Total+ Number(this.form_maquina.value.margin_4) + Number(this.form_totalesPiezas.value.margin_overhead));
    this.form_totalesPiezas.get('margin_profitt')?.patchValue(result ? result.toFixed(4) : '');
    this.calculate_margin_total();
  }

  calculate_unit_price(){
    const obj:any = this.calculate_totals_materials();
    // Obteniendo referencias a los valores utilizados en la fórmula
    const totalMateriales = obj.totalMateriales;
    const gkTotalMateriales = obj.gk_total_materiales;
    const production = Number(this.form_maquina.value.production);
    const overhead = Number(this.form_totalesPiezas.value.overhead);
    const profitt = Number(this.form_totalesPiezas.value.profitt);
    const packingOutsideService = Number(this.form_empaqueEntrega.value.packing_outside_service);
    const toolingMaintance = Number(this.form_mantenimientoHerramental.value.tooling_maintance);

    // Realizando el cálculo basado en la fórmula original
    const result:number =
      totalMateriales +
      gkTotalMateriales +
      production +
      overhead +
      profitt +
      packingOutsideService +
      toolingMaintance;
    this.form_totalesPiezas.get('unit_price')?.patchValue(result ? result.toFixed(4) : '');
    this.calculate_total();
  }

  calculate_margin_total(){
    const obj:any = this.calculate_totals_materials();
    // Obteniendo referencias a los valores utilizados en la fórmula
    const margin2MaterialesTotal = obj.margin_2_materiales_Total;
    const margenSeguridadTotal = obj.margen_seguridad_Total;
    const margin4 = Number(this.form_maquina.value.margin_4);
    const marginOverhead = Number(this.form_totalesPiezas.value.margin_overhead);
    const marginProfitt = Number(this.form_totalesPiezas.value.margin_profitt);
    // Realizando el cálculo basado en la fórmula original
    const result:number =
    margin2MaterialesTotal +
    margenSeguridadTotal +
    margin4 +
    marginOverhead +
    marginProfitt;
    this.form_totalesPiezas.get('margin_total')?.patchValue(result ? result.toFixed(4) : '');
  }

  calculate_kg_material(){
    const obj:any = this.calculate_totals_materials();
    const result = (Number(this.form_totales.value.eau)*Number(obj.parte_g_Total))/1000;
    this.form_totales.get('kg_material')?.patchValue(result ? result.toFixed(4) : '');
  }

  calculate_moq(){
    const result:number = Number(this.form_maquina.value.pcs_hr) * 24;
    console.log(this.form_maquina.value.pcs_hr);
    console.log(result);
    this.form_totales.get('moq')?.patchValue(result ? result.toFixed(4) : '');
  }

  calculate_total(){
    const result:number = Number(this.form_totales.value.eau)*Number(this.form_totalesPiezas.value.unit_price);
    this.form_totales.get('total')?.patchValue(result ?result.toFixed(4):'');
  }



  setMateriaPrima(){
    let codigoMateriaPrima = null;
    let desripcionMateriaPrima = null;
    if(this.form_materiaPrima.invalid){
      this.toast.warning("Campos uncompletos y/o errores en campos","Materia prima incompleta");
      return;
    }
    if (typeof  this.form_materiaPrima.value.codigo_materia_prima === 'object') {
      codigoMateriaPrima = this.form_materiaPrima.value.codigo_materia_prima.codigo_material;
    }else{
      codigoMateriaPrima = this.form_materiaPrima.value.codigo_materia_prima;
    }
    if (typeof this.form_materiaPrima.value.descripcion_materia_prima === 'object') {
      desripcionMateriaPrima = this.form_materiaPrima.value.descripcion_materia_prima.nombre_material;
    }else{
      desripcionMateriaPrima = this.form_materiaPrima.value.descripcion_materia_prima;
    }

    let obj:MateriaPrima = {
      codigo_materia_prima: codigoMateriaPrima,
      descripcion_materia_prima: desripcionMateriaPrima,
      SUPPLIER_RESIN: this.form_materiaPrima.value.SUPPLIER_RESIN,
      parte_g: this.form_materiaPrima.value.parte_g,
      RUNNER_percent: this.form_materiaPrima.value.RUNNER_percent,
      RUNNER_g: this.form_materiaPrima.value.RUNNER_g,
      loss_percent: this.form_materiaPrima.value.loss_percent,
      weigth: this.form_materiaPrima.value.weigth,
      resin_basis: this.form_materiaPrima.value.resin_basis,
      overhead_cost: this.form_materiaPrima.value.overhead_cost,
      resin_cot: this.form_materiaPrima.value.resin_cot,
      total_mat: this.form_materiaPrima.value.total_mat,
      GK_percent: this.form_materiaPrima.value.GK_percent,
      GK:this.form_materiaPrima.value.GK,
      scrap_percent: this.form_materiaPrima.value.scrap_percent,
      margin_scrap: this.form_materiaPrima.value.margin_scrap,
      margin_2: this.form_materiaPrima.value.margin_2,
      margen_seguridad_percent: this.form_materiaPrima.value.margen_seguridad_percent,
      margen_seguridad: this.form_materiaPrima.value.margen_seguridad,
    }
    console.log(this.form_materiaPrima.value);
    this.array_materiaPrimas.push(obj);
    this.toast.success("Materia prima agregada al listado","Agregado con exito");
    this.form_materiaPrima.reset();
    this.calculate_overhead(); //se edito el total de los materiales y se vuelve a calular
    this.calculate_margin_overhead();
  }

  eliminarItem(index: number){
    this.array_materiaPrimas.splice(index, 1);
    this.toast.info("Materia prima eliminada del listado","Eliminado con exito");
    this.calculate_overhead(); //se edito el total de los materiales y se vuelve a calular
    this.calculate_margin_overhead();
  }

  flag_edit_materiaP:boolean = false;
  flag_edit_index_materiaP:number = -1;
  editarItem(index:number){
    this.flag_edit_materiaP = true;
    this.flag_edit_index_materiaP = index;
    const objetoEditar:MateriaPrima = this.array_materiaPrimas[index];
    const obj_materiaprima = this.materialesOptions.find(element => element.codigo_material == objetoEditar.codigo_materia_prima);
    objetoEditar.codigo_materia_prima = obj_materiaprima ? obj_materiaprima : objetoEditar.codigo_materia_prima;
    objetoEditar.descripcion_materia_prima = obj_materiaprima ? obj_materiaprima : objetoEditar.descripcion_materia_prima;
    this.form_materiaPrima.setValue(objetoEditar);
  }

  cancelarEditarItem(){
    this.flag_edit_materiaP = false;
    this.flag_edit_index_materiaP = -1;
    this.form_materiaPrima.reset();
  }

  confirmEditarItem(){
    let codigoMateriaPrima = null;
    let desripcionMateriaPrima = null;
    if(this.form_materiaPrima.invalid){
      this.toast.warning("Completa todos los campos de Materia Prima","Campos incompletos");
      return;
    }
    if (typeof  this.form_materiaPrima.value.codigo_materia_prima === 'object') {
      codigoMateriaPrima = this.form_materiaPrima.value.codigo_materia_prima.codigo_material;
    }else{
      codigoMateriaPrima = this.form_materiaPrima.value.codigo_materia_prima;
    }
    if (typeof this.form_materiaPrima.value.descripcion_materia_prima === 'object') {
      desripcionMateriaPrima = this.form_materiaPrima.value.descripcion_materia_prima.nombre_material;
    }else{
      desripcionMateriaPrima = this.form_materiaPrima.value.descripcion_materia_prima;
    }

    let obj:MateriaPrima = {
      codigo_materia_prima: codigoMateriaPrima,
      descripcion_materia_prima: desripcionMateriaPrima,
      SUPPLIER_RESIN: this.form_materiaPrima.value.SUPPLIER_RESIN,
      parte_g: this.form_materiaPrima.value.parte_g,
      RUNNER_percent: this.form_materiaPrima.value.RUNNER_percent,
      RUNNER_g: this.form_materiaPrima.value.RUNNER_g,
      loss_percent: this.form_materiaPrima.value.loss_percent,
      weigth: this.form_materiaPrima.value.weigth,
      resin_basis: this.form_materiaPrima.value.resin_basis,
      overhead_cost: this.form_materiaPrima.value.overhead_cost,
      resin_cot: this.form_materiaPrima.value.resin_cot,
      total_mat: this.form_materiaPrima.value.total_mat,
      GK_percent: this.form_materiaPrima.value.GK_percent,
      GK:this.form_materiaPrima.value.GK,
      scrap_percent: this.form_materiaPrima.value.scrap_percent,
      margin_scrap: this.form_materiaPrima.value.margin_scrap,
      margin_2: this.form_materiaPrima.value.margin_2,
      margen_seguridad_percent: this.form_materiaPrima.value.margen_seguridad_percent,
      margen_seguridad: this.form_materiaPrima.value.margen_seguridad,
    }
    this.array_materiaPrimas[this.flag_edit_index_materiaP] = obj;
    this.cancelarEditarItem();
    this.toast.success("Materia prima editada","Edicion con exito");
    this.calculate_overhead(); //se edito el total de los materiales y se vuelve a calular
    this.calculate_margin_overhead();
  }

  //ITEM COTIZACION, DE PRODUCTO
  flag_nueva_parte: boolean = false;
  addItemCotizacion(){
    if (this.verificarFormCot()) {
      return;
    }
    const obj_materias:any =  this.calculate_totals_materials();
    let obj:itemsCotizacion = {
      codigo_parte: (typeof  this.selectedParte_codigo === 'object') ? this.selectedParte_codigo.codigo_parte  : this.selectedParte_codigo,
      descripcion_parte: (typeof  this.selectedParte_descripcion === 'object') ? this.selectedParte_descripcion.nombre_parte  : this.selectedParte_descripcion,
      flag_nueva_parte: this.flag_nueva_parte,
      cav: this.cav,
      materias_primas: this.array_materiaPrimas,
      total_materia_prima: obj_materias.totalMateriales,
      total_materia_prima_gk: obj_materias.gk_total_materiales,
      total_materia_prima_margen_seguridad: obj_materias.margen_seguridad_Total,
      total_materia_prima_margin_2: obj_materias.margin_2_materiales_Total,
      total_materia_prima_parte_g: obj_materias.parte_g_Total,
      tipo_maquina: this.form_maquina.value.seletcedMaquina.machine_type,
      costo_hora_maquina: this.form_maquina.value.precioMaquina,
      cyclus: this.form_maquina.value.ciclo,
      pcs_hr: this.form_maquina.value.pcs_hr,
      ineficiencia_porcentaje: this.form_maquina.value.ineficiencia_percent,
      production:  this.form_maquina.value.production ,
      margin_4: this.form_maquina.value.margin_4,
      packing_cost: this.form_empaqueEntrega.value.packing_cost,
      pcs_packing: this.form_empaqueEntrega.value.parking_pcs,
      packing: this.form_empaqueEntrega.value.packing,
      pcs_entrega: this.form_empaqueEntrega.value.pcs_entrega,
      costo_flete: this.form_empaqueEntrega.value.costo_flete,
      costo_logistico: this.form_empaqueEntrega.value.costo_logistico,
      packing_and_outside_service: this.form_empaqueEntrega.value.packing_outside_service,
      hr_mtto: this.form_mantenimientoHerramental.value.hr_mantto,
      cost_hr: this.form_mantenimientoHerramental.value.precioMaquina,
      pcs_mantto: this.form_mantenimientoHerramental.value.pcs_mtto,
      tooling_mantiance: this.form_mantenimientoHerramental.value.tooling_maintance,
      percent_overhead: this.form_totalesPiezas.value.ovh_ind_porc,
      overhead: this.form_totalesPiezas.value.overhead,
      margin_overhead: this.form_totalesPiezas.value.margin_overhead,
      percent_proffit: this.form_totalesPiezas.value.profitt_percent,
      proffit: this.form_totalesPiezas.value.profitt,
      margin_profit: this.form_totalesPiezas.value.margin_profitt,
      unit_price: this.form_totalesPiezas.value.unit_price,
      margin_total: this.form_totalesPiezas.value.margin_total,
      kg_material: this.form_totales.value.kg_material,
      moq: this.form_totales.value.moq,
      eau: this.form_totales.value.eau,
      total: this.form_totales.value.total,
    }

    obj.tabla_total_materias_primas = this.obtener_totalMateriaPrima(obj);
    const aux1 = (obj.tabla_total_materias_primas/Number(obj.unit_price))*100;
    obj.tabla_total_materias_primas_percent = parseFloat(aux1.toFixed(4));

    obj.tabla_total_produccion = this.obtener_totalProduction(obj);
    const aux = (obj.tabla_total_produccion/Number(obj.unit_price))*100;
    obj.tabla_produccion_porc = parseFloat(aux.toFixed(4));

    obj.tabla_total_empaque_logistica= this.obtener_totalEmpaqueLogistica(obj);
    const aux2 = (obj.tabla_total_empaque_logistica/Number(obj.unit_price))*100;
    obj.tabla_empaque_logistica_porc= parseFloat(aux2.toFixed(4));

    obj.tabla_total_mantenimiento= this.obtener_mantenimiento(obj);
    const aux3 =  (obj.tabla_total_mantenimiento / Number(obj.unit_price))*100;
    obj.tabla_mantenimiento_porc=  parseFloat(aux3.toFixed(4));

    this.array_items_cotizacion.push(obj);
    this.toast.success("Item de Cotización agregada con exito","Item agregado");
    this.obtener_totalCotizacfion();
    this.limpiarSecciones();
    console.log('item agregado',obj);
  }

  guardarCotizacion(){
    this.toast.charge("procesando petición","Cargando...");
    console.log("items cotizacion",this.array_items_cotizacion);
    const obj_send:Request_cotizacion_save = {
      cliente_prospecto: this.selectedCliente,
      tipo_cliente: this.cliente_selected,
      tipo_proceso: this.proceso_selected,
      precios: this.precio_selected,
      vendedor: this.selectedVendedor,
      cotizacion_array: this.array_items_cotizacion,
      total: Number(this.total_cotizacion.toFixed(2)),
      impuestos: this.impuetsos_cotizacion,
      gran_total: this.gran_total_cotizacion
    }
    this.cotizadorService.postGuardarCotizacion(obj_send).subscribe({
      next: (resp: any) => {
        this.toast.remove();
        console.log(resp);
        this.toast.success('Se agregó correctamente la cotización','Cotización Agregada');
        this.route.navigate(['/cotizador']);
      },
      error: (error: any) => {
        this.toast.remove();
        console.error(error);
        if (error.status === 500) {
          this.toast.error('Verifique todos los campos de la cotización e inténtelo de nuevo','Error en Agregar Cotización 500');
        } else if (error.status === 400) {
          this.toast.error(error.error.message,'Error 400');
        } else {
          this.toast.error('Hubo un error en el guardado de la cotizacion','Error Desconocido');
          // Otros errores
        }
      }
    });
  }

  confirmarEdicionItem(){
    if (this.verificarFormCot()) {
      return;
    }
    const obj_materias:any =  this.calculate_totals_materials();
    let obj:itemsCotizacion = {
      codigo_parte: (typeof  this.selectedParte_codigo === 'object') ? this.selectedParte_codigo.codigo_parte  : this.selectedParte_codigo,
      descripcion_parte: (typeof  this.selectedParte_descripcion === 'object') ? this.selectedParte_descripcion.nombre_parte  : this.selectedParte_descripcion,
      flag_nueva_parte: this.flag_nueva_parte,
      cav: this.cav,
      materias_primas: this.array_materiaPrimas,
      total_materia_prima: obj_materias.totalMateriales,
      total_materia_prima_gk: obj_materias.gk_total_materiales,
      total_materia_prima_margen_seguridad: obj_materias.margen_seguridad_Total,
      total_materia_prima_margin_2: obj_materias.margin_2_materiales_Total,
      total_materia_prima_parte_g: obj_materias.parte_g_Total,
      tipo_maquina: this.form_maquina.value.seletcedMaquina.machine_type,
      costo_hora_maquina: this.form_maquina.value.precioMaquina,
      cyclus: this.form_maquina.value.ciclo,
      pcs_hr: this.form_maquina.value.pcs_hr,
      ineficiencia_porcentaje: this.form_maquina.value.ineficiencia_percent,
      production:  this.form_maquina.value.production ,
      margin_4: this.form_maquina.value.margin_4,
      packing_cost: this.form_empaqueEntrega.value.packing_cost,
      pcs_packing: this.form_empaqueEntrega.value.parking_pcs,
      packing: this.form_empaqueEntrega.value.packing,
      pcs_entrega: this.form_empaqueEntrega.value.pcs_entrega,
      costo_flete: this.form_empaqueEntrega.value.costo_flete,
      costo_logistico: this.form_empaqueEntrega.value.costo_logistico,
      packing_and_outside_service: this.form_empaqueEntrega.value.packing_outside_service,
      hr_mtto: this.form_mantenimientoHerramental.value.hr_mantto,
      cost_hr: this.form_mantenimientoHerramental.value.precioMaquina,
      pcs_mantto: this.form_mantenimientoHerramental.value.pcs_mtto,
      tooling_mantiance: this.form_mantenimientoHerramental.value.tooling_maintance,
      percent_overhead: this.form_totalesPiezas.value.ovh_ind_porc,
      overhead: this.form_totalesPiezas.value.overhead,
      margin_overhead: this.form_totalesPiezas.value.margin_overhead,
      percent_proffit: this.form_totalesPiezas.value.profitt_percent,
      proffit: this.form_totalesPiezas.value.profitt,
      margin_profit: this.form_totalesPiezas.value.margin_profitt,
      unit_price: this.form_totalesPiezas.value.unit_price,
      margin_total: this.form_totalesPiezas.value.margin_total,
      kg_material: this.form_totales.value.kg_material,
      moq: this.form_totales.value.moq,
      eau: this.form_totales.value.eau,
      total: this.form_totales.value.total,
    }

    obj.tabla_total_materias_primas = this.obtener_totalMateriaPrima(obj);
    const aux1 = (obj.tabla_total_materias_primas/Number(obj.unit_price))*100;
    obj.tabla_total_materias_primas_percent = parseFloat(aux1.toFixed(4));

    obj.tabla_total_produccion = this.obtener_totalProduction(obj);
    const aux = (obj.tabla_total_produccion/Number(obj.unit_price))*100;
    obj.tabla_produccion_porc = parseFloat(aux.toFixed(4));

    obj.tabla_total_empaque_logistica= this.obtener_totalEmpaqueLogistica(obj);
    const aux2 = (obj.tabla_total_empaque_logistica/Number(obj.unit_price))*100;
    obj.tabla_empaque_logistica_porc= parseFloat(aux2.toFixed(4));

    obj.tabla_total_mantenimiento= this.obtener_mantenimiento(obj);
    const aux3 = (obj.tabla_total_mantenimiento / Number(obj.unit_price))*100;
    obj.tabla_mantenimiento_porc=  parseFloat(aux3.toFixed(4));

    this.array_items_cotizacion[this.flagIndexEdit_itemCot]=obj;
    this.flagEdit_itemCot = false;
    this.limpiarSecciones();
    this.toast.success("La edicion del item se realizo correctamente","Item actualizado");
  }

  cancelarEdicionItem(){
    this.toast.info("No se realizo ningun cambio en el Item","Cancelacion de Edicion");
    this.flagEdit_itemCot = false;
    this.flagIndexEdit_itemCot = -1;
    this.limpiarSecciones();
  }

  flagEdit_itemCot:boolean = false;
  flagIndexEdit_itemCot:number = -1;
  editarItemCot(index:number,item:itemsCotizacion){
    this.flagEdit_itemCot = true;
    this.flagIndexEdit_itemCot = index;

    if (item.materias_primas !== undefined) {
      this.array_materiaPrimas = item.materias_primas;
    }

    this.selectedParte_codigo = item.codigo_parte;
    this.selectedParte_descripcion = item.descripcion_parte;
    this.cav = item.cav;

    const seletcedMaquina = this.opcionesMaquinas.find(element => element.machine_type == item.tipo_maquina);

    this.form_maquina.patchValue({
      seletcedMaquina: seletcedMaquina,
      precioMaquina: item.costo_hora_maquina,
      ciclo: item.cyclus,
      pcs_hr: item.pcs_hr,
      production: item.production,
      ineficiencia_percent: item.ineficiencia_porcentaje,
      margin_4: item.margin_4,
    }); 

    this.form_empaqueEntrega.patchValue({
      packing_cost: item.packing_cost,
      parking_pcs: item.pcs_entrega,
      packing: item.packing,
      pcs_entrega: item.pcs_entrega,
      costo_flete: item.costo_flete,
      costo_logistico: item.costo_logistico,
      packing_outside_service: item.packing_and_outside_service,
    });

    console.log("pcs_mantto -->",item.pcs_mantto);
    this.form_mantenimientoHerramental.patchValue({
      hr_mantto: item.hr_mtto,
      precioMaquina: item.cost_hr,
      pcs_mtto: item.pcs_mantto,
      tooling_maintance: item.tooling_mantiance,
    });

    this.form_totalesPiezas.patchValue({
      ovh_ind_porc: item.percent_overhead,
      overhead: item.overhead,
      margin_overhead: item.margin_overhead,
      profitt_percent: item.percent_proffit,
      profitt: item.proffit,
      margin_profitt: item.margin_profit,
      unit_price: item.unit_price,
      margin_total: item.margin_total,
    });
    
    this.form_totales.patchValue({
      kg_material: item.kg_material,
      moq: item.moq,
      eau: item.eau,
      total: item.total,
    });
    this.toast.info("Los datos estan listos para ser editados","Editar Item");
  }

  eliminarItemCot(index:number){
    this.array_items_cotizacion.splice(index, 1);
    this.toast.remove();
    this.toast.info("Item de la Cotización eliminada del listado","Eliminado con exito");
  }


  limpiarSecciones(){ 
    this.form_materiaPrima.reset();
    this.selectedParte_codigo = null;
    this.selectedParte_descripcion = null;
    this.cav = '';

    this.array_materiaPrimas = [];
    this.form_maquina.reset();
    this.form_mantenimientoHerramental.reset();
    this.form_empaqueEntrega.reset();
    this.form_totalesPiezas.reset();
    this.form_totales.reset();
    this.form_mantenimientoHerramental.reset();
  }

  verificarFormCot():boolean{
    if (!this.cliente_selected || !this.proceso_selected || !this.precio_selected || !this.selectedVendedor || !this.selectedParte_codigo || !this.selectedParte_descripcion || !this.cav) {
      this.toast.warning("Hay errores y/o campos faltantes","Datos generales cotizacion");
      return true;
    }
    if (this.array_materiaPrimas.length <= 0) {
      this.toast.warning("Se necesita minimo una materia prima","Sin materias primas");
      return true;
    }
    if (this.form_maquina.invalid) {
      this.toast.warning("Hay errores y/o campos faltantes","Campos Faltantes - Maquina");
      return true;
    }
    if (this.form_empaqueEntrega.invalid) {
      this.toast.warning("Hay errores y/o campos faltantes","Campos Faltantes - Empaque Entrega");
      return true;
    }
    if (this.form_mantenimientoHerramental.invalid) {
      this.toast.warning("Hay errores y/o campos faltantes","Campos Faltantes - Mantenimiento herramental");
      return true;
    }
    if (this.form_totalesPiezas.invalid) {
      Object.keys(this.form_totalesPiezas.controls).forEach(field => {
        const control = this.form_totalesPiezas.get(field);
        if (control && control.invalid) {
          const errors = control.errors;
          console.log(`Errores en el campo ${field}:`, errors);
        }
      });
      this.toast.warning("Hay errores y/o campos faltantes","Campos Faltantes - Totales pieza");
      return true;
    }
    if (this.form_totales.invalid) {
      Object.keys(this.form_totales.controls).forEach(field => {
        const control = this.form_totales.get(field);
        if (control && control.invalid) {
          const errors = control.errors;
          console.log(`Errores en el campo ${field}:`, errors);
        }
      });
      this.toast.warning("Hay errores y/o campos faltantes","Campos Faltantes - Totales");
      return true;
    }
    return false;
  }

  downloadPDF(){
    this.toast.charge("Espere un momento profavor","Generando PDF...");
    this.cotizadorService.getCotizacionPDF({num_cotizacion:this.cot,...this.form_pdf.value}).subscribe((blob:Blob)=>{
      this.toast.remove();
      const fileURL = window.URL.createObjectURL(blob);
      window.open(fileURL);
    });
  }

}
