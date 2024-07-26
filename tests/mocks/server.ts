import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// msw는 api 엔드포인트에 대한 요청을 가로챌 수 있음
export const server = setupServer(...handlers); // mock api 서버 생성
