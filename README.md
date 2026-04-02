## Next.js App Router Course - Starter

This is the starter template for the Next.js App Router Course. It contains the starting code for the dashboard application.

For more information, see the [course curriculum](https://nextjs.org/learn) on the Next.js Website.

<hr />

### clsx
클래스명을 쉽게 전환할 수 있도록 해주는 라이브러리 (조건부 처리)
```
// 예시
<span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-sm',
        {
          'bg-gray-100 text-gray-500': status === 'pending',
          'bg-green-500 text-white': status === 'paid',
        },
      )}
    >
```

### 폰트 최적화
프로젝트에서 사용자 지정 폰트를 사용할 경우 폰트 파일을 가져와 로드해야 하므로 성능에 영향을 미칠 수 있음.
폰트의 경우, 레이아웃 변화는 브라우저가 처음에 기본 폰트이나 시스템 폰트로 텍스트를 렌더링한 후, 사용자 지정 폰트이 로드되면 해당 폰트로 교체할 때 발생하기 때문에, 이로 인해 텍스트 크기, 간격 또는 레이아웃이 변경되어 주변 요소들에 영향을 미침.
Next.js 모듈은 next/font를 사용하여 빌드 시점에 폰트 파일을 다운로드하여 다른 정적 자산과 함께 미리 호스팅됨.
따라서, 폰트 관련 추가 네트워크 요청이 발생하지 않아 성능 저하 방지

### 이미지 최적화
정적 자산을 취상위 /public 폴더에 제공하여 참조 => next/image
<Image> 컴포넌트는 <img> 태그의 확장 기능으로써, 다음과 같은 자동 이미지 최적화 기능을 제공
- 이미지 로딩 시 레이아웃이 자동으로 변경되는 것 방지
- 화면 크기가 작은 기기에 큰 이미지를 전송하지 않도록 이미지 크기 조정
- 기본적으로 이미지는 지연 로딩됨 (이미지가 뷰포트에 들어올 때 로드)
- WebP와 같은 최신 형식으로 이미지 제공

### 중첩 라우팅
폴더를 사용 하여 중첩된 경로를 생성하는 파일 시스템 라우팅을 사용
중첩된 경로를 만들려면 폴더를 서로 중첩하고 그 안에 page.tsx 파일을 추가

### 부분 렌더링
페이지 이동 시 페이지 구성 요소만 업데이트되고 레이아웃은 리렌더링되지 않음
=> 페이지 전환 시 레이아웃을 클라이언트 측 React 상태를 유지

### 네비게이션 작동 방식
#### 서버 렌더링
Next.js에서 `레이아웃`과 `페이지`는 React 서버 컴포넌트이며,
최초 및 이후 탐색 시 서버 구성 요소 페이로드는 클라이언트로 전송되기 전 서버에서 생성


#### * .next
Next.js가 생성하는 빌드 산출물 + 캐시 > dev 서버를 돌릴 때마다 생성/갱신
- 컴파일된 서버/클라이언트 코드: TS/JS를 Next가 번들해서 실행 가능한 형태로 만든 결과물
- 라우팅/모듈 매니페스트: 어떤 route가 어떤 파일을 쓰는지에 대한 내부 매핑 정보
- dev용 청크/런타임 파일: Turbopack/Next dev가 핫리로드/증분 컴파일을 하도록 필요한 조각들
- source map 관련 파일들: 디버깅용 매핑 정보(그래서 로그에 Invalid source map 같은 메시지가 섞여 보일 때가 있음)
필요한 이유?
.next에 결과물을 저장해두고 다음 요청/다음 컴파일에서 재사용 > 성능 향상
특히 dev 모드에서는 변경 감지(Hot Reload)를 위해 사용됨