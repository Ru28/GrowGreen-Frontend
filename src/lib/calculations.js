/**
 * Format a number to 2 decimal places
 */

export function formatToTwoDecimals(value){
    return parseFloat(value).toFixed(2);
}

export function calculateProfitLossRupees(entryPrice,closePrice,quantity){
    return parseFloat(((closePrice-entryPrice)*quantity)).toFixed(2);
}

export function calculateProfitLossPercentage(entryPrice,closePrice){
    if(entryPrice === 0)
        return 0;

    return parseFloat((((closePrice-entryPrice)/entryPrice)*100)).toFixed(2);
}

export function formatDate(date){
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-IN",{
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}

export function formatCurrency(value){
    return new Intl.NumberFormat("en-IN",{
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}