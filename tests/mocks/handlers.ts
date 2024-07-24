import { http, HttpResponse } from 'msw';

// mock api 설정
export const handlers = [
  http.get('/categories', () => {
    return HttpResponse.json([
      { id: 1, name: 'Electronics' },
      { id: 2, name: 'Beauty' },
      { id: 3, name: 'Gardening' },
    ]);
  }),
];
