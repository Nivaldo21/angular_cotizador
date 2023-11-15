import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-barmenu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './barmenu.component.html',
  styleUrls: ['./barmenu.component.css']
})
export class BarmenuComponent {
  constructor(private router: Router) {}

  redireccionarALaRuta(ruta: string): void {
    this.router.navigateByUrl(ruta);
  }
}
