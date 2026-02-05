import { Component, inject } from '@angular/core';
import { TranslatePipe } from './shared/pipes/translate.pipe';
import { WordingService } from './core/services/wording.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  private wordingService = inject(WordingService);

  changeLanguage(lang: string) {
    this.wordingService.switchLanguage(lang);
  }
}