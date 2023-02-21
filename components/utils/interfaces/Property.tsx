import Payment from './Payment'
import Report from './Report'

interface Property {
  name: string,
  type: string,
  status: number,
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
  payments: Payment[],
  reports: Report[]
}

export default Property