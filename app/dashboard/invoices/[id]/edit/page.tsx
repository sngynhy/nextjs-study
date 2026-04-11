import Form from '@/app/ui/invoices/edit-form'
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import { fetchCustomers, fetchInvoiceById } from '@/app/lib/data'
import { notFound } from 'next/navigation'

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const id = params.id

  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ])

  if (!invoice) {
    notFound()
    //* notFound() 함수는 NEXT_NOT_FOUND 예외를 던지는 방식으로 동작
    //* 해당 라우트 구간의 not-found.tsx 파일을 표시함
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  )
}
