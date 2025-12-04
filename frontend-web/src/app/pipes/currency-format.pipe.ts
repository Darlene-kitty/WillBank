import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyService } from '../services/currency.service';

@Pipe({
  name: 'currencyFormat',
  standalone: true,
  pure: false // Pour réagir aux changements de devise
})
export class CurrencyFormatPipe implements PipeTransform {
  constructor(private currencyService: CurrencyService) {}

  transform(value: number | null | undefined, currencyCode?: string): string {
    if (value === null || value === undefined) {
      return '0';
    }
    return this.currencyService.formatAmount(value, currencyCode);
  }
}
