import { useEffect, useState } from "react";
import TradeForm from "../components/TradeForm";
import ActiveTradeTable from "../components/ActiveTradeTable";
import ClosedTradeTable from "../components/ClosedTradeTable";
import ReportMatrix from "../components/ReportMatrix";
import { BASE_URL } from "../../baseURL";
import { calculateProfitLossPercentage, calculateProfitLossRupees } from "../lib/calculations";



const Index = ()=>{
    const [activeTrades, setActiveTrades] = useState([]);
    const [closedTrades, setClosedTrade] = useState([]);
    const [reportData, setReportData] = useState({});

    useEffect(()=>{
        fetchTradesData();
    },[]);


    const fetchTradesData = async()=>{
        fetch(`${BASE_URL}/getTrades/getAllTradeData`,{
            method:"GET",
            headers:{
                "Content-Type": "application/json"
            }
        }).then((res)=>res.json())
        .then((tradesData)=>{
            setActiveTrades(tradesData.data.activeTrades);
            setClosedTrade(tradesData.data.closeTrades);
            setReportData(tradesData.data.reportData[0]);
        })
        .catch((err)=>console.error("error",err));
    }
    
    const handleAddTrades =async(trade) =>{
        // Here call API for setActiveTrades
        const plRupees = calculateProfitLossRupees(
            trade.entryPrice,
            trade.closePrice,
            trade.quantity
        );
        const plPercentage = calculateProfitLossPercentage(trade.entryPrice,trade.closePrice)
        const tradeData = {
            ...trade,
            entryPrice:parseFloat(trade.entryPrice).toFixed(2),
            investment:parseFloat(trade.investment).toFixed(2),
            closePrice:parseFloat(trade.closePrice).toFixed(2),
            profitLossRupees:parseFloat(plRupees).toFixed(2),
            profitLossPercentage: parseFloat(plPercentage).toFixed(2),
        }
        await fetch(`${BASE_URL}/activeTrade/setActiveTrade`,{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tradeData)
        }).then((res)=>res.json())
        .then(async()=>{
            await fetchTradesData();
        })
        .catch((err)=>console.error("Error:",err));
        
    };


    const handleUpdateTrade = (index, updatedTrade,id) =>{   
        if(activeTrades[index].status=== "HELD" && updatedTrade.status ==="CLOSED"){
            // Move trade from active to close
            fetch(`${BASE_URL}/closeTrade/setCloseTrade/${id}`,{
                method: "POST",
                body: JSON.stringify(updatedTrade),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(async()=>{
                await fetchTradesData();
            }).catch((error)=>{
                console.error("error message",error)
            })
        }
        else{
            // Normal Update
            fetch(`${BASE_URL}/activeTrade/updateActiveTrade/${id}`,{
                method: "PUT",
                body: JSON.stringify({updatedTrade}),
                headers:{
                    "Content-Type": "application/json"
                }
            }).then(async(data)=>{
                await fetchTradesData();
            }).catch((error)=>{
                console.error(error);
            })
            
        }
    }

    const handleDeleteActiveTrade = async(id) =>{
        if(!id) return;
        const deleteTrade=await fetch(`${BASE_URL}/activeTrade/deleteActiveTrade/${id}`,{
            method: "DELETE",
            headers: {
                "Content-Type":"application/json"
            }
        }).then(async()=>
            await fetchTradesData()
        ).catch((err)=>{
            console.error("delete Active Trade error",err.message);
        })
        
    }

    const handleUpdateReport = async(updatedReportData)=>{
        const updateReportData = await fetch(`${BASE_URL}/reportData/updateReportData`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedReportData)
        }).then(async(res)=> {
            res.json();
            await fetchTradesData();
        }).catch((err)=>{
            console.error("error occur on update",err.message);
        })
    }

   const generateAndDownloadTradeReport = async () => {
        try {
            // Show loading indicator
            const loadingEl = document.createElement('div');
            loadingEl.style.position = 'fixed';
            loadingEl.style.top = '0';
            loadingEl.style.left = '0';
            loadingEl.style.width = '100%';
            loadingEl.style.background = '#16a34a';
            loadingEl.style.color = 'white';
            loadingEl.style.padding = '10px';
            loadingEl.style.textAlign = 'center';
            loadingEl.style.zIndex = '9999';
            loadingEl.textContent = 'Generating PDF report... Please wait.';
            document.body.appendChild(loadingEl);

            const response = await fetch(`${BASE_URL}/reportData/download-report`, {
                method: 'GET',
            });
            
            if (!response.ok) {
                throw new Error(`Failed to download report: ${response.status} ${response.statusText}`);
            }

            // Check content type
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/pdf')) {
                const text = await response.text();
                console.error('Response is not PDF:', text.substring(0, 200));
                throw new Error('Server returned non-PDF response');
            }

            // Get filename from headers or generate
            const contentDisposition = response.headers.get('content-disposition');
            let filename = `GrowGreen_Report_${new Date().toISOString().split('T')[0]}.pdf`;
            
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="(.+)"/);
                if (match) filename = match[1];
            }

            // Create blob and download
            const blob = await response.blob();
            console.log('PDF blob size:', blob.size, 'bytes');
            
            if (blob.size < 1000) {
                throw new Error('PDF file is too small, likely empty or corrupted');
            }

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                document.body.removeChild(loadingEl);
            }, 100);

        } catch (error) {
            console.error('Error downloading report:', error);
            
            // Remove loading indicator if exists
            const loadingEl = document.querySelector('div[style*="Generating PDF"]');
            if (loadingEl) document.body.removeChild(loadingEl);
            
            alert(`Failed to download report: ${error.message}`);
        }
    };

    const handleUpdateClosedTrade = (index, updatedTrade,id) =>{
        fetch(`${BASE_URL}/closeTrade/updateCloseTrade/${id}`,{
            method: "PUT",
            body:JSON.stringify({updatedTrade}),
            headers:{
                "Content-Type":"application/json"
            }
        }).then(async()=>{
            await fetchTradesData()
        }).catch((err)=>{
            console.error(err.message);
        })
    }

    const handleDeleteClosedTrade = (id) =>{
        fetch(`${BASE_URL}/closeTrade/deleteCloseTrade/${id}`,{
            method: "DELETE",
            headers:{
                "Content-Type":"application/json"
            }
        }).then(async()=>{
            await fetchTradesData();
        }).catch((err)=>{
            console.error(err.message);
        })
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-50">
            {/* Header */}
            <div className="bg-linear-to-r from-green-600 to-green-500 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                            <span className="text-2xl font-bold text-green-600">🌱</span>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white">GrowGreen</h1>
                            <p className="text-green-100 ">Trade Portfolio Manager</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content  */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="space-y-8">
                    {/* Metrics and Report Section */}
                    <ReportMatrix 
                        tradeReport={reportData}
                        onUpdateReportData={handleUpdateReport}
                        generateTradeReport={generateAndDownloadTradeReport}
                        />
                    
                    {/* Form Section  */}
                    <TradeForm onAddTrade={handleAddTrades}/>

                    {/* Active Trades Table Section */}
                    <ActiveTradeTable 
                        trades={activeTrades}
                        onUpdateTrade={handleUpdateTrade}
                        onDeleteTrade={handleDeleteActiveTrade}
                    />

                    <ClosedTradeTable
                        trades={closedTrades}
                        onUpdateTrade={handleUpdateClosedTrade}
                        onDeleteTrade={handleDeleteClosedTrade}
                    />
                </div>
            </div>

        </div>
    )
}


export default Index;