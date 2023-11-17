import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { itemsCotizacion } from 'src/app/interfaces/ItemsCotizacion.interface';
import request_Maquinas, { Maquinas_response } from 'src/app/interfaces/Maquinas.interface';
import MateriaPrima from 'src/app/interfaces/MateriaPrima.interface';
import Request_ParamIndustria from 'src/app/interfaces/Params_Industria.interace';
import { Request_cotizacion_save } from 'src/app/interfaces/Request_Cotizaciones.interface';
import { CotizadorService } from 'src/app/services/cotizador.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-form-cotizador',
  templateUrl: './form-cotizador.component.html',
  styleUrls: ['./form-cotizador.component.css']
})
export class FormCotizadorComponent {
  
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

  opcionesMaquinas:Maquinas_response[]=[];
  seletcedMaquina:Maquinas_response = {};
  precioMaquina:any;

  production:any;
  margin_4:any;
  ciclo:any;
  pcs_hr:any;
  ineficiencia_percent:any;

  packing_cost:any;
  parking_pcs:any;
  packing:any;
  pcs_entrega:any;
  costo_flete:any;
  costo_logistico:any;
  packing_outside_service:any;

  hr_mantto:any;
  pcs_mtto:any;
  tooling_maintance:any;

  ovh_ind_porc:any;
  overhead:any;
  margin_overhead:any;
  profitt_percent:any;
  profitt:any;
  margin_profitt:any;
  unit_price:any;
  margin_total:any;
  
  kg_material:any;
  eau:any;
  moq:any;
  total:any;

  array_items_cotizacion:itemsCotizacion[] = [];

  total_cotizacion: number = 0;
  impuetsos_cotizacion:number = 0;
  gran_total_cotizacion: number= 0;

  constructor(private cotizadorService:CotizadorService, private fb: FormBuilder, private toast:ToastService, private route:Router){
    this.form_materiaPrima = this.fb.group({
      codigo_materia_prima:[null, [Validators.required]],
      descripcion_materia_prima:[null, [Validators.required]],
      SUPPLIER_RESIN:['', [Validators.required]],
      parte_g:['',[Validators.required]],
      RUNNER_percent:['',[Validators.required]],
      RUNNER_g:['',[Validators.required]],
      loss_percent:['',[Validators.required]],
      weigth:['',[Validators.required]],
      resin_basis:['',[Validators.required]],
      overhead_cost:['',[Validators.required]],
      resin_cot:['',[Validators.required]],
      total_mat:['',[Validators.required]],
      GK_percent:['',[Validators.required]],
      GK:['',[Validators.required]],
      scrap_percent:['',[Validators.required]],
      margin_scrap:['',[Validators.required]],
      margin_2:['',[Validators.required]],
      margen_seguridad_percent:['',[Validators.required]],
      margen_seguridad:['',[Validators.required]],
    });
  }

  ngOnInit(): void {
    this.initCombos();
/*     this.array_items_cotizacion.push({
      "codigo_parte": "1",
      "descripcion_parte": "Metal blindado",
      "flag_nueva_parte": false,
      "cav": "12",
      "materias_primas": [
          {
              "codigo_materia_prima": "M1",
              "descripcion_materia_prima": "Lamina reforzada",
              "SUPPLIER_RESIN": "12",
              "parte_g": "22",
              "RUNNER_percent": "2",
              "RUNNER_g": "44",
              "loss_percent": "2",
              "weigth": "0.0018",
              "resin_basis": "30",
              "overhead_cost": "10.3",
              "resin_cot": "3309",
              "total_mat": "0.054",
              "GK_percent": "3",
              "GK": "0.162",
              "scrap_percent": "2.2",
              "margin_scrap": "66",
              "margin_2": "5.464799999999999",
              "margen_seguridad_percent": "2",
              "margen_seguridad": "10.929599999999999"
          },
          {
              "codigo_materia_prima": "M2",
              "descripcion_materia_prima": "Cristal fundido",
              "SUPPLIER_RESIN": "10",
              "parte_g": "22",
              "RUNNER_percent": "2",
              "RUNNER_g": "44",
              "loss_percent": "2",
              "weigth": "0.0018",
              "resin_basis": "33",
              "overhead_cost": "10.3",
              "resin_cot": "3639.9",
              "total_mat": "0.0594",
              "GK_percent": "3",
              "GK": "0.1782",
              "scrap_percent": "2.2",
              "margin_scrap": "72.60000000000001",
              "margin_2": "6.011279999999999",
              "margen_seguridad_percent": "2",
              "margen_seguridad": "12.022559999999999"
          }
      ],
      "total_materia_prima": 0.1134,
      "tipo_maquina": "Monotiraz",
      "costo_hora_maquina": 20.2,
      "cyclus": "2",
      "pcs_hr": "21600",
      "ineficiencia_porcentaje": "11.2",
      "production": "0.0009351851851851852",
      "margin_4": "0.010474074074074073",
      "packing_cost": "2",
      "pcs_packing": "2",
      "packing": "1",
      "pcs_entrega": "2",
      "costo_flete": "2",
      "costo_logistico": "1",
      "packing_and_outside_service": "2",
      "hr_mtto": "2",
      "cost_hr": "20.2",
      "pcs_mantto": "0.16666666666666666",
      "tooling_mantiance": "242.4",
      "percent_overhead": "12.11",
      "overhead": "2965.1884210925928",
      "margin_overhead": "417.05282743703697",
      "percent_proffit": "2.32",
      "proffit": "6496.100919051915",
      "margin_profit": "10.723386325816705",
      "unit_price": "9706.143875329693",
      "margin_total": "462.21492783692776",
      "kg_material": "88",
      "moq": "518400",
      "eau": "2",
      "total": "19412.287750659387"
    })
    this.obtener_totalCotizacfion(); */
  }

  obtener_totalProduction(item:any):number {
    const Monto_base_Prod = Number(item.production);
    const Monto_overhead_Prod = (item.production*item.percent_overhead);
    const Monto_profit_Prod = ((Number(item.production)+Monto_overhead_Prod)/(1-(Number(item.percent_proffit)/100)))-(Number(item.production)+Monto_overhead_Prod);
    const total_produccion = Monto_base_Prod + Monto_overhead_Prod + Monto_profit_Prod;
    return total_produccion;
  }

  obtener_totalEmpaqueLogistica(item:any): number{
    const Monto_base_emp_log = Number(item.packing_and_outside_service);
    const Monto_overhead_emp_log = (Number(item.packing_and_outside_service) * Number(item.percent_overhead));
    const Monto_profit_emp_log = ((Number(item.packing_and_outside_service)+Monto_overhead_emp_log)/(1-(Number(item.percent_proffit)/100)))-(Number(item.packing_and_outside_service)+Monto_overhead_emp_log)
    const total_empaque_logistica = Monto_base_emp_log + Monto_overhead_emp_log + Monto_profit_emp_log;
    return total_empaque_logistica
  }

  obtener_mantenimiento(item:any):number{
    const Monto_base_mantto = Number(item.tooling_mantiance);
    const Monto_overhead_mantto = (Number(item.tooling_mantiance)*Number(item.percent_overhead))
    const Monto_profit_mantto = ((Number(item.tooling_mantiance)+Monto_overhead_mantto)/(1-(Number(item.percent_proffit)/100)))-(Number(item.tooling_mantiance)+Monto_overhead_mantto)
    const total_mantenimiento = Monto_base_mantto + Monto_overhead_mantto + Monto_profit_mantto;
    return total_mantenimiento;
  }

  obtener_totalCotizacfion(){
    this.total_cotizacion = this.array_items_cotizacion.reduce((acumulador:any, objeto) => acumulador + Number(objeto.total), 0);
    this.impuetsos_cotizacion = 0;
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
          this.selectedParte_descripcion = material.nombre_parte?material.nombre_parte : null;
        } else if (option === 2) {
          this.selectedParte_codigo = material.codigo_parte ?material.codigo_parte : null;
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
        if (option === 1) {
          this.form_materiaPrima.get('descripcion_materia_prima')?.setValue(material.nombre_material?material.nombre_material : null);
          this.form_materiaPrima.get('resin_basis')?.setValue(material.resin_basis? material.resin_basis: '');
          this.calculateResinCot();
        } else if (option === 2) {
          this.form_materiaPrima.get('codigo_materia_prima')?.setValue(material.codigo_material ?material.codigo_material : null);
          this.form_materiaPrima.get('resin_basis')?.setValue(material.resin_basis ? material.resin_basis : '');
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
        this.ineficiencia_percent = resp.ineficiencia_porc ? resp.ineficiencia_porc : '';
        this.ovh_ind_porc = resp.overhead_porc ? resp.overhead_porc : '';
        this.profitt_percent = resp.profit_porc ? resp.profit_porc : '';
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
    console.log(this.form_materiaPrima.value.resin_basis);
    console.log(1+this.form_materiaPrima.value.overhead_cost);
    const result = this.form_materiaPrima.value.resin_basis*(1+this.form_materiaPrima.value.overhead_cost);
    console.log(result);
    this.form_materiaPrima.get('resin_cot')?.setValue(result ? result : '');
    this.calculateTotal_mat();
    this.calculateMarginScrap();
  }

  calculateTotal_mat(){
    const result = this.form_materiaPrima.value.weigth*this.form_materiaPrima.value.resin_basis;
    this.form_materiaPrima.get('total_mat')?.setValue(result ? result : '');
    this.calculateGK();
    this.calculateMargin_2();
  }

  calculateGK(){
    const result = this.form_materiaPrima.value.total_mat*this.form_materiaPrima.value.GK_percent;
    this.form_materiaPrima.get('GK')?.setValue(result ? result : '');
  }

  calculateMarginScrap(){
    const result = this.form_materiaPrima.value.resin_basis*this.form_materiaPrima.value.scrap_percent;
    this.form_materiaPrima.get('margin_scrap')?.setValue(result ? result : '');
    this.calculateMargin_2();
  }

  calculateMargin_2(){
    const result = ((this.form_materiaPrima.value.resin_basis+this.form_materiaPrima.value.margin_scrap) * this.form_materiaPrima.value.weigth)-this.form_materiaPrima.value.total_mat
    this.form_materiaPrima.get('margin_2')?.setValue(result ? result : '');
    this.calculateMarginSecurity();
  }

  calculateMarginSecurity(){
    const result = this.form_materiaPrima.value.margin_2 * this.form_materiaPrima.value.margen_seguridad_percent;
    this.form_materiaPrima.get('margen_seguridad')?.setValue(result ? result : '');
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
    this.precioMaquina = this.seletcedMaquina.costo_hora;
  }

  caclulate_production(){
    const result = ((this.precioMaquina*this.ciclo/this.cav)/3600)
    this.production = result ? result : '';
    this.calculate_PCS_HR();
    this.calculateMargin_4();
    this.calculate_tooling_mantiance();
    this.calculate_overhead();
  }

  calculate_PCS_HR(){
    const result = (3600/this.ciclo)*this.cav;
    this.pcs_hr = result ? result : '';
    this.calculate_moq();
  }

  calculateMargin_4(){
    const result = (this.production*this.ineficiencia_percent)
    this.margin_4 = result ? result : '';
    this.calculate_margin_overhead();
    this.calculate_margin_total();
    this.calculate_margin_profit();
  }

  calculate_PACKING(){
    const result = this.packing_cost/this.parking_pcs;
    this.packing = result ? result : '';
    this.calculate_packingOutsideService();
  }

  caclulate_logisticCost(){
    const result = this.costo_flete/this.pcs_entrega;
    this.costo_logistico = result ? result : '';
    this.calculate_packingOutsideService();
  }

  calculate_packingOutsideService(){
    const result = Number(this.packing)+ Number(this.costo_logistico);
    this.packing_outside_service = result ? result : '';
    this.calculate_overhead();
  }

  calculate_pcs_mtto(){
    const result = this.eau/12;
    this.pcs_mtto = result ? result : '';
    this.calculate_tooling_mantiance();
    this.calculate_kg_material();
    this.calculate_total();
  }

  calculate_tooling_mantiance(){
    //precioMaquina es costo hora
    const result = (this.hr_mantto*this.precioMaquina)/this.pcs_mtto;
    console.log("aqui tooling hr_mantto",this.hr_mantto);
    console.log("aqui tooling precioMaquina",this.precioMaquina);
    console.log("aqui tooling pcs_mtto",this.pcs_mtto);
   this.tooling_maintance = result ? result : '';
   this.calculate_overhead();
  }

  calculate_overhead(){
    const obj:any = this.calculate_totals_materials();
    this.overhead = (this.tooling_maintance+this.packing_outside_service+this.production+obj.totalMateriales+obj.gk_total_materiales)*this.ovh_ind_porc;
    this.calculate_margin_overhead();
    this.calculate_profit();
    this.calculate_margin_profit();
    this. calculate_unit_price();
  }
  
  calculate_totals_materials(){
    const gk_Total = this.array_materiaPrimas.reduce((acumulador:any, objeto) => acumulador + objeto.GK, 0);
    const margen_seguridad_Total = this.array_materiaPrimas.reduce((acumulador:any, objeto) => acumulador + objeto.margen_seguridad, 0);
    const margin_2_materiales_Total = this.array_materiaPrimas.reduce((acumulador:any, objeto) => acumulador + objeto.margin_2, 0);
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
    this.margin_overhead = (this.margin_4+obj.margen_seguridad_Total+obj.margin_2_materiales_Total)*this.ovh_ind_porc;
    this.calculate_margin_total();
    this.calculate_margin_profit();
  }

  calculate_profit(){
    const obj:any = this.calculate_totals_materials();
    const result = (obj.totalMateriales+this.production+this.packing_outside_service+this.tooling_maintance+this.overhead+obj.gk_total_materiales)/(1-(this.profitt_percent/100))-obj.totalMateriales+this.production+this.packing_outside_service+this.tooling_maintance+this.overhead+obj.gk_total_materiales;;  
    this.profitt = result ? result : '';
    this.calculate_unit_price();
  }

  calculate_margin_profit(){
    const obj:any = this.calculate_totals_materials();
    const result =  (obj.margin_2_materiales_Total + obj.margen_seguridad_Total + this.margin_4 + this.margin_overhead) / (1-(this.profitt_percent)/100) - (obj.margin_2_materiales_Total + obj.margen_seguridad_Total+ this.margin_4 + this.margin_overhead);
    this.margin_profitt = result ? result : '';
    this.calculate_margin_total();
  }

  calculate_unit_price(){
    const obj:any = this.calculate_totals_materials();
    const result = obj.totalMateriales+obj.gk_total_materiales+this.production+this.overhead+this.profitt+this.packing_outside_service+this.tooling_maintance;
    this.unit_price = result ? result : '';
    this.calculate_total();
  }

  calculate_margin_total(){
    const obj:any = this.calculate_totals_materials();
    const result = obj.margin_2_materiales_Total+obj.margen_seguridad_Total+this.margin_4+this.margin_overhead+this.margin_profitt;
    this.margin_total = result ? result : '';
  }

  calculate_kg_material(){
    const obj:any = this.calculate_totals_materials();
    const result = this.eau*obj.parte_g_Total;
    this.kg_material = result ? result : '';
  }

  calculate_moq(){
    const result = this.pcs_hr * 24;
    this.moq = result ? result : '';
  }

  calculate_total(){
    const result = this.eau*this.unit_price;
    this.total = result ?result:'';
  }



  setMateriaPrima(){
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
    objetoEditar.codigo_materia_prima = obj_materiaprima;
    objetoEditar.descripcion_materia_prima = obj_materiaprima;
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
    if (this.array_materiaPrimas.length <= 0) {
      this.toast.warning("Se necesita minimo una materia prima","Sin materias primas");
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
      tipo_maquina: this.seletcedMaquina.machine_type,
      costo_hora_maquina: this.seletcedMaquina.costo_hora,
      cyclus: this.ciclo,
      pcs_hr: this.pcs_hr,
      ineficiencia_porcentaje: this.ineficiencia_percent,
      production: this.production,
      margin_4: this.margin_4,
      packing_cost: this.packing_cost,
      pcs_packing: this.parking_pcs,
      packing: this.packing,
      pcs_entrega: this.pcs_entrega,
      costo_flete: this.costo_flete,
      costo_logistico: this.costo_logistico,
      packing_and_outside_service: this.packing_outside_service,
      hr_mtto: this.hr_mantto,
      cost_hr: this.precioMaquina,
      pcs_mantto: this.pcs_mtto,
      tooling_mantiance: this.tooling_maintance,
      percent_overhead: this.ovh_ind_porc,
      overhead: this.overhead,
      margin_overhead: this.margin_overhead,
      percent_proffit: this.profitt_percent,
      proffit: this.profitt,
      margin_profit: this.margin_profitt,
      unit_price: this.unit_price,
      margin_total: this.margin_total,
      kg_material: this.kg_material,
      moq: this.moq,
      eau: this.eau,
      total: this.total
    }
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
    this.cotizadorService.postGuardarCotizacion(obj_send).subscribe((resp:any)=>{
      this.toast.remove();
      if (resp.status == 500) {
        this.toast.error('Verifique todos los campos de la cotización e intentelo denuevo','Error en Agregar Cotización');
        return;
      }
      console.log(resp);
      this.toast.success('Se agrego corrrectamente la cotización','Cotización Agregada');
      this.route.navigate(['/cotizador']);
    });
  }


  limpiarSecciones(){ 
    this.form_materiaPrima.reset();
    this.selectedParte_codigo = null;
    this.selectedParte_descripcion = null;
    this.cav = '';

    this.array_materiaPrimas = [];
    this.seletcedMaquina = {};
    this.precioMaquina = '';
    this.ciclo = '';
    this.pcs_hr = '';
    this.ineficiencia_percent='';
    this.production = '';
    this.margin_4= '';

    this.packing_cost = '';
    this.parking_pcs = '';
    this.packing = '';
    this.pcs_entrega = '';
    this.costo_flete = '';
    this.costo_logistico= '';

    this.hr_mantto= '';
    this.pcs_mtto='';
    this.tooling_maintance='';

    this.packing_cost='';
    this.parking_pcs='';
    this.packing='';
    this.pcs_entrega='';
    this.costo_flete='';
    this.costo_logistico='';
    this.packing_outside_service='';

    this.ovh_ind_porc='';
    this.overhead='';
    this.margin_overhead='';
    this.profitt_percent='';
    this.profitt='';
    this.margin_profitt='';
    this.unit_price='';
    this.margin_total='';
    
    this.kg_material='';
    this.eau='';
    this.moq='';
    this.total='';
  }
}
