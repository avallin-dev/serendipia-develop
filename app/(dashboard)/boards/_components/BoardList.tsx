import { ejercicios, plan, rutina_ejercicio } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'

import RoutineCard from '@/app/(dashboard)/_components/routine-card-hover'
import determineCodeType from '@/app/utils/determineCodeType'
import { TabsContent } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type BoardListProps = {
  blocks: {
    Nombre: string | null
    plan: (plan & { rutina_ejercicio: (rutina_ejercicio & { ejercicios: ejercicios })[] })[]
  }[]
}

export default function BoardList({ blocks }: BoardListProps) {
  return (
    <div className="flex justify-center">
      {blocks.map((boardElement, index) => (
        <TabsContent
          key={'board' + index}
          value={'board' + index}
          className="w-full max-w-lg md:max-w-6xl"
        >
          <Link
            key={'boardElement-' + index}
            href={`/boards/${index + 1}`}
            className="block h-full "
          >
            <div className="relative h-full min-h-[860px] rounded-2xl bg-[#3D3D41] px-8 pb-10 pt-5 md:min-h-[520px]">
              <Image
                src="/images/logo-back.png"
                alt=""
                width={184}
                height={130}
                className="mx-auto md:hidden"
              />
              <Image
                src="/images/Logo_2.png"
                alt=""
                width={150}
                height={130}
                className="hidden md:absolute md:left-1/2 md:top-1/2 md:mx-0 md:block md:-translate-x-1/2 md:-translate-y-1/2 md:transform md:opacity-50"
              />
              <div className="h-4"></div>
              <h2 className="text-center text-2xl font-medium text-white sm:text-[40px]">
                {boardElement.Nombre}
              </h2>
              <div className="h-4"></div>
              <div className="relative md:grid md:grid-cols-2 md:grid-rows-layout-board md:gap-5">
                {boardElement &&
                  boardElement.plan?.map((board, i) => (
                    <div key={`element-${i}`}>
                      <h3
                        key={`block-${i}-${board.idPlan}`}
                        className="my-4 rounded-full bg-primary px-5 text-center text-xl font-medium text-[#3D3D41]"
                      >
                        {board.NombrePlan}
                      </h3>
                      <TooltipProvider>
                        {board.rutina_ejercicio &&
                          board.rutina_ejercicio?.map((f, j) => {
                            const codeNro = determineCodeType(f.nroEjercicio)
                            const codeBorderColor = {
                              odd: 'outline-primary',
                              even: 'outline-white',
                              rare: 'outline-magenta',
                            }
                            const codeBgColor = {
                              odd: 'bg-primary',
                              even: 'bg-white',
                              rare: 'bg-magenta',
                            }
                            return (
                              <Tooltip key={`exercise-${j}`}>
                                <TooltipTrigger className="block" asChild>
                                  <div className="text-xl text-white hover:underline">
                                    {f.nroEjercicio}- {f.ejercicios.nombreEj}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="bg-transparent">
                                  <RoutineCard
                                    comment={f.comentarioS1}
                                    exerciseName={f.ejercicios.nombreEj}
                                    exerciseNo={f.nroEjercicio}
                                    codeBorderColor={codeBorderColor[codeNro]}
                                    codeBgColor={codeBgColor[codeNro]}
                                    repetitions={f.repeticionS1}
                                    videoLink={f.ejercicios.linkEj}
                                  />
                                </TooltipContent>
                              </Tooltip>
                            )
                          })}
                      </TooltipProvider>
                    </div>
                  ))}
              </div>
            </div>
          </Link>
        </TabsContent>
      ))}
    </div>
  )
}
