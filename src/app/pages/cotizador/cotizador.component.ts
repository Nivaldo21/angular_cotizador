import { registerLocaleData } from '@angular/common';
import localeEsMX from '@angular/common/locales/es-MX';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Request_Cotizaciones } from 'src/app/interfaces/Request_Cotizaciones.interface';
import { CotizadorService } from 'src/app/services/cotizador.service';

@Component({
  selector: 'app-cotizador',
  templateUrl: './cotizador.component.html',
  styleUrls: ['./cotizador.component.css']
})
export class CotizadorComponent {

  array_cot: any[] = [];
  form_busqueda: FormGroup;

  constructor(private cotizacion:CotizadorService ,private route:Router, private toast:ToastrService,  private fb: FormBuilder){
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

  getCotizaciones(init:boolean = false){
    if (!init) this.toast.show("procesando petición","Cargando...",{disableTimeOut:true},'toast-custom');
    let data:Request_Cotizaciones = this.form_busqueda.value;
    this.cotizacion.getCotizaciones(data).subscribe((resp:any)=>{
      this.toast.clear();
      if(!resp){ this.array_cot = []; return; }
      if (resp.length > 0) {
        this.array_cot = resp;
      }else{
        this.toast.info("Vuelva a intentar con otros filtros","No se encontrarón registros")
        this.array_cot = [];
      } 
    })
  }

  generarCotizacion(){
    this.route.navigate(['form-cotizador']);
  }
}
