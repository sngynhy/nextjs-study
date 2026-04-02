import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';

// Root layout 컴포넌트 > 모든 페이지의 공통 레이아웃을 정의
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* 📌 전역으로 폰트 적용 */}
      <body className={`${inter.className} antialiased`}>{children}</body>
      {/* <body>{children}</body> */}
    </html>
  );
}
