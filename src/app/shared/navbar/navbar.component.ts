import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarmenuComponent } from '../barmenu/barmenu.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,BarmenuComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

}
