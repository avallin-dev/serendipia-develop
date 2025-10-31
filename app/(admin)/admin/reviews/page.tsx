import SearchPartnerInput from '@/components/search-partner-input'

import Table from './_components/Table'

export default async function Page() {
  return (
    <div>
      <h1 className="text-4xl font-semibold">Certificados de aptitud fisica</h1>
      <div className="h-10"></div>
      <SearchPartnerInput />
      <div className="h-10"></div>
      <Table />
    </div>
  )
}
