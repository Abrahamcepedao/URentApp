const getMethod = (str) => {
    switch (str) {
        case "cash":
            return "Efectivo"
            break;
        case "trans":
            return "Transferencia"
            break;
        case "dep":
            return "Depósito bancario"
            break;
        case "card":
            return "Tarjeta (crédtio/débito)"
            break;
        case "plat":
            return "Plataforma digital"
            break;
        case "other":
            return "Otro"
            break;
        default:
            return ""
            break;
    }
}

export default getMethod