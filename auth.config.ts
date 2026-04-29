import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    // 인증 콜백 함수 > 인증 상태에 따라 접근 권한을 체크하여 리다이렉트 처리
    // 요청이 완료되기 전에 호출 > 
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;

//* NextAuthConfig 타입은 NextAuth.js의 구성 옵션 설정을 위한 인터페이스
//* 사용자 지정 로그인, 로그아웃, 오류 페이지의 경로 지정 가능 > 기본값은 /login, /logout, /error
//* providers 속성은 인증 제공자를 설정하는 옵션 > 기본값은 없음
//* 참고) https://nextjs.org/learn/dashboard-app/adding-authentication#adding-the-credentials-provider