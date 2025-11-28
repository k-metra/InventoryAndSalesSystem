const currencySign = "₱";

export default function formatCurrency(num: string | number): string {
    if (typeof num === 'number') num = num.toString();
    

    let parts = num.split(".");
    let integerPart = parts[0];
    let decimalPart = parts.length == 2 ? parts[1] : null

    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return decimalPart ? currencySign + integerPart + "." + decimalPart 
    : currencySign + integerPart + ".00"
}