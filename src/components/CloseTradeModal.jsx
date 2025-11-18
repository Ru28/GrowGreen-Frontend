import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader } from "./ui/Dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { formatDate } from "../lib/calculations";
import { Label } from "./ui/Label";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";




const CloseTradeModal = ({isOpen,trade,onConfirm,onCancel})=>{
    const [exitPrice,setExitPrice] = useState("");
    const [exitDate,setExitDate] = useState(
        new Date().toISOString().split("T")[0]
    )

    const [error,setError] = useState("");

    const handleConfirm = () =>{
        if(!exitPrice){
            setError("exitPrice is required");
            return;
        }

        if(!exitDate){
            setError("exitDate is required");
            return;
        }

        const exitPriceNum = parseFloat(exitPrice);
        if(isNaN(exitPriceNum) || exitPriceNum<=0){
            setError("Exit Price must be valid positive number");
            return;
        }

        if(trade){
            const entryDate = new Date(trade.entryDate);
            const closeDateObj = new Date(exitDate);

            if(closeDateObj<=entryDate){
                setError("Exit Date must be after Entry Date");
                return;
            }
        }

        onConfirm(parseFloat(exitPrice),exitDate);
        setExitPrice("");
        setExitDate(new Date().toISOString().split("T")[0]);
        setError("");
    }


    const handleCancel=()=>{
        setExitPrice("");
        setExitDate(new Date().toISOString().split("T")[0]);
        setError("");
        onCancel();
    }
    return (
        <Dialog open={isOpen} onOpenChange={handleCancel}>
            <DialogContent className="sm:max-w-[425px] bg-white text-black rounded-xl shadow-xl">
                <DialogHeader>
                    <DialogTitle>Close Trade</DialogTitle>
                    <DialogDescription>
                        {trade && (
                            <span>
                                Enter exit details for <strong>{trade.stock}</strong>
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Stock and Entry Date Info  */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-600">Stock:</span>
                            <p className="font-semibold">{trade?.stock}</p>
                        </div>
                        <div>
                            <span className="text-gray-600">Entry Date:</span>
                            <p className="font-semibold">
                                {trade && formatDate(trade.entryDate)}
                            </p>
                        </div>
                        <div>
                            <span className="text-gray-600">Entry Price:</span>
                            <p className="font-semibold">₹{trade.entryPrice}</p>
                        </div>
                        <div>
                            <span className="text-gray-600">Quantity:</span>
                            <p className="font-semibold">{trade.quantity}</p>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        {/* Exit Price  */}
                        <div className="space-y-2 mb-4">
                            <Label htmlFor="exitPrice" className="text-sm font-semibold">
                                Exit Price (₹)
                            </Label>
                            <Input
                                id="exitPrice"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={exitPrice}
                                onChange={(e)=> setExitPrice(e.target.value)}
                                className="border-gray-300"
                            />
                        </div>

                        {/* Exit Date  */}
                        <div className="space-y-2">
                            <Label htmlFor="exitDate" className="text-sm font-semibold">
                                Exit Date
                            </Label>
                            <Input
                                id="exitDate"
                                type="date"
                                value={exitDate}
                                onChange={(e)=>setExitDate(e.target.value)}
                                className="border-gray-300"
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                            {error}
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        onClick={handleCancel}
                        className="bg-gray-400 hover:bg-gray-500 text-white"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        onClick={handleConfirm}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        Close Trade
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}

export default CloseTradeModal;