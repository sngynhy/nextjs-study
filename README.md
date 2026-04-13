## Next.js App Router Course - Starter

This is the starter template for the Next.js App Router Course. It contains the starting code for the dashboard application.

For more information, see the [course curriculum](https://nextjs.org/learn) on the Next.js Website.

<hr />

### \* .next

Next.js가 생성하는 빌드 산출물 + 캐시 > dev 서버를 돌릴 때마다 생성/갱신

- 컴파일된 서버/클라이언트 코드: TS/JS를 Next가 번들해서 실행 가능한 형태로 만든 결과물
- 라우팅/모듈 매니페스트: 어떤 route가 어떤 파일을 쓰는지에 대한 내부 매핑 정보
- dev용 청크/런타임 파일: Turbopack/Next dev가 핫리로드/증분 컴파일을 하도록 필요한 조각들
- source map 관련 파일들: 디버깅용 매핑 정보(그래서 로그에 Invalid source map 같은 메시지가 섞여 보일 때가 있음)
  필요한 이유?
  .next에 결과물을 저장해두고 다음 요청/다음 컴파일에서 재사용 > 성능 향상
  특히 dev 모드에서는 변경 감지(Hot Reload)를 위해 사용됨

### use client

클라이언트 컴포넌트로써, 이벤트 리스너와 훅 사용 가능

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

### Request Waterfall

이전 요청의 완료 여부에 따라 다음 요청이 순차적으로 진행되는 네트워크 요청을 의미
데이터를 가져올 때, 각 요청은 이전 요청이 데이터를 반환한 후에만 시작될 수 있음
다음 요청을 보내기 전 특정 조건이 충족되어야 하는 경우 워터폴 방식이 유용
ex) 사용자의 id와 프로필 정보를 먼저 가져온 다음, id를 얻은 후 친구 목록을 가져오는 경우 각 요청은 이전 요청에서 반환받은 데이터에 따라 달라짐

```
const revenue = await fetchRevenue();
const latestInvoices = await fetchLatestInvoices(); // wait for fetchRevenue() to finish
const { numberOfInvoices, numberOfCustomers, totalPaidInvoices, totalPendingInvoices } = await fetchCardData(); // wait for fetchLatestInvoices() to finish
```

속도 저하로 성능에 문제가 될 수 있음.

### 병렬데이터 가져오기

워터폴 현상을 피하기 위한 방법으로, 모든 데이터 요청을 동시에 즉, 병렬로 시작
Promise.all() 또는 Promise.allSettled()

- 워터폴 방식처럼 각 요청이 완료될 때까지 기다리는 것보다 속도가 빠름
- 네이티브 자바스크립트 패턴을 사용할 것

### 정적 렌더링

정적 렌더링을 사용하면 데이터 가져오기 및 렌더링은 빌드 시점 또는 데이터 재검증 시 서버에서 발생하고,
사용자가 앱을 방문할 때마다 캐시 결과를 제공

- 웹 사이트 속도 향상: 사전 렌더링 콘텐츠는 vercel과 같은 플랫폼에 배포 시 캐시됨 > 사용자가 빠르고 안전하게 접근 가능
- 서버 부하 감소: 콘텐츠가 캐시되므로 서버는 각 요청에 대해 콘텐츠를 동적으로 생성할 필요가 없음 > 컴퓨팅 비용 절감
- SEO 성능 향상: 사전 렌더링된 콘텐츠는 페이지 로드 시 이미 제공되므로 검색 엔진 크롤러가 색인화하기 쉬움

### 동적 렌더링

동적 렌더링을 사용하면 사용자가 페이지를 방문하는 시점(요청)에 서버에서 각 사용자에 맞게 콘텐츠가 제공됨

- 실시간 데이터: 실시간 또는 자주 업데이트되는 데이터 표시 가능
- 사용자 맞춤형 콘텐츠: 대시보드나 사용자 프로필과 같은 개인화된 콘텐츠를 제공하고 사용자 상호 작용에 따라 데이터 업데이트 가능
- 요청 시간 정보: 쿠키 또는 URL 검색 매개변수와 같이 요청 시점에만 알 수 있는 정보 접근 가능

### 스트리밍

데이터 전송 기술로, 경로를 더 작은 Chunk로 나누고 서버에서 클라이언트에 준비되는 대로 점진적으로 전송할 수 있도록 해줌
느린 데이터 요청으로 인한 페이지 전체가 차단되는 것을 방지 > 사용자는 모든 데이터가 로드될 때까지 기다리지 않고, 페이지의 일부를 보고 상호 작용 가능

#### Nextjs에서 스트리밍을 구현하는 방법

- 페이지 수준에서는, loading.tsx 파일 사용 (시스템이 <Suspense>를 자동으로 생성)
- 구성 요소(특정 컴포넌트) 수준에서는, <Suspense>를 사용하여 더욱 세밀한 제어 가능

### 컴포넌트 스트리밍 📌

React Suspense를 사용하여 특정 컴포넌트만 스트리밍하는 등 세분화된 방식으로 작업
데이터 로드 등과 같은 특정 조건이 충족될 때까지 앱의 일부 렌더링 지연할 수 있음
동적 컴포넌트를 Suspense로 감싸고, 동적 컴포넌트가 로드되는 동안 표시할 대체 컴포넌트 전달 가능

#### Suspense 바운더리를 어디에 배치할지 경정하는 기준

- 페이지가 스트리밍되는 동안 사용자가 어떤 경험을 하기를 원하는지?
- 어떤 콘텐츠를 우선시하고 싶은지?
- 구성 요소가 데이터 호출에 의존하는지? 등

## Route Groups

route를 카테고리별로 정리할 수 있는 폴더 규칙 > URL route 구조에 영향을 주지 않고 파일을 논리적인 그룹으로 구성
ex) (overview)와 같이 괄호를 사용하여 폴더이름 명명
이 규칙은 해당 폴더가 정리 목적으로 사용되며, route url에 포함되어서는 안됨

- 관심사, 기능별로 경로 구성
- 여러 루트 레이아웃 정의
- 특정 경로 구간만 레이아웃을 공유하도록 선택하고 다른 구간은 제외

### URL Search Params

(클라이언트 대신) 검색 상태 관리 및 페이지네이션 기능 구현

- 즐겨찾기 및 공유 가능한 URL: 검색 매개변수가 URL에 포함되어 있으므로 사용자는 검색어와 필터를 포함한 현재 앱 상태를 즐겨찾기에 추가하여 이후 참조 및 공유 가능
- 서버 측 렌더링: URL 검색 매개변수를 서버에서 직접 사용하여 초기 상태를 렌더링하기 때문에 서버 렌더링 처리가 더 쉬워짐
- 분석 및 추적: URL에 검색어와 필터를 직접 포함시키면 추가적인 클라이언트 로직없이 사용자 행동을 쉽게 추적 가능

#### 검색 기능 구현을 위한 Nextjs Client Hook (useSearchParams, usePathname, useRouter)

- useSearchParams: 현재 URL의 매개변수에 접근 가능
  ex) /dashboard/invoices?page=1&query=pending => {page: '1', query: 'pending'}
- usePathname: 현재 URL의 경로 추출
- useRouter: 클라이언트 구성 요소 내의 경로 간 이동을 프로그래밍 방식으로 가능
  - router.psuh(href: string, { scroll: boolean, transitionTypes: string[] }): 클라이언트 측에서 지정된 경로로 이동
  - router.replace(href: string, { scroll: boolean, transitionTypes: string[] }): 제공된 경로로 클라이언트 측 탐색 수행
  - router.refresh(): 현재 경로 새로 고침 > 리렌더링
  - router.prefetch(href: string, options?: { onInvalidate?: () => void }): 제공된 경로를 미리 가져와 클라이언트 측 전환 속도를 높임
  - router.back(): 이전 경로로 이동
  - router.forward(): 다음 페이지로 이동

#### 디바운싱

함수 실행 빈도를 제한하는 프로그래밍 기법으로, 실시간 입력 검색 시 성능을 최적화함
사용자가 입력을 멈췄을 때만 DB를 조회

- 동작 방식

1. 트리거 이벤트: 디바운싱이 필요한 이벤트가 발생하면 타이머 시작
2. 대기: 타이머가 완료되기 전에 새로운 이벤트 발생 시 타이머가 재설정됨
3. 실행: 타이머가 카운트다운 종료 시점에 도달하면 디바운스된 함수 실행

`use-debounce` 라이브러리 활용

### 서버 액션

React 서버 액션을 사용하면 비동기 코드를 서버에서 직접 실행 가능
=> 데이터를 변경하기 위한 API 엔트포인트를 만들 필요가 없고, 대신 서버에서 실행되는 비동기 함수를 작성하고 클라이언트 또는 서버 컴포넌트에서 호출
=> 암호화된 클로저, 엄격한 입력 검사, 오류 메시지 해싱, 호스트 제한 등의 기능으로 보안 강화
서버 컴포넌트 내에서 서버 액션을 호출하는 것의 장점은 점진적 개선. 즉, 클라이언트에서 Javscript가 아직 로드되지 않았더라도 폼은 작동함
구현 과정

1. 사용자 입력 폼 작성
2. 서버 액션을 생성하고 폼에서 해당 액션 호출
3. 서버 액션 내부에서 formData 객체로부터 데이터 추출
4. DB에 삽입할 데이터 검증 및 준비
5. 데이터 입력하고 오류 처리
6. 캐시를 다시 검장하고 다음 페이지로 리다이렉션
   \*\* API 엔드포인트를 수동으로 생성할 필요가 없는 이유?
   원래 HTML에서는 작업 속성에 URL을 전달하고, 이 URL은 폼데이터를 제줄해야 하는 대상(api 엔드포인트)임.
   React에서는 액션 속성이 특별한 props로 간주되어, 이를 기반으로 액션을 호출할 수 있도록 기능을 구축.
   서버 액션은 백그라운드에서 POST API 엔트포인트를 생성하기 떄문에 수동으로 생성할 필요가 없는 것임.
   참고) lib/actions.tsx (서버액션 파일), ui/invoices/create-form.tsx (서버액션을 사용하는 컴포넌트)

### Handling Errors

서버 액션에서 처리되지 않은 예외가 발생할 경우, 모든 에러는 error.tsx 파일에서 처리됨
`error.tsx`: 라우트 구간에서 예상치 못한 에러를 모두 처리하는 역할을 하며, 사용자에게 대체 UI를 표시함
참고) /dashboard/invoices/error.tsx

- error.tsx는 클라이언트 컴포넌트여야 함 > 'use client' 사용
- 해당 컴포넌트는 두 개의 속성을 받음
  - error: JavaScript native Error object
  - reset: 오류 경계 재설정하는 함수

#### notFound 함수를 사용하여 404 에러 처리

notFound() 함수가 있을 경우 error.tsx보다 우선시 됨 > 더 구체적인 오류를 처리하고 싶을 떄 해당 기능 활용
참고) /dashboard/invoices/[id]/edit/not-found.tsx

### 접근성
1. 접근성 플러그인 eslint-plugin-jsx-a11y 사용
- 접근성 문제를 조기에 발견하는데 도움을 줌
```
pnpm add -D eslint eslint-config-next

// 참고) eslint.config.mjs
```

2. useActionStateReact 훅을 사용하여 폼 오류를 처리하고 사용자에게 표시
useActionState(reducerAction, initialState, permalink?): React Hook으로, actions을 사용하여 상태 업데이트 가능
#### Parameters 
- reducerAction: 액션이 트리거될 때 호출될 함수 > 호출 시 인수로 이전 상태 값과 DispatchAction에 전달될 작업 payload를 받음
- initialState: 초기 상태로 설정할 값 > dispatchAction이 처음 호출된 후 해당 인수는 무시
- permalink(optional): 이 양식이 수정하는 고유 페이지 URL이 포함된 문자열

#### Returns 
- 현재 상태: 처음 사용자가 제공한 초기 상태로 설정 > dispatchAction이 호출된 후에는 reducerAction이 반환한 값
- action dispatcher: reducerAction 함수 트리거
- pending state: 작업 진행 상태

#### 클라이언트 측 유효성 검사
- input 태그에 required 속성 추가

#### 서버 측 유효성 검사
서버에서 폼 유효성 검사 시 얻을 수 있는 이점
- 데이터를 DB로 전송하기 전 타입 검증 가능
- 악의적인 사용자가 클라이언트 측 유효성 검사를 우회할 위험을 줄임