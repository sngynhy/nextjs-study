import { Inter, Lusitana } from 'next/font/google';

// Inter 모듈에서 앱 전체에 적용할 폰트를 가져옴 > layout.tsx에서 사용
export const inter = Inter({ subsets: ['latin'] });

export const lusitana = Lusitana({ subsets: ['latin'], weight: ['400', '700'] });