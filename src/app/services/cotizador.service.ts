import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Request_ParamIndustria from '../interfaces/Params_Industria.interace';
import Maquinas from '../interfaces/Maquinas.interface';
import request_Maquinas from '../interfaces/Maquinas.interface';
import { Request_Cotizaciones } from '../interfaces/Request_Cotizaciones.interface';

@Injectable({
  providedIn: 'root'
})
export class CotizadorService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http:HttpClient) { }

  getCotizaciones(data: Request_Cotizaciones){
    return this.http.post(this.apiUrl+'/buscarCotizaciones',data);
  }

  getClientesProspectos(){
    return this.http.get(this.apiUrl+'/clientes');
  }

  getVendedores(){
    return this.http.get(this.apiUrl+'/vendedores');
  }

  getPartes(){
    return this.http.get(this.apiUrl+'/partes');
  }

  getMateriales(){
    return this.http.get(this.apiUrl+'/materiales');
  }

  postParamIndustria(data:Request_ParamIndustria){
    return this.http.post(this.apiUrl+'/buscarParamIndustria',data);
  }

  postMaquinas(data:request_Maquinas){
    return this.http.post(this.apiUrl+'/buscarMaquinas',data)
  }



}
