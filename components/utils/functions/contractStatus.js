const contractStatus = (end) => {
    const today = new Date()
    const date2 = new Date(end);
    const diffTime = date2 - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if(diffDays < 0) {
        return 0
    } else if (diffDays < 30){
        return 1
    } else if (diffDays < 60){
        return 2
    } else if (diffDays < 180){
        return 3
    } else if (diffDays < 360){
        return 4
    } else {
        return 5
    } 
    return -1
}

export { contractStatus }