import { registerLocaleData } from '@angular/common';
import localeEsMX from '@angular/common/locales/es-MX';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Request_Cotizaciones } from 'src/app/interfaces/Request_Cotizaciones.interface';
import { CotizadorService } from 'src/app/services/cotizador.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-cotizador',
  templateUrl: './cotizador.component.html',
  styleUrls: ['./cotizador.component.css']
})
export class CotizadorComponent {

  array_cot: any[] = [];
  form_busqueda: FormGroup;

  sortedColumn: string = '';
  isAscending: boolean = true;

  constructor(private cotizacion:CotizadorService ,private route:Router, private toast: ToastService,  private fb: FormBuilder){
    registerLocaleData(localeEsMX);
    this.form_busqueda = this.fb.group({
      folio_cotizacion:[''],
      fecha_generacion_desde:[''],
      fecha_generacion_hasta:[''],
      cliente:[''],
      estatus:['']
    });
  }

  ngOnInit(): void {
    this.getCotizaciones(true);
  }

  sortColumn(column: string) {
    if (this.sortedColumn === column) {
      this.isAscending = !this.isAscending;
    } else {
      this.sortedColumn = column;
      this.isAscending = true;
    }
    // Lógica para ordenar los datos en la columna seleccionada
    this.array_cot.sort((a, b) => {
      let aValue;
      let bValue;
      if (column == 'vendedor') {
        aValue = a[column].nombre_vendedor;
        bValue = b[column].nombre_vendedor;
      }else if(column == 'cliente'){
        aValue = a[column].CLI_NOMBRE;
        bValue = b[column].CLI_NOMBRE;
      }else{
        aValue = column === 'total' ? parseFloat(a[column]) : a[column];
        bValue = column === 'total' ? parseFloat(b[column]) : b[column];
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return this.isAscending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return this.isAscending ? (aValue - bValue) : (bValue - aValue);
      }
    });
  }

  getCotizaciones(init:boolean = false){
    const fechaDesde = this.form_busqueda.value.fecha_generacion_desde;
    const fechaHasta = this.form_busqueda.value.fecha_generacion_hasta;
    if (!init) this.toast.charge("procesando petición","Cargando...");
    if (!init && (fechaDesde === '' && fechaHasta !== '' || fechaDesde !== '' && fechaHasta === '')) {
      this.toast.remove();
      this.toast.warning('Debes de proporcionar las dos o ninguna','Fechas incompletas')
      return;
    }

    let data:Request_Cotizaciones = this.form_busqueda.value;
    this.cotizacion.getCotizaciones(data).subscribe((resp:any)=>{
      if (!init) this.toast.remove();
      if(!resp){ 
        this.array_cot = []; 
        return; 
      }
      if (resp.length > 0) {
        this.array_cot = resp;
      }else{
        this.toast.info("Vuelva a intentar con otros filtros","No se encontrarón registros");
        this.array_cot = [];
      } 
    })
  }

  consultarCotizacion(cotizacion_code:string){
    this.route.navigate([`form-cotizador/${true}/${cotizacion_code}`]);
  }

  consultarEstadoResultados(cotizacion_code:string){
    this.route.navigate([`estado-resultados/${cotizacion_code}`]);
  }

  generarCotizacion(){
    this.route.navigate([`form-cotizador`]);
  }
}
