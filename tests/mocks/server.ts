import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers); // mock api 서버 생성
