/*
 * Copyright [2024] [envite consulting GmbH]
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 *
 *
 */

import { Pipe, PipeTransform } from '@angular/core';
import { KadaiDate } from '../util/kadai.date';

@Pipe({
  name: 'dateTimeZone',
  standalone: false
})
export class DateTimeZonePipe implements PipeTransform {
  private datesMap = new Map<string, string>();

  transform(value: any, format?: string, args?: any): any {
    let date = this.datesMap.get(value);
    if (!date) {
      date = KadaiDate.getDateToDisplay(value, format);
    }
    return date;
  }
}
