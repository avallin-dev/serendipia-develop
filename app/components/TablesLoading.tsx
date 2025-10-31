import { TailSpin } from 'react-loader-spinner'

const TablesLoading = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-evenly p-8">
      <div className="flex flex-col gap-4">
        <TailSpin
          visible={true}
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
        />
        Cargando...
      </div>
      <div>{''}</div>
    </div>
  )
}

export default TablesLoading
