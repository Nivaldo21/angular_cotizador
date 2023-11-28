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
      margen_antes_ebitda: this.array_partes.reduce((acc, item:any) => acc + (Number(item.margen_antes_ebitda) || 0), 0),
      isr: this.array_partes.reduce((acc, item:any) => acc + (Number(item.isr) || 0), 0),
      ptu: this.array_partes.reduce((acc, item:any) => acc + (Number(item.ptu) || 0), 0),
      utilidad_neta: this.array_partes.reduce((acc, item:any) => acc + (Number(item.utilidad_neta) || 0), 0),
      margen_neto: this.array_partes.reduce((acc, item:any) => acc + (Number(item.margen_neto) || 0), 0)
    }
  }
}
