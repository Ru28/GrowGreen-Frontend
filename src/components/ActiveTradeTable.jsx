import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { calculateProfitLossPercentage, calculateProfitLossRupees, formatCurrency, formatDate, formatToTwoDecimals } from "../lib/calculations";
import { Input } from "./ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";
import { Button } from "./ui/Button";
import { Trash2 } from "lucide-react";
import CloseTradeModal from "./CloseTradeModal";


const ActiveTradeTable = ({trades,onUpdateTrade,onDeleteTrade})=>{
    const [editingIndex,setEditingIndex] = useState(null);
    const [tradeId, setTradeId] = useState(null);
    const [editData, setEditData] = useState(null);
    const [showCloseModal, setShowCLoseModal] = useState(false);
    const [tradeToClose, setTradeToClose] = useState(null);
    const [closeTradeIndex, setCloseTradeIndex] = useState(null);

    
    const handleStatusChange =(value)=>{
        if(!editData) return;

        if(value === "CLOSED"){
            // show modal to get exit price and exit date
            setTradeToClose(editData);
            setCloseTradeIndex(editingIndex);
            setShowCLoseModal(true);
        }
        else{
            // change to HELD
            setEditData({
                ...editData,
                status:value,
            });
        }
        
    }

    const startEdit = (index,id)=>{
        setEditingIndex(index);
        setTradeId(id);
        setEditData({...trades[index]});
    };

    const cancelEdit = ()=>{
        setEditingIndex(null);
        setEditData(null);
    }

    const saveEdit=(index)=>{
        if(!editData) return;

        if(!editData.stock ||
            editData.entryPrice === undefined ||
            editData.entryPrice === null ||
            !editData.investment ||
            !editData.closePrice ||
            !editData.quantity
        ){
            alert("Please fill in all required field");
            return;
        }

        const quantity = editData.quantity;
        if(!Number.isInteger(quantity)){
            alert("Quantity must be a whole number");
            return;
        }

        const updateTrade = {
            ...editData,
            entryPrice: formatToTwoDecimals(editData.entryPrice),
            investment: formatToTwoDecimals(editData.investment),
            closePrice: formatToTwoDecimals(editData.closePrice),
            quantity: Math.floor(quantity),
        }
        onUpdateTrade(index,updateTrade,tradeId);
        setEditingIndex(null);
        setEditData(null);
        setTradeId(null);
    }

    const handleEditChange = (field,value) =>{
        if(!editData) return;

        let updatedData = {...editData};

        if(field === "entryPrice" || field === "closePrice"){
            updatedData[field] = value === "" ? 0: parseFloat(value);
        }
        else if(field === "quantity"){
            updatedData[field] = value === "" ? 0: parseInt(value);
        }
        else{
            updatedData[field]=value;
        }

        if(field === "entryPrice" || field === "quantity"){
            const entryPrice = field==="entryPrice" ? parseFloat(value): updatedData.entryPrice;
            const quantity = field==="quantity" ? parseFloat(value): updatedData.quantity;

            if(!isNaN(entryPrice) && !isNaN(quantity) && entryPrice>0 && quantity>0){
                updatedData.investment =formatToTwoDecimals(entryPrice*quantity);
            }
        }

        setEditData(updatedData);
    }

    const handleCloseTradeConfirm = (exitPrice,exitDate) =>{
        if(!editData || closeTradeIndex === null){
            return;
        }

        const updateTrade = {
            ...editData,
            stock: editData.stock,
            entryDate: editData.entryDate,
            entryPrice: formatToTwoDecimals(editData.entryPrice),
            investment: formatToTwoDecimals(editData.investment),
            quantity: editData.quantity,
            exitPrice: formatToTwoDecimals(exitPrice),
            exitDate: new Date(exitDate),
            status: "CLOSED",
        }

        onUpdateTrade(closeTradeIndex,updateTrade,tradeId);
        setEditingIndex(null);
        setEditData(null);
        setShowCLoseModal(false);
        setTradeToClose(null);
        setCloseTradeIndex(null);
        setTradeId(null);
    }

    if(trades?.length === 0){
        return (
            <Card className="w-full bg-white shadow-lg border-0">
                <CardHeader className="bg-linear-to-r from-green-600 to-green-500 text-white rounded-t-lg">
                    <CardTitle className="text-2xl font-bold">Trade Portfolio</CardTitle>
                </CardHeader>
                <CardContent className="p-12 text-center">
                    <p className="text-gray-500 text-lg">No trades added yet</p>
                    <p className="text-gray-400 text-sm mt-2">
                        Add your first trade using the form above.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
        <Card className="w-full bg-white shadow-lg border-0">
            <CardHeader className="bg-linear-to-r from-green-600 to-green-500 text-white rounded-t-lg">
                <CardTitle className="text-xl sm:text-2xl font-bold">
                    Trade Portfolio
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-full text-sm sm:text-base">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-200">
                                <th className="px-2 sm:px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                                    Stock
                                </th>
                                <th className="px-2 sm:px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                                    Entry Date
                                </th>
                                <th className="px-2 sm:px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                                    Entry Price
                                </th>
                                <th className="px-2 sm:px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                                    Investment
                                </th>
                                <th className="px-2 sm:px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                                    Quantity
                                </th>
                                <th className="px-2 sm:px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                                    Close Price
                                </th>
                                <th className="px-2 sm:px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                                    P&L (₹)
                                </th>
                                <th className="px-2 sm:px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                                    P&L (%)
                                </th>
                                <th className="px-2 sm:px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                                    Status
                                </th>
                                <th className="px-2 sm:px-4 py-3 text-center font-semibold text-gray-700 whitespace-nowrap">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {trades?.map((trade,index) => {
                                const isEditing = editingIndex ===index;
                                const displayTrade = isEditing && editData ? editData : trade;
                                const plRupees = calculateProfitLossRupees(
                                    displayTrade.entryPrice,
                                    displayTrade.closePrice,
                                    displayTrade.quantity
                                )
                                const plPercentage = calculateProfitLossPercentage(
                                    displayTrade.entryPrice,
                                    displayTrade.closePrice
                                )

                                const isPositive = plRupees>=0;

                                return(
                                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                        {/* Stock  */}
                                        <td className="px-2 sm:px-4 py-3">
                                            {isEditing? (
                                                <Input
                                                    type="text"
                                                    value={editData?.stock || ""}
                                                    onChange={(e)=> handleEditChange("stock",e.target.value)}
                                                    className="w-full border-gray-300 text-sm"
                                                />
                                            ):(
                                                <span className="font-semibold text-gray-900 block">
                                                    {trade.stock}
                                                </span>
                                            )
                                        }
                                        </td>

                                        {/* Entry Date  */}
                                        <td className="px-2 sm:px-4 py-3">
                                            {isEditing? (
                                                <Input
                                                    type="date"
                                                    value={
                                                        editData?.entryDate 
                                                        ? new Date(editData.entryDate).toISOString().split("T")[0]:""
                                                    }
                                                    onChange={(e)=>handleEditChange("entryDate",e.target.value)}
                                                    className="w-full border-gray-300 text-sm"
                                                />
                                            ):(
                                                <span className="text-gray-600 block">
                                                    {formatDate(trade.entryDate)}
                                                </span>
                                            )}
                                        </td>

                                        {/* Entry Price  */}
                                        <td className="px-2 sm:px-4 py-3 text-right">
                                            {isEditing? (
                                                <Input
                                                  type="number"
                                                  step="0.01"
                                                  value={editData?.entryPrice ?? ""}
                                                  onChange={(e)=>
                                                    handleEditChange("entryPrice",e.target.value)
                                                  }
                                                  className="w-full border-gray-300 text-right text-sm"
                                                />
                                            ):(
                                                <span className="text-gray-700 font-medium block">
                                                    ₹{displayTrade.entryPrice}
                                                </span>
                                            )}
                                        </td>

                                        {/* Investment  */}
                                        <td className="px-2 sm:px-4 py-3 text-right">
                                            {isEditing ? (
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={editData?.investment ?? ""}
                                                        className="w-full border-gray-300 bg-gray-50 text-gray-600 text-right text-sm cursor-not-allowed"
                                                        />

                                                ):(
                                                    <span className="text-gray-700 font-medium block">
                                                        ₹{displayTrade.investment}
                                                    </span>
                                                )
                                            }
                                        </td>


                                        {/* Quantity  */}
                                        <td className="px-2 sm:px-4 py-3 text-right">
                                            {isEditing ? (
                                                <Input
                                                    type="number"
                                                    step="1"
                                                    value={editData?.quantity ?? ""}
                                                    onChange={(e)=>
                                                        handleEditChange("quantity",e.target.value)
                                                    }
                                                    className="w-full border-gray-300 text-right text-sm"
                                                    />
                                                ):(
                                                    <span className="text-gray-700 font-medium block">
                                                        {displayTrade.quantity}
                                                    </span>
                                                )
                                            }
                                        </td>

                                        {/* Close Price  */}
                                        <td className="px-2 sm:px-4 py-3 text-right">
                                            {isEditing ? (
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={editData?.closePrice ?? ""}
                                                    onChange={(e)=>
                                                        handleEditChange("closePrice",e.target.value)
                                                    }
                                                    className="w-full border-gray-300 text-right text-sm"
                                                />
                                            ):(
                                                <span className="text-gray-700 font-medium block">
                                                    ₹{displayTrade.closePrice}
                                                </span>
                                            )}
                                        </td>

                                        {/* P&L (₹) - Not Editable */}
                                        <td className={`px-2 sm:px-4 py-3 text-right font-semibold text-sm ${isPositive ? "text-green-600":"text-red-600"}`}>
                                            {isPositive ? "+" : ""}
                                            {formatCurrency(plRupees)}
                                        </td>

                                        {/* P&L (%) - Not Editable */}
                                        <td className={`px-2 sm:px-4 py-3 text-right font-semibold text-sm ${isPositive ? "text-green-600":"text-red-600"}`}>
                                            {isPositive ? "+": ""}
                                            {formatCurrency(plPercentage)}
                                        </td>

                                        {/* Status  */}
                                        <td className="px-2 sm:px-4 py-3">
                                            {isEditing ? (
                                                <Select value={editData?.status || "HELD"}
                                                        onValueChange={handleStatusChange} >
                                                    <SelectTrigger className="w-full border-gray-300 text-sm" >
                                                        <SelectValue/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="HELD">HELD</SelectItem>
                                                        <SelectItem value="CLOSED">CLOSED</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ):(
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold inline-block ${
                                                        trade.status === "HELD"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-gray-100 text-gray-800"
                                                    }`}>
                                                        {trade.status}
                                                </span>
                                            )}
                                        </td>


                                        {/* Action  */}
                                        <td className="px-2 sm:px-4 py-3">
                                            <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
                                                {isEditing?(
                                                    <>
                                                    <Button
                                                        onClick={()=> saveEdit(index)}
                                                        className="bg-green-600 hover:bg-green-700 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm"
                                                    >
                                                        Save
                                                    </Button>
                                                    <Button
                                                        onClick={cancelEdit}
                                                        className="bg-gray-400 hover:bg-green-500 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    </>
                                                ):(
                                                    <>
                                                    <Button
                                                        onClick={()=> startEdit(index,trade._id)}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm"
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        onClick={()=> onDeleteTrade(trade._id)}
                                                        className="bg-red-600 hover:bg-red-700 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm"
                                                        >
                                                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4"/>
                                                    </Button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>

        {/* Close Trade Modal  */}
       {tradeToClose && (
        <CloseTradeModal
            isOpen={showCloseModal}
            trade={tradeToClose}
            onConfirm={handleCloseTradeConfirm}
            onCancel={()=>{
                setShowCLoseModal(false);
                setTradeToClose(null);
                setCloseTradeIndex(null);
            }}
        />
        )} 
        
        </>
    )
}

export default ActiveTradeTable;