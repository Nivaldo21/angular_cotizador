import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import Request_ParamIndustria from '../interfaces/Params_Industria.interace';
import Maquinas from '../interfaces/Maquinas.interface';
import request_Maquinas from '../interfaces/Maquinas.interface';
import { Request_Cotizaciones, Request_cotizacion_save } from '../interfaces/Request_Cotizaciones.interface';
import { FormPdf } from '../interfaces/CotizacionPDF.interface';

@Injectable({
  providedIn: 'root'
})
export class CotizadorService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http:HttpClient) { }

  getCotizaciones(data: Request_Cotizaciones):Observable<any>{
    return this.http.post(this.apiUrl+'/buscarCotizaciones',data);
  }

  postGuardarCotizacion(data: Request_cotizacion_save){
    return this.http.post(this.apiUrl+'/guardarCotizacion',data);
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

  getDeatalleCotizacion(code_cotizacion:string){
    return this.http.get(this.apiUrl+'/getCotizacionByCode/'+code_cotizacion);
  }

  getDetailsEstadoResultados(code_cotizacion:string){
    return this.http.get(this.apiUrl+'/getCotizacionEstadoResultadosByCode/'+code_cotizacion);
  }

  getCotizacionPDF(data: FormPdf): Observable<Blob> {
    return this.http.post<Blob>(`${this.apiUrl}/pdf`, data, {
      responseType: 'blob' as 'json', // Definir responseType como 'blob'
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

}
