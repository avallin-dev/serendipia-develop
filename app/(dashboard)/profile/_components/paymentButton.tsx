'use client'
import { useState } from 'react'
import PaymentModal from '../PaymentModal'
import {DataUser, Membership} from "@/app/types/payments"


export default function PaymentButton({ amount, dataUser, membershipData }: { amount: number, dataUser: DataUser, membershipData: Membership }) {
    const [open, setOpen] = useState(false)


    return (
        <main className="flex justify-center">
            <button
                onClick={() => setOpen(true)}
                className="rounded-sm  px-6 py-3 text-white bg-gradient-to-bl from-green-600 to-slate-600"
            >
                 Pagar ahora
            </button>


            {open && <PaymentModal onClose={() => setOpen(false)} amount={amount} dataUser={dataUser} membershipData={membershipData} />}
        </main>
    )
}