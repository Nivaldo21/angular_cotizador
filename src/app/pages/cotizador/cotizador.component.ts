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
  array_cot_aux: any[] = [];
  form_busqueda: FormGroup;

  sortedColumn: string = '';
  isAscending: boolean = true;

  itemsPerPage = 10; // Elementos por página
  currentPage = 1; // Página actual
  totalPages: number = 1;
  pages: number[] = [];

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

  calculateTotalPages(){
    this.totalPages = Math.ceil(this.array_cot.length / this.itemsPerPage);
    this.pages = Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  setPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    // Calcular el índice de inicio y fin de los elementos para la página actual
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage - 1, this.array_cot.length - 1);

    // Obtener los elementos correspondientes a la página actual
    this.array_cot_aux = this.getItemsForPage(startIndex, endIndex);
  }

  getItemsForPage(startIndex: number, endIndex: number): any[] {
    // Utiliza tu arreglo de datos original para obtener los elementos de la página actual
    // Aquí debes adaptar esto a tu lógica específica para obtener los elementos correctos del arreglo completo.
    return this.array_cot.slice(startIndex, endIndex + 1);
  }

  getFirstItemIndex(): number {
    return ((this.currentPage - 1) * this.itemsPerPage) + 1;
  }
  
  getLastItemIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.array_cot.length);
  }

  sortColumn(column: string) {
    if (this.sortedColumn === column) {
      this.isAscending = !this.isAscending;
    } else {
      this.sortedColumn = column;
      this.isAscending = true;
    }
    // Lógica para ordenar los datos en la columna seleccionada
    this.array_cot_aux.sort((a, b) => {
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
        this.calculateTotalPages();
        this.setPage(1);
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
