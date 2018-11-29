import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockActions } from '@ngrx/effects/testing';

import { hot, cold } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';

import { OccProductService } from '../../occ/product.service';
import { PageType } from '../../../occ-models/occ.models';
import { ProductImageConverterService } from '../converters/product-image-converter.service';
import { ProductReferenceConverterService } from '../converters/product-reference-converter.service';

import * as fromEffects from './product.effect';
import * as fromActions from '../actions/product.action';
import { StoreModule } from '@ngrx/store';
import { RoutingService } from '../../../routing/facade/routing.service';

import { OccConfig } from '../../../occ/config/occ-config';

const MockOccModuleConfig: OccConfig = {
  server: {
    baseUrl: '',
    occPrefix: ''
  }
};

const router = {
  state: {
    url: '/',
    queryParams: {},
    params: {},
    context: { id: '1', type: PageType.PRODUCT_PAGE },
    cmsRequired: false
  }
};
const mockRoutingService = {
  routerState$: of(router)
};

xdescribe('Product Effects', () => {
  let actions$: Observable<any>;
  let service: OccProductService;
  let effects: fromEffects.ProductEffects;

  const productCode = 'testCode';
  const product = {
    code: 'testCode',
    name: 'testProduct'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StoreModule.forRoot({})],
      providers: [
        OccProductService,
        ProductImageConverterService,
        ProductReferenceConverterService,
        { provide: OccConfig, useValue: MockOccModuleConfig },
        fromEffects.ProductEffects,
        provideMockActions(() => actions$),
        { provide: RoutingService, useValue: mockRoutingService }
      ]
    });
    service = TestBed.get(OccProductService);
    effects = TestBed.get(fromEffects.ProductEffects);

    spyOn(service, 'loadProduct').and.returnValue(of(product));
  });

  describe('loadProduct$', () => {
    it('should return searchResult from SearchProductsSuccess', () => {
      const action = new fromActions.LoadProduct(productCode);
      const completion = new fromActions.LoadProductSuccess(product);

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      console.log('expected', expected);
      effects.loadProduct$.subscribe(p => console.log('p', p));
      expect(effects.loadProduct$).toBeObservable(expected);
    });
  });
});
