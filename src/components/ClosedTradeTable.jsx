import { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import {
  calculateProfitLossRupees,
  calculateProfitLossPercentage,
  formatCurrency,
  formatDate,
  formatToTwoDecimals,
} from "../lib/calculations";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Trash2 } from "lucide-react";

export default function ClosedTradeTable({
  trades,
  onUpdateTrade,
  onDeleteTrade,
}) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState(null);
  const [closeTradeId, setCloseTradeId] = useState(null);
  const startEdit = (index,id) => {
    setEditingIndex(index);
    setEditData({ ...trades[index] });
    setCloseTradeId(id);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditData(null);
  };

  const saveEdit = (index) => {
    if (!editData) return;

    if (
      !editData.stock ||
      editData.entryPrice === undefined ||
      editData.entryPrice === null ||
      !editData.investment ||
      !editData.exitPrice ||
      !editData.quantity
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (!Number.isInteger(editData.quantity)) {
      alert("Quantity must be a whole number");
      return;
    }

    const updatedTrade = {
      ...editData,
      entryPrice: formatToTwoDecimals(editData.entryPrice),
      investment: formatToTwoDecimals(editData.investment),
      exitPrice: formatToTwoDecimals(editData.exitPrice),
      quantity: Math.floor(editData.quantity),
    };

    onUpdateTrade(index, updatedTrade,closeTradeId);
    setEditingIndex(null);
    setEditData(null);
    setCloseTradeId(null);
  };

  const handleEditChange = (field, value) => {
    if(!editData) return;

    let updatedData = {...editData};

    if(field === "entryPrice" || field === "exitPrice"){
        updatedData[field] = value === 0 ? "": parseFloat(value);
    }
    else if(field === "quantity"){
        updatedData[field] = value === 0 ? "": parseInt(value);
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
  };

  if (trades.length === 0) {
    return (
      <Card className="w-full bg-white shadow-lg border-0">
        <CardHeader className="bg-linear-to-r from-gray-600 to-gray-500 text-white rounded-t-lg">
          <CardTitle className="text-xl sm:text-2xl font-bold">
            Closed Trades
          </CardTitle>
        </CardHeader>
        <CardContent className="p-12 text-center">
          <p className="text-gray-500 text-lg">No closed trades yet.</p>
          <p className="text-gray-400 text-sm mt-2">
            Close a trade to move it here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white shadow-lg border-0">
      <CardHeader className="bg-linear-to-r from-gray-600 to-gray-500 text-white rounded-t-lg">
        <CardTitle className="text-xl sm:text-2xl font-bold">
          Closed Trades
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
                  Exit Price
                </th>
                <th className="px-2 sm:px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                  Exit Date
                </th>
                <th className="px-2 sm:px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                  P&L (₹)
                </th>
                <th className="px-2 sm:px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                  P&L (%)
                </th>
                <th className="px-2 sm:px-4 py-3 text-center font-semibold text-gray-700 whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {trades.map((trade, index) => {
                const isEditing = editingIndex === index;
                const displayTrade = isEditing && editData ? editData : trade;

                const plRupees = calculateProfitLossRupees(
                  displayTrade.entryPrice,
                  displayTrade.exitPrice,
                  displayTrade.quantity
                );

                const plPercentage = calculateProfitLossPercentage(
                  displayTrade.entryPrice,
                  displayTrade.exitPrice
                );

                const isPositive = plRupees >= 0;

                return (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    {/* Stock */}
                    <td className="px-2 sm:px-4 py-3">
                      {isEditing ? (
                        <Input
                          type="text"
                          value={editData?.stock || ""}
                          onChange={(e) =>
                            handleEditChange("stock", e.target.value)
                          }
                          className="w-full border-gray-300 text-sm"
                        />
                      ) : (
                        <span className="font-semibold text-gray-900 block">
                          {trade.stock}
                        </span>
                      )}
                    </td>

                    {/* Entry Date */}
                    <td className="px-2 sm:px-4 py-3">
                      {isEditing ? (
                        <Input
                          type="date"
                          value={
                            editData?.entryDate
                              ? new Date(editData.entryDate)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            handleEditChange("entryDate", e.target.value)
                          }
                          className="w-full border-gray-300 text-sm"
                        />
                      ) : (
                        <span className="text-gray-600 block">
                          {formatDate(trade.entryDate)}
                        </span>
                      )}
                    </td>

                    {/* Entry Price */}
                    <td className="px-2 sm:px-4 py-3 text-right">
                      {isEditing ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={editData?.entryPrice ?? ""}
                          onChange={(e) =>
                            handleEditChange("entryPrice", e.target.value)
                          }
                          className="w-full border-gray-300 text-right text-sm"
                        />
                      ) : (
                        <span className="text-gray-700 font-medium block">
                          ₹{displayTrade.entryPrice}
                        </span>
                      )}
                    </td>

                    {/* Investment */}
                    <td className="px-2 sm:px-4 py-3 text-right">
                      {isEditing ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={editData?.investment ?? ""}
                          readOnly
                          className="w-full border-gray-300 bg-gray-50 text-gray-600 text-right text-sm cursor-not-allowed"
                        />
                      ) : (
                        <span className="text-gray-700 font-medium block">
                          ₹{displayTrade.investment}
                        </span>
                      )}
                    </td>

                    {/* Quantity */}
                    <td className="px-2 sm:px-4 py-3 text-right">
                      {isEditing ? (
                        <Input
                          type="number"
                          step="1"
                          value={editData?.quantity ?? ""}
                          onChange={(e) =>
                            handleEditChange("quantity", e.target.value)
                          }
                          className="w-full border-gray-300 text-right text-sm"
                        />
                      ) : (
                        <span className="text-gray-700 font-medium block">
                          {displayTrade.quantity}
                        </span>
                      )}
                    </td>

                    {/* Exit Price */}
                    <td className="px-2 sm:px-4 py-3 text-right">
                      {isEditing ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={editData?.exitPrice ?? ""}
                          onChange={(e) =>
                            handleEditChange("exitPrice", e.target.value)
                          }
                          className="w-full border-gray-300 text-right text-sm"
                        />
                      ) : (
                        <span className="text-gray-700 font-medium block">
                          ₹{displayTrade.exitPrice}
                        </span>
                      )}
                    </td>

                    {/* Exit Date */}
                    <td className="px-2 sm:px-4 py-3">
                      {isEditing ? (
                        <Input
                          type="date"
                          value={
                            editData?.exitDate
                              ? new Date(editData.exitDate)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            handleEditChange("exitDate", e.target.value)
                          }
                          className="w-full border-gray-300 text-sm"
                        />
                      ) : (
                        <span className="text-gray-600 block">
                          {formatDate(trade.exitDate)}
                        </span>
                      )}
                    </td>

                    {/* P&L (₹) */}
                    <td
                      className={`px-2 sm:px-4 py-3 text-right font-semibold text-sm ${
                        isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {formatCurrency(plRupees)}
                    </td>

                    {/* P&L (%) */}
                    <td
                      className={`px-2 sm:px-4 py-3 text-right font-semibold text-sm ${
                        isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {plPercentage}%
                    </td>

                    {/* Actions */}
                    <td className="px-2 sm:px-4 py-3">
                      <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
                        {isEditing ? (
                          <>
                            <Button
                              onClick={() => saveEdit(index)}
                              className="bg-green-600 hover:bg-green-700 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm"
                            >
                              Save
                            </Button>
                            <Button
                              onClick={cancelEdit}
                              className="bg-gray-400 hover:bg-gray-500 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm"
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              onClick={() => startEdit(index,trade._id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm"
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => onDeleteTrade(trade._id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
