'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce'; //* 디바운싱 라이브러리

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  //* 디바운스된 함수 생성 > 300ms 디바운스
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams); // URL 쿼리 매개변수를 조작하기 위한 유틸리티 메서드를 제공하는 웹 API
    params.set('page', '1'); // 새 검색 시 첫 번째 페이지로 이동
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`); // 현재 경로를 새로운 쿼리 매개변수와 함께 업데이트
  }, 300); // 300ms 디바운스

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
      {/* URL과 입력값을 동기화 상태로 유지 > searchParams 값을 읽어 입력 필드 defaultValue로 전달 */}
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
