// import { http, HttpResponse } from 'msw';
// import { products } from './data';
import { db } from './db';

// mock api 설정
// test코드에서 컴포넌트를 render할 때 api 요청을 msw가 intercept함
export const handlers = [
  // http.get('/categories', () => {
  //   return HttpResponse.json([
  //     { id: 1, name: 'Electronics' },
  //     { id: 2, name: 'Beauty' },
  //     { id: 3, name: 'Gardening' },
  //   ]);
  // }),
  // http.get('/products', () => {
  //   return HttpResponse.json(products);
  // }),
  // http.get('/products/:id', ({ params }) => {
  //   const id = parseInt(params.id as string);
  //   const product = products.find((product) => product.id === id);
  //   if (!product) return new HttpResponse(null, { status: 404 });
  //   return HttpResponse.json(product);
  // }),
  // mock api를 mswjs/data로 교체
  ...db.product.toHandlers('rest'),
  ...db.category.toHandlers('rest'),
];
