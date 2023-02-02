interface Payment {
    id: number,
    date: string,
    month: string,
    year: number,
    bruta: number,
    neta: number,
    method: number,
    fileName: string,
    fileUrl: string,
    comment: string,
    property: string
}

export default Payment