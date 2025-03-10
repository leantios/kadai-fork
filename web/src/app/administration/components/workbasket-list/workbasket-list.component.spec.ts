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

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WorkbasketListComponent } from './workbasket-list.component';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { Actions, NgxsModule, ofActionDispatched, Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { WorkbasketState } from '../../../shared/store/workbasket-store/workbasket.state';
import { WorkbasketService } from '../../../shared/services/workbasket/workbasket.service';
import { MatDialogModule } from '@angular/material/dialog';
import { OrientationService } from '../../../shared/services/orientation/orientation.service';
import { ImportExportService } from '../../services/import-export.service';
import { DeselectWorkbasket, SelectWorkbasket } from '../../../shared/store/workbasket-store/workbasket.actions';
import { WorkbasketSummary } from '../../../shared/models/workbasket-summary';
import { Direction, Sorting, WorkbasketQuerySortParameter } from '../../../shared/models/sorting';
import { WorkbasketType } from '../../../shared/models/workbasket-type';
import { Page } from '../../../shared/models/page';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { DomainService } from '../../../shared/services/domain/domain.service';
import { RouterTestingModule } from '@angular/router/testing';
import { RequestInProgressService } from '../../../shared/services/request-in-progress/request-in-progress.service';
import { selectedWorkbasketMock } from '../../../shared/store/mock-data/mock-store';
import { WorkbasketQueryFilterParameter } from '../../../shared/models/workbasket-query-filter-parameter';

const workbasketSavedTriggeredFn = jest.fn().mockReturnValue(of(1));
const workbasketSummaryFn = jest.fn().mockReturnValue(of({}));
const getWorkbasketFn = jest.fn().mockReturnValue(of(selectedWorkbasketMock));
const getWorkbasketActionToolbarExpansionFn = jest.fn().mockReturnValue(of(false));
const workbasketServiceMock: Partial<WorkbasketService> = {
  workbasketSavedTriggered: workbasketSavedTriggeredFn,
  getWorkBasketsSummary: workbasketSummaryFn,
  getWorkBasket: getWorkbasketFn,
  getWorkbasketActionToolbarExpansion: getWorkbasketActionToolbarExpansionFn,
  getWorkBasketAccessItems: jest.fn().mockReturnValue(of({})),
  getWorkBasketsDistributionTargets: jest.fn().mockReturnValue(of({}))
};

const getOrientationFn = jest.fn().mockReturnValue(of('landscape'));
const orientationServiceMock: Partial<OrientationService> = {
  getOrientation: getOrientationFn,
  calculateNumberItemsList: jest.fn().mockReturnValue(1920)
};

const importExportServiceMock: Partial<ImportExportService> = {
  getImportingFinished: jest.fn().mockReturnValue(of(true))
};

const domainServiceSpy: Partial<DomainService> = {
  getSelectedDomainValue: jest.fn().mockReturnValue(of()),
  getSelectedDomain: jest.fn().mockReturnValue(of())
};

const requestInProgressServiceSpy: Partial<RequestInProgressService> = {
  setRequestInProgress: jest.fn().mockReturnValue(of()),
  getRequestInProgress: jest.fn().mockReturnValue(of(false))
};

@Component({ selector: 'kadai-administration-workbasket-list-toolbar', template: '' })
class WorkbasketListToolbarStub {
  @Input() workbaskets: Array<WorkbasketSummary>;
  @Input() workbasketDefaultSortBy: string;
  @Input() workbasketListExpanded: boolean;
  @Output() performSorting = new EventEmitter<Sorting<WorkbasketQuerySortParameter>>();
}

@Component({ selector: 'kadai-administration-icon-type', template: '' })
class IconTypeStub {
  @Input() type: WorkbasketType;
  @Input() selected = false;
}

@Component({ selector: 'kadai-shared-pagination', template: '' })
class PaginationStub {
  @Input() page: Page;
  @Input() type: String;
  @Input() expanded: boolean;
  @Output() changePage = new EventEmitter<number>();
  @Input() numberOfItems: number;
}

@Component({ selector: 'svg-icon', template: '' })
class SvgIconStub {}

describe('WorkbasketListComponent', () => {
  let fixture: ComponentFixture<WorkbasketListComponent>;
  let debugElement: DebugElement;
  let component: WorkbasketListComponent;
  let store: Store;
  let actions$: Observable<any>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([WorkbasketState]),
        RouterTestingModule,
        MatDialogModule,
        FormsModule,
        MatProgressBarModule,
        MatSelectModule,
        MatListModule
      ],
      declarations: [WorkbasketListComponent],
      providers: [
        WorkbasketListToolbarStub,
        IconTypeStub,
        PaginationStub,
        SvgIconStub,
        {
          provide: WorkbasketService,
          useValue: workbasketServiceMock
        },
        {
          provide: OrientationService,
          useValue: orientationServiceMock
        },
        { provide: ImportExportService, useValue: importExportServiceMock },
        {
          provide: DomainService,
          useValue: domainServiceSpy
        },
        { provide: RequestInProgressService, useValue: requestInProgressServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkbasketListComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    actions$ = TestBed.inject(Actions);
    fixture.detectChanges();
  }));

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch SelectWorkbasket when selecting a workbasket', waitForAsync(() => {
    component.selectedId = undefined;
    fixture.detectChanges();
    let actionDispatched = false;
    actions$.pipe(ofActionDispatched(SelectWorkbasket)).subscribe(() => (actionDispatched = true));
    component.selectWorkbasket('WBI:000000000000000000000000000000000902');
    expect(actionDispatched).toBe(true);
  }));

  it('should dispatch DeselectWorkbasket when selecting a workbasket again', waitForAsync(() => {
    component.selectedId = '123';
    fixture.detectChanges();
    let actionDispatched = false;
    actions$.pipe(ofActionDispatched(DeselectWorkbasket)).subscribe(() => (actionDispatched = true));
    const mockId = '123';
    component.selectWorkbasket(mockId);
    expect(actionDispatched).toBe(true);
    expect(component.selectedId).toEqual(undefined); //because Deselect action sets selectedId to undefined
  }));

  it('should set sort value when performSorting is called', () => {
    const sort: Sorting<WorkbasketQuerySortParameter> = {
      'sort-by': WorkbasketQuerySortParameter.TYPE,
      order: Direction.ASC
    };
    component.performSorting(sort);
    expect(component.sort).toMatchObject(sort);
  });

  it('should set filter value without updating domain when performFilter is called', () => {
    component.filterBy = { domain: ['123'] };
    const filter: WorkbasketQueryFilterParameter = { 'name-like': ['workbasket'], domain: [''] };
    component.performFilter(filter);
    expect(component.filterBy).toMatchObject({ 'name-like': ['workbasket'], domain: ['123'] });
  });

  it('should change page value when change page function is called ', () => {
    const page = 2;
    component.changePage(page);
    expect(component.pageParameter.page).toBe(page);
  });

  it('should call performFilter when filter value from store is obtained', () => {
    const performFilter = jest.spyOn(component, 'performFilter');
    component.ngOnInit();
    expect(performFilter).toHaveBeenCalled();
  });
});
