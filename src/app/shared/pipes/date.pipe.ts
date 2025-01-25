import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typingTabIds',
})
export class TypingTabIdsPipe implements PipeTransform {
  transform(tabIds: string[]): string {
    return `${tabIds.join(', ')} ${
      tabIds.length === 1 ? 'пишет сообщение...' : 'пишут сообщения...'
    }`;
  }
}
