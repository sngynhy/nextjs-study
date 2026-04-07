'use server';

//* 서버 액션 함수 생성
// <server> 태그 추가 시 'use server' 파일 내의 모든 export 함수가 서버 액션으로 표시되고,
// 해당 서버 함수는 클라이언트 및 서버 구성 요소에서 가져와 사용 가능
// 이 파일에 포함된 함수 중 사용되지 않는 함수는 최종 앱 번들에서 자동으로 제거됨
export async function createInvoice(formData: FormData) {
}