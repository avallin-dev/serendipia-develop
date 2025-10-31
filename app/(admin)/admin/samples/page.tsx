import SearchInput from '@/components/search-partner-input'

import Table from './components/Table'

export default async function Page() {
  return (
    <div>
      <h1 className="text-4xl font-semibold">Muestras</h1>
      <div className="h-20"></div>
      <h2 className="text-2xl font-medium text-dolphin">Medidas antropometricas</h2>
      <div className="h-10"></div>
      <SearchInput />
      <div className="h-10"></div>
      <Table />
    </div>
  )
}
