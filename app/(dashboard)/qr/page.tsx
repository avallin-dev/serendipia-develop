import ModalQR from './components/ModalQR'
export default async function Page() {
  return (
    <div>
      <h2 className="text-center text-lg font-medium text-dolphin">
        1 Acercar el código QR al lector de la entrada para ingresar al centro! El mismo es personal
        e intransferible.
      </h2>
      <div className="h-24"></div>
      <div className="shadow-md"></div>
      <ModalQR />
    </div>
  )
}
