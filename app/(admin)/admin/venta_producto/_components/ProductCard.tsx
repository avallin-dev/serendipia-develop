// import Image from 'next/image'
import { Image } from '@imagekit/next';

import { Button } from '@/app/components/ui/button'

export function ProductCard({ producto, onVenta, onEdit, onDelete }) {
  console.log(producto)
  return (
    <div className="flex w-full max-w-sm flex-col rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex-1">
        <div className="flex h-52 justify-center bg-gray-200">
          {/*<Image*/}
          {/*  className="rounded-t-lg object-contain p-8"*/}
          {/*  src={producto.imagen || '/images/Logo_2.png'}*/}
          {/*  alt={producto.nombre}*/}
          {/*  width={200}*/}
          {/*  height={200}*/}
          {/*/>*/}

          <Image
            className="w-[-webkit-fill-available] brightness-70 hover:brightness-150 rounded-t"
            urlEndpoint="https://ik.imagekit.io/a9uh8fwlt/"
            src={producto.imagen}
            alt={producto.nombre}
            width={200}
            height={200}
          />

        </div>
        <div className="px-5 pb-5">
          <div className="h-5"></div>
          <h5 className="text-xl font-semibold tracking-tight text-gray-900">{producto.nombre}</h5>
          <div className="mb-2 text-sm text-gray-500">SKU: {producto.sku}</div>
          <div className="mb-5 mt-2.5 flex items-center">
            <span className="ms-3 rounded-sm bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
              Stock: {producto.cantidad}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-gray-900">${producto.precio}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 border-t p-4">
        <Button variant="default" onClick={onVenta} className="flex-grow rounded-sm">
          Vender
        </Button>
        <Button variant="outline" onClick={onEdit} className="flex-grow rounded-sm">
          Editar
        </Button>
        <Button variant="destructive" onClick={onDelete} className="flex-grow rounded-sm">
          Eliminar
        </Button>
      </div>
    </div>
  )
}
