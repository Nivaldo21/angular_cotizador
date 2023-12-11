import { Component, Input } from '@angular/core';
import { CotizacionDetalleItem } from 'src/app/interfaces/Estado_resultados.interface';
import { CotizadorService } from 'src/app/services/cotizador.service';

@Component({
  selector: 'app-estado-resultados',
  templateUrl: './estado-resultados.component.html',
  styleUrls: ['./estado-resultados.component.css']
})
export class EstadoResultadosComponent {

  @Input() id?:string;

  constructor(private cotizadorService:CotizadorService){}

  fecha:string = '';
  cliente_prospecto:string = '';
  vendedor:string = '';
  array_partes:CotizacionDetalleItem[] = [];

  sortedColumn: string = '';
  isAscending: boolean = true;


  ngOnInit() {
    this.getData();
  }

  getData(){
    this.cotizadorService.getDetailsEstadoResultados(this.id ? this.id : "0").subscribe((resp:any)=>{
      this.cliente_prospecto = resp.data.cliente_prospecto.CLI_NOMBRE;
      this.vendedor = resp.data.vendedor.nombre_vendedor;
      
      const fechaCompleta = resp.data.cotizacion_data.fecha_generacion;
      const partesFecha = fechaCompleta.substring(0, 10).split('-');
      this.fecha = `${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`;
      
      this.array_partes = resp.data.cotizacion_detalle_array;
    })
  }

  sortColumn(column: any) {
    if (this.sortedColumn === column) {
      this.isAscending = !this.isAscending;
    } else {
      this.sortedColumn = column;
      this.isAscending = true;
    }
    // Lógica para ordenar los datos en la columna seleccionada
    this.array_partes.sort((a, b) => {
      let aValue: any;
      let bValue: any;
      if (column == 'parteEncontrada') {
        aValue = a[column as keyof CotizacionDetalleItem].nombre_parte;
        bValue = b[column as keyof CotizacionDetalleItem].nombre_parte;
      }else{
        aValue = column === 'codigo_parte' ? a[column as keyof CotizacionDetalleItem] : parseFloat(a[column as keyof CotizacionDetalleItem]);
        bValue = column === 'codigo_parte' ? b[column as keyof CotizacionDetalleItem] : parseFloat(b[column as keyof CotizacionDetalleItem]);
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return this.isAscending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return this.isAscending ? (aValue - bValue) : (bValue - aValue);
      }
    });
  }

  calculateTotals(){ 
    return {
      ingresos: this.array_partes.reduce((acc, item:any) => acc + (Number(item.ingresos) || 0), 0),
      costo_ventas: this.array_partes.reduce((acc, item:any) => acc + (Number(item.costo_ventas) || 0), 0),
      costo_materia_prima: this.array_partes.reduce((acc, item:any) => acc + (Number(item.costo_materia_prima) || 0), 0),
      costo_mano_obra: this.array_partes.reduce((acc, item:any) => acc + (Number(item.costo_mano_obra) || 0), 0),
      gastos_fabricacion: this.array_partes.reduce((acc, item:any) => acc + (Number(item.gastos_fabricacion) || 0), 0),
      utilidad_bruta: this.array_partes.reduce((acc, item:any) => acc + (Number(item.utilidad_bruta) || 0), 0),
      egresos: this.array_partes.reduce((acc, item:any) => acc + (Number(item.egresos) || 0), 0),
      gastos_fijos: this.array_partes.reduce((acc, item:any) => acc + (Number(item.gastos_fijos) || 0), 0),
      utilidad_antes_ebitda: this.array_partes.reduce((acc, item:any) => acc + (Number(item.utilidad_antes_ebitda) || 0), 0),
      isr: this.array_partes.reduce((acc, item:any) => acc + (Number(item.isr) || 0), 0),
      ptu: this.array_partes.reduce((acc, item:any) => acc + (Number(item.ptu) || 0), 0),
      utilidad_neta: this.array_partes.reduce((acc, item:any) => acc + (Number(item.utilidad_neta) || 0), 0),
      /* margen_antes_ebitda: this.array_partes.reduce((acc, item:any) => acc + (Number(item.margen_antes_ebitda) || 0), 0),
      margen_neto: this.array_partes.reduce((acc, item:any) => acc + (Number(item.margen_neto) || 0), 0) */
    }
  }

  calculate_margins(){
    const margen_antes_ebitda_TABLE = (this.calculateTotals().utilidad_neta/this.calculateTotals().ingresos)*100;
    const margen_neto_TABLE = (this.calculateTotals().utilidad_antes_ebitda -  ( this.calculateTotals().utilidad_antes_ebitda * 0.3) - (this.calculateTotals().utilidad_antes_ebitda * 0.1)) / this.calculateTotals().ingresos;
    return {
      margen_antes_ebitda: margen_antes_ebitda_TABLE,
      margen_neto: margen_neto_TABLE * 100
    }
  }
}
