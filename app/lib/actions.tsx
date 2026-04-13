'use server' // 서버 컴포넌트
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import postgres from 'postgres'
import { redirect } from 'next/navigation'

//* DB 연결
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

//* 데이터 스키마 정의
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.', // 데이터 타입 오류 메시지
  }),
  // coerce: 데이터 타입 변환 > 숫자형으로, gt: greater than > 0보다 큰 값이어야 함
  amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than 0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.', // 데이터 타입 오류 메시지
  }),
  date: z.string(),
})

//* 데이터 스키마에서 id, date 필드를 제외한 객체 생성 > omit() 메서드를 사용하여 특정 필드 제외
const CreateInvoice = FormSchema.omit({ id: true, date: true })
// id, date는 클라이언트가 입력하지 않으므로 제외 > 서버 액션에서 생성

export type State = {
  errors?: {
    customerId?: string[]; // 필수 필드 오류 메시지
    amount?: string[]; // 필수 필드 오류 메시지
    status?: string[]; // 필수 필드 오류 메시지
  };
  message?: string | null; // 성공 메시지 또는 오류 메시지
};

//* 서버 액션 함수 생성 > 생성 액션
// <server> 태그 추가 시 'use server' 파일 내의 모든 export 함수가 서버 액션으로 표시되고,
// 해당 서버 함수는 클라이언트 및 서버 구성 요소에서 가져와 사용 가능
// 이 파일에 포함된 함수 중 사용되지 않는 함수는 최종 앱 번들에서 자동으로 제거됨
export async function createInvoice(prevState: State, formData: FormData): Promise<State> {
  // form data를 객체로 변환
  // const rawFormData = {
  //     customerId: formData.get('customerId'),
  //     amount: formData.get('amount'),
  //     status: formData.get('status'),
  // }
  // 데이터가 많을 경우 entries() 메서드 사용
  // for (const data of formData.entries()) {
  //     console.log('[SERVER ACTION] Key: ', data[0], 'Value: ', data[1]);
  // }

  // CreateInvoice.parse(...)는 전달된 객체를 검증/변환
  // 검증 성공 시 각 필드의 값을 추출
  // 검증 실패 시 parse는 즉시 예외를 던짐
  // const { customerId, amount, status } = CreateInvoice.parse({
  //   customerId: formData.get('customerId'),
  //   amount: formData.get('amount'),
  //   status: formData.get('status'),
  // })

  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  })

  // 검증 실패 시 오류 메시지 반환
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
       message: 'Missing Fields. Failed to Create Invoice.',
    }
  }

  // 검증 성공 시 데이터 추출
  const { customerId, amount, status } = validatedFields.data;
  // 데이터 가공
  const amountInCents = amount * 100 // 달러를 센트로 변환
  const date = new Date().toISOString().split('T')[0] // 송장 생성 날짜 (YYYY-MM-DD)

  //* 폼 유효성 검사를 try/catch 블록 외부에서 처리 > 오류 처리 용이
  try {
    // DB에 데이터 삽입
    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `
  } catch (error) {
    console.error('Database Error:', error)
    // throw new Error('Failed to create invoice.')
    return { message: 'Database Error: Failed to create invoice.' }
  }

  // 재검증 및 redirect
  // Nextjs는 클라이언트 측 라우터 캐시를 사용하여 사용자의 브라우저에 일정 시간 동안 경로 세그먼트를 저장함
  // 해당 캐시는 프리페칭과 함께 사용자가 경로 이동을 빠르게 할 수 있도록 하면서 서버에 대한 요청 횟수를 줄여줌
  revalidatePath('/dashboard/invoices')
  // DB가 업데이트되면 위 경로의 유효성을 다시 검사하고, 서버에서 최신 데이터를 가져옴
  // 이 시점에서 사용자를 원래 페이지로 다시 리다이렉트 해야함
  redirect('/dashboard/invoices')
}

//* 데이터 스키마에서 id, date 필드를 제외한 객체 생성
const UpdateInvoice = FormSchema.omit({ id: true, date: true })

//* 서버 액션 함수 생성 > 업데이트 액션
export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  })
  const amountInCents = amount * 100

  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
    `
  } catch (error) {
    console.error('Database Error:', error)
    return { message: 'Database Error: Failed to update invoice.' }
  }

  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
  //* redirect는 try, catch 블록 외부에서 호출해야 함
  //* redirect가 오류를 발생시키는 방식으로 작동하기 때문
}

//* 서버 액션 함수 생성 > 삭제 액션
export async function deleteInvoice(id: string) {
  throw new Error('Failed to delete invoice.')
  await sql`
        DELETE FROM invoices
        WHERE id = ${id}
    `
  revalidatePath('/dashboard/invoices')

  // 삭제 후 페이지 리다이렉트 X
  // 만약, 리다이렉트할 경우 삭제 후 페이지에서 삭제 버튼을 클릭할 때 삭제 액션이 다시 실행되어 오류가 발생함
  // redirect('/dashboard/invoices');
}
