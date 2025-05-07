import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VerseComponent } from "./features/verse-of-day/verse/verse.component";
import { ApiService } from './core/services/api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, VerseComponent],
  templateUrl: './app.component.html',
  providers: [ApiService],
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FalaDeus';
}
