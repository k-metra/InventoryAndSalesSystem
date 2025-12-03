const formatCurrency = (num: string | number, currencySymbol: string = '₱'): string => {
    if (typeof num === 'number') num = num.toFixed(2).toString();
    

    let parts = num.split(".");
    let integerPart = parts[0];
    let decimalPart = parts.length == 2 ? parts[1] : null

    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return decimalPart ? currencySymbol + integerPart + "." + decimalPart 
    : currencySymbol + integerPart + ".00"
}

export { formatCurrency };