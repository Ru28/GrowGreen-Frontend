import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Label } from "@radix-ui/react-label";
import { formatToTwoDecimals } from "../lib/calculations";

 const TradeForm = ({onAddTrade})=>{
    const [formData, setFormData] = useState({
        stock:"",
        entryDate: new Date().toISOString().split("T")[0],
        entryPrice: "",
        investment: "",
        closePrice: "",
        quantity: "",
    })
    
    const handleSubmit =(e)=>{
        e.preventDefault();

        if(
            !formData.stock ||
            !formData.entryPrice ||
            !formData.investment ||
            !formData.closePrice ||
            !formData.quantity
        ){
            alert("Please fill in all required fields");
            return;
        }

        const entryPrice = parseFloat(formData.entryPrice);
        const closePrice = parseFloat(formData.closePrice);
        const quantity = parseInt(formData.quantity);

        if (!Number.isInteger(quantity)) {
        alert("Quantity must be a whole number");
        return;
        }

        const trade = {
            stock: formData.stock,
            entryDate: new Date(formData.entryDate),
            entryPrice: formatToTwoDecimals(entryPrice),
            investment: formatToTwoDecimals(parseFloat(formData.investment)),
            closePrice: formatToTwoDecimals(closePrice),
            quantity,
            status: "HELD",
        }

        onAddTrade(trade);

        setFormData({
            stock:"",
            entryDate: new Date().toISOString().split("T")[0],
            entryPrice: "",
            investment: "",
            closePrice: "",
            quantity: "",
        });

    };

    const handleChange = (e)=>{
        const {name, value} = e.target;
        const updatedData={
            ...formData,
            [name]:value,
        };

        // Auto calculate investment when price or quantity changes
        if(name === "entryPrice" || name === "quantity"){
            const entryPrice = parseFloat(name === "entryPrice"? value: formData.entryPrice);
            const quantity = parseFloat(name === "quantity"? value: formData.quantity);
            if(!isNaN(entryPrice) && !isNaN(quantity) && entryPrice>0 && quantity>0){
                updatedData.investment=formatToTwoDecimals(entryPrice*quantity).toString();
            }else{
                updatedData.investment="";
            }
        }
        setFormData(updatedData);
    }
    return (
     <Card className="w-full bg-white shadow-lg border-0">
        <CardHeader className="bg-linear-to-r from-green-600 to-green-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Add New Trade</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Stock */}
                    <div className="space-y-2">
                        <Label htmlFor="stock" className="text-sm font-semibold text-gray-700">
                            Stock
                        </Label>
                        <Input
                            id="stock"
                            name="stock"
                            type="text"
                            placeholder="e.g., INFY"
                            value={formData.stock}
                            onChange={handleChange}
                            className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                        />
                    </div>

                    {/* Entry Date */}
                    <div className="space-y-2">
                        <Label htmlFor="entryDate" className="text-sm font-semibold text-gray-700">
                            Entry Date
                        </Label>
                        <Input
                            id="entryDate"
                            name="entryDate"
                            type="date"
                            value={formData.entryDate}
                            onChange={handleChange}
                            className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                            />
                    </div>

                    {/* Entry Price */}
                    <div className="space-y-2">
                        <Label htmlFor="entryPrice" className="text-sm font-semibold text-gray-700">
                            Entry Price (₹)
                        </Label>
                        <Input
                            id="entryPrice"
                            name="entryPrice"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={formData.entryPrice}
                            onChange={handleChange}
                            className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                            />
                    </div>

                    {/* Investment  */}
                    <div className="space-y-2">
                        <Label htmlFor="investment" className="text-sm font-semibold text-gray-700">
                            Investment (₹)
                        </Label>
                        <Input
                            id="investment"
                            name="investment"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={formData.investment}
                            readOnly
                            className="border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed"
                            />
                    </div>

                    {/* Close Price */}
                    <div className="space-y-2">
                        <Label htmlFor="closePrice" className="text-sm font-semibold text-gray-700">
                            Close Price (₹)
                        </Label>
                        <Input
                            id="closePrice"
                            name="closePrice"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={formData.closePrice}
                            onChange={handleChange}
                            className="border-gray-300 focus:border-green-500 focus:ring-green-500" 
                        />
                    </div>

                    {/* Quantity  */}
                    <div className="space-y-2">
                        <Label htmlFor="quantity" className="text-sm font-semibold text-gray-500">
                            Quantity
                        </Label>
                        <Input
                            id="quantity"
                            name="quantity"
                            type="number"
                            step="1"
                            placeholder="0"
                            value={formData.quantity}
                            onChange={handleChange}
                            className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit" 
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-2 rounded-lg transition-colors">
                            Add Trade
                    </Button>
                </div>

            </form>
        </CardContent>
     </Card>
    )
}

export default TradeForm;