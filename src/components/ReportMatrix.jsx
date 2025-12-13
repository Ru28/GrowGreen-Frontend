import { useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";


const ReportMatrix = ({tradeReport,onUpdateReportData,generateTradeReport})=>{
    const [editMetricsData,setEditMetricsData] = useState({})
    const [editMetrics, setEditMetrics] = useState(false);
    useEffect(()=>{
      setEditMetricsData(tradeReport);
    },[])

    const calculateNiftyChange = (niftyFrom,niftyClose)=> {
      const from = parseFloat(niftyFrom);
      const close = parseFloat(niftyClose);
      if(from && close){
        const change = ((close-from)/from)*100;
        return change.toFixed(2);
      }
      return "";
    }

    return (
        <>
          <Card className="w-full bg-white shadow-lg border-0">
            <CardHeader className="bg-linear-to-r from-green-600 to-green-500 text-white rounded-t-lg">
              <CardTitle className="text-2xl font-bold">
                Portfolio Metrics & Report
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="niftyFrom" className="text-sm font-semibold">
                    Nifty From
                  </Label>
                  {editMetrics? (
                    <Input
                      id="niftyFrom"
                      type="number"
                      placeholder="e.g., 24450"
                      value={editMetricsData.niftyFrom}
                      onChange={(e) =>{
                          const niftyReturn = calculateNiftyChange(e.target.value,editMetricsData.niftyClose);
                          setEditMetricsData({ ...editMetricsData, niftyFrom: e.target.value, niftyReturn:niftyReturn })
                        }
                      }
                      className="border-gray-300"
                    />
                  ):(
                    <div className="p-2.5 border border-transparent rounded-md bg-gray-50 text-gray-800 font-medium">
                      {tradeReport.niftyFrom ? tradeReport.niftyFrom : "Not set"}
                    </div>
                  )}
                  
                  
                </div>

                <div className="space-y-2">
                  <Label htmlFor="niftyClose" className="text-sm font-semibold">
                    Nifty Close
                  </Label>
                  {editMetrics ? (
                    <Input
                      id="niftyClose"
                      type="number"
                      placeholder="e.g., 25722"
                      value={editMetricsData.niftyClose}
                      onChange={(e) =>{
                          const niftyReturn = calculateNiftyChange(editMetricsData.niftyFrom,e.target.value);
                          setEditMetricsData({ ...editMetricsData, niftyClose: e.target.value, niftyReturn: niftyReturn })
                        }
                      }
                      className="border-gray-300"
                    />
                  ):(
                    <div className="p-2.5 border border-transparent rounded-md bg-gray-50 text-gray-800 font-medium">
                      {tradeReport.niftyClose ? tradeReport.niftyClose : "Not set"}
                    </div>
                  )}
                </div>

                 <div className="space-y-2">
                  <Label htmlFor="stopLoss" className="text-sm font-semibold">
                    Stop Loss (%)
                  </Label>
                  {editMetrics? (
                    <Input
                    id="stopLoss"
                    type="number"
                    placeholder="e.g., 5"
                    step="0.1"
                    value={editMetricsData.stopLoss}
                    onChange={(e) =>
                      setEditMetricsData({ ...editMetricsData, stopLoss: e.target.value })
                    }
                    className="border-gray-300"
                  />
                  ): (
                    <div className="p-2.5 border border-transparent rounded-md bg-gray-50 text-gray-800 font-medium">
                      {tradeReport.stopLoss? tradeReport.stopLoss: "N/A"}
                    </div>
                  )}
                  
                </div>

                

                <div className="space-y-2">
                  <Label
                    htmlFor="totalInvestment"
                    className="text-sm font-semibold"
                  >
                    Total Investment (₹)
                  </Label>
                  {editMetrics? (
                    <Input
                      id="totalInvestment"
                      type="number"
                      placeholder="e.g., 500000"
                      value={editMetricsData.investment}
                      onChange={(e) =>
                        setEditMetricsData({ ...editMetricsData, investment: e.target.value })
                      }
                      className="border-gray-300"
                    />
                  ):(
                    <div className="p-2.5 border border-transparent rounded-md bg-gray-50 text-gray-800 font-medium">
                      {tradeReport.investment ? tradeReport.investment : "Not set"}
                    </div>
                  )}
                  
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentValue" className="text-sm font-semibold">
                    Current Value (₹)
                  </Label>
                  <div className="p-2.5 border border-transparent rounded-md bg-gray-50 text-gray-800 font-medium">
                    {tradeReport.currentValue? tradeReport.currentValue: 0}
                  </div>
                  
                </div>

                {/* nifty change */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Nifty Return
                  </Label>
                  <div className="p-2.5 border border-transparent rounded-md bg-gray-50 text-gray-800 font-medium">
                    {editMetricsData.niftyReturn? editMetricsData.niftyReturn : tradeReport.niftyReturn}
                  </div>
                </div>

               
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    generateTradeReport(metricsData);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                >
                  Download PDF Report
                </Button>
                <Button
                  onClick={() => {
                      if(editMetrics){
                        if(onUpdateReportData){
                          onUpdateReportData(editMetricsData);
                        }
                      }
                      setEditMetrics(!editMetrics);
                    }
                  }
                  variant={editMetrics ? "default": "outline"}
                  className={`px-6 py-2 ${editMetrics ? "bg-green-600 hover:bg-green-700 text-white":""}`}
                >
                  {editMetrics? "Save Metrics":"Edit Metrics"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
    )
}

export default ReportMatrix;