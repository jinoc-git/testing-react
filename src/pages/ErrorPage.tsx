import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  const prod = import.meta.env.PROD;

  return (
    <div>
      <main className="prose p-5">
        <h1>Oops...</h1>
        {isRouteErrorResponse(error) // 라우터 경로 매칭 실패인지 확인
          ? 'The requested page was not found.' // 매칭 실패면 not found
          : prod // 매칭 실패가 아닌 오류일 때 프로덕션 환경인지 확인
          ? 'An unexpected error occurred.' // 프로덕션 환경이면 자세한 에러메시지 표시x
          : (error as Error).message}
        {/* 개발 환경이면 에러 메시지 표시 */}
      </main>
    </div>
  );
};

export default ErrorPage;
