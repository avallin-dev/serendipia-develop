import { VentaProductoTable } from './_components/Table'

export default async function Page() {
  return (
    <div>
      <h1 className="text-4xl font-semibold">Venta Producto</h1>
      <div className="h-10" />
      <VentaProductoTable />
    </div>
  )
}
