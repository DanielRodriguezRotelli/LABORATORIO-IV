import { Component } from '@angular/core';
import { WelcomeService } from '../../services/welcome.service';
import { Welcome } from '../../interfaces/welcome.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

  isLoading: boolean = true;
  data: Welcome | undefined = undefined;

  constructor( private welcomeService: WelcomeService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.welcomeService.getdata().subscribe((response) => {
      this.data = response;
      this.isLoading = false;
      console.log('INCIÓ EL WELCOME');
    });
  }
}
