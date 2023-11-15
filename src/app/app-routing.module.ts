import { NgModule } from '@angular/core';
import { RouterModule, Routes, withComponentInputBinding } from '@angular/router';
import { FormCotizadorComponent } from './pages/form-cotizador/form-cotizador.component';
import { CotizadorComponent } from './pages/cotizador/cotizador.component';
import { EstadoResultadosComponent } from './pages/estado-resultados/estado-resultados.component';

const routes: Routes = [
  { path: '', redirectTo: 'cotizador', pathMatch: 'full'},
  { path: 'cotizador', component: CotizadorComponent },
  { path: 'form-cotizador', component: FormCotizadorComponent },
  { path: 'estado-resultados/:id', component: EstadoResultadosComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {bindToComponentInputs: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
