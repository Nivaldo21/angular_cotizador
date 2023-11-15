import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CotizadorComponent } from './pages/cotizador/cotizador.component';
import { FormCotizadorComponent } from './pages/form-cotizador/form-cotizador.component';
import { EstadoResultadosComponent } from './pages/estado-resultados/estado-resultados.component';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NavbarComponent } from './shared/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    CotizadorComponent,
    FormCotizadorComponent,
    EstadoResultadosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-center',
      tapToDismiss: false,
      timeOut: 5000
    }),
    NavbarComponent
  ],
  providers: [    
    provideAnimations(), // required animations providers
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
