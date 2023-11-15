import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-estado-resultados',
  templateUrl: './estado-resultados.component.html',
  styleUrls: ['./estado-resultados.component.css']
})
export class EstadoResultadosComponent {

  @Input() id?:string;

  ngOnInit() {
    console.log("el id",this.id); 
  }

  
}
