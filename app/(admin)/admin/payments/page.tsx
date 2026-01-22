import {PaymentTable} from "@/app/(admin)/admin/payments/components/payment-table";

export default async function Page() {
    return (
        <div>
            <h1 className="text-4xl font-semibold">Pagos</h1>
            <div className="h-10"></div>
            <PaymentTable/>
        </div>
    )
}
