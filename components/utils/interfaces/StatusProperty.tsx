import Payment from './Payment'

interface StatusProperty {
    name: string,
    type: string,
    status: number,
    paidStatus: string,
    tenant: {
        name: string,
        razon: string,
        phone: string,
        mail: string,
    },
    contract: {
        start: string
        end: string,
        type: string,
        day: number,
        bruta: number,
        neta: number,
        pdfName: string,
        pdfUrl: string,
        status: number
    },
    payments: Payment[]

}

export default StatusProperty