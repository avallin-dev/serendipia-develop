import SearchInput from '@/components/search-partner-input'

import Table from './components/ReadPartner'

export default async function Page() {
  return (
    <div>
      <h1 className="text-4xl font-semibold">Socios</h1>
      <div className="h-10"></div>
      <SearchInput />
      <div className="h-10"></div>
      <Table />
    </div>
  )
}
