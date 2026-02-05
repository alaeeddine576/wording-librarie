import { Pipe, PipeTransform, inject } from '@angular/core';
import { WordingService } from '../../core/services/wording.service';

@Pipe({
    name: 'translate',
    standalone: true,
    pure: false // Important : permet au pipe de se rafraîchir quand le Signal change
})
export class TranslatePipe implements PipeTransform {
    private wordingService = inject(WordingService);

    transform(key: string): string {
        return this.wordingService.get(key);
    }
}