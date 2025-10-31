import { PartnerTable } from './components/PartnerTable'

export default async function Page() {
  return (
    <div>
      <h1 className="text-4xl font-semibold">Rutinas</h1>
      <div className="h-10"></div>
      <PartnerTable />
    </div>
  )
}
