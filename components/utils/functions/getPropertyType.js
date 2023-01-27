const getPropertyType = (str) => {
    switch (str) {
        case "house":
            return "Casa"
            break;
        case "apartment":
            return "Departamento"
            break;
        case "storage":
            return "Bodega"
            break;
        case "ofice":
            return "Oficina"
            break;
        case "land":
            return "Terreno"
            break;
        case "local":
            return "Local"
            break;
        case "roof":
            return "Azotea"
            break;
        case "other":
            return "Otro"
            break;
        default:
            return ""
            break;
    }
}

export default getPropertyType