'use client'
import dynamic from "next/dynamic";
import React, {useEffect, useState} from "react";
import Image from "next/image";
import {ApexOptions} from "apexcharts";
import axios from "axios";
import axiosTauriApiAdapter from "axios-tauri-api-adapter";
import {useRouter} from "next/navigation";

interface DashboardData {
  totalDeliveryToday: number;
  totalQtyDeliveryToday: number;
  totalBoxDeliveryToday: number;
  totalBoxDeliveredToday: number;
  percentageDelivery: number;
  percentageAccuracyScan: number;
  totalNG: number;
  percentageNG: number;
  totalQtyShopping: number;
  QtyDelivered: number;
  totalIncomingMaterial: number;
  averageDelivery: {
    jam: string[],
    value: number[]
  },
  deliveryByCycle: {
    deliveryCycle: string,
    totalPlanned: string,
    actualQtyDelivered: string,
    percentage: string
  }[]
}
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
export default function Home() {
  const [time, setTime] = useState<Date | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<DashboardData>()
  const router = useRouter()

  const fetchData = async () => {
    try {
      const client = axios.create({ adapter: axiosTauriApiAdapter });
      const response = await client.get('http://localhost:5000/v1/dashboard?apiKey=loremipsumdolositamet', {
        method: 'GET',
      });
      // Ensure the response is ok (status in the range 200-299)
      if (!response.status) {
        console.log(response.data)
        return;
      }
      // Parse the JSON data
      const data = await response.data;
      // Use the parsed data
      setData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false)
    }
  };
  useEffect(() => {
    // Interval to update time and fetch data
    const interval = setInterval(() => {
      fetchData();
    }, 5000); // Set interval to 5 seconds
    // Fetch data immediately when the component mounts
    fetchData();
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    // Interval to update time and fetch data
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const option: ApexOptions = {
    chart: {
      id: 'apexchart-example',
      width: '100%',
      height: 350,
      foreColor: 'white'
    },
    dataLabels: {
      enabled: true,
    },
    colors: ['#b71e9a', '#545454'],
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      categories: data?.averageDelivery ? data.averageDelivery.jam : []
    },
  }
  const optionAccuracy: ApexOptions = {
    chart: {
      id: 'apexchart-example2',
      type: 'radialBar',
      offsetY: -10,
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          name: {
            fontSize: '16px',
            color: undefined,
            offsetY: 120
          },
          value: {
            offsetY: 50,
            fontSize: '30px',
            color: 'white',
            formatter: function (val: number) {
              return val + "%";
            }
          }
        }
      }
    },
    fill: {
      type: '',
      gradient: {
        shade: 'dark',
        shadeIntensity: 0.15,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 65, 91]
      },
    },
    colors: ['#59c21c', '#545454'],
    labels: [``],
  }
  const seriesAccuracy=[parseFloat(data?.percentageAccuracyScan.toFixed(1) as string) ?? 0]
  const optionDelivery :ApexOptions = {
        chart: {
          id: 'apexchart-example2',
          type: 'radialBar',
          offsetY: -10
        },
        plotOptions: {
          radialBar: {
            startAngle: -135,
            endAngle: 135,
            dataLabels: {
              name: {
                fontSize: '16px',
                color: undefined,
                offsetY: 120
              },
              value: {
                offsetY: 50,
                fontSize: '30px',
                color: 'white',
                formatter: function (val: number) {
                  return val + "%";
                }
              }
            }
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            shadeIntensity: 0.15,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 65, 91]
          },
        },
    colors: ['#6800ff', '#545454'],
    labels: [``],
      }
  const seriesDelivery=[parseFloat(data?.percentageDelivery.toFixed(1) as string)?? 0]
  const optionNG:ApexOptions = {
        chart: {
          id: 'apexchart-example2',
          type: 'radialBar',
          offsetY: -10
        },
        plotOptions: {
          radialBar: {
            startAngle: -135,
            endAngle: 135,
            dataLabels: {
              name: {
                fontSize: '16px',
                color: undefined,
                offsetY: 120
              },
              value: {
                offsetY: 50,
                fontSize: '30px',
                color: 'white',
                formatter: function (val: number) {
                  return val + "%";
                }
              }
            }
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            shadeIntensity: 0.15,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 65, 91]
          },
        },
        labels: [``],
      }
      
  const seriesNG=[parseFloat(data?.percentageNG.toFixed(1) as string) ?? 0]
  const series = [{
    name: 'series-1',
    data: data?.averageDelivery ? data.averageDelivery.value : []
  }]
  const option2: ApexOptions = {
    chart: {
      id: 'apexchart-example',
      width: '100%',
      height: 350,
      foreColor: 'white'
    },
    dataLabels: {
      enabled: true,
    },
    colors: ['#b71e9a', '#545454'],
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      categories: []
    },
  }
  const series2 = [{
    name: 'series-1',
    data:  []
  }]

  return (
     <>
       {
         loading ? <center className={`flex h-screen w-full justify-center items-center text-center`}>Loading...</center> : <main className="flex flex-col min-h-screen max-h-screen px-5">
           <div className="flex flex-row h-fit justify-between items-center w-full">
             <Image src={'/vuteq.png'} alt={'Logo Vuteq'} width={130} height={30} onClick={()=> router.back()}/>
             <h1 className="text-4xl font-light">
               Realtime Dashboard Monitoring Production A: Line Ansei
             </h1>
             <Image
             //     onClick={async ()=>
             // {(typeof window !== 'undefined') &&
             //     await appWindow.setFullscreen(true)
             // }}
             src={'/nova3.png'} alt={'Logo Vuteq'} width={130} height={30}/>
           </div>
           <div className="flex flex-1 gap-3 min-h-full max-h-full w-full pb-5 ">
             <div className="grid grid-cols-1 max-h-full  gap-3 min-w-fit p-3">
               <div className="w-full rounded bg-green-600 flex flex-col items-center justify-center px-10 py-5 gap-3">
                 <span className="text-yellow-300 text-xl">Current Time</span>
                 <span className="text-yellow-300 text-4xl font-bold">
                   {time?.toLocaleTimeString().replace('.', ':') ?? '-'}
                 </span>
               </div>
               <div className="grid grid-cols-1 gap-4 w-full h-fit">
                 <div
                     className="w-full text-xl rounded bg-card flex flex-col items-center justify-center px-10 py-6 gap-3">
                   <span className="text-yellow-300">Total Purchase Order</span>
                   <span>{data?.totalDeliveryToday ?? 0} PO</span>
                 </div>
                 <div
                     className="w-full text-xl rounded bg-card flex flex-col items-center justify-center px-10 py-6 gap-3">
                   <span className="text-yellow-300">Planning Delivery</span>
                   <span>{data?.totalQtyDeliveryToday ?? 0} Pcs</span>
                 </div>
                 <div
                     className="w-full text-xl rounded bg-card flex flex-col items-center justify-center px-10 py-6 gap-3">
                   <span className="text-yellow-300">Aktual Delivery</span>
                   <span>{data?.QtyDelivered ?? 0} Pcs</span>
                 </div>
                 <div
                     className="w-full text-xl rounded bg-card flex flex-col items-center justify-center px-10 py-6 gap-3">
                   <span className="text-yellow-300">Planning Box</span>
                   <span>{data?.totalBoxDeliveryToday ?? 0} Box/Pallet</span>
                 </div>
                 <div
                     className="w-full text-xl rounded bg-card flex flex-col items-center justify-center px-10 py-6 gap-3">
                   <span className="text-yellow-300">Aktual Box</span>
                   <span>{data?.totalBoxDeliveredToday ?? 0} Box/Pallet</span>
                 </div>
               </div>
             </div>
             <div className="grid grid-cols-4 gap-3 w-full max-h-full p-3">
               {/* Scan Accuracy */}
               <div className="w-full flex flex-col justify-between items-center rounded bg-card p-6">
                 <span className="text-yellow-300 text-xl">Scan Accuracy</span>
                 {(typeof window !== 'undefined') &&
                     <ApexChart
                         type="radialBar"
                         height={400}
                         options={optionAccuracy}
                         series={seriesAccuracy}
                         width="100%"
                     />
                 }
               </div>

               {/* Delivery Percentage */}
               <div className="w-full flex flex-col justify-between items-center rounded bg-card p-6">
                 <span className="text-yellow-300 text-xl">Delivery Percentage</span>
                 {(typeof window !== 'undefined') &&
                     <ApexChart
                         type="radialBar"
                         height={400}
                         options={optionDelivery}
                         series={seriesDelivery}
                         width="100%"
                     />
                 }
               </div>

               {/* Part Details */}
               <div
                   className="w-full col-span-1 flex flex-col justify-between items-center rounded bg-card p-5 space-y-3">
                 <div className="w-full text-xl rounded bg-card flex flex-col items-center justify-between p-4">
                   <span className="text-red-500">Not Good</span>
                   <span>{data?.totalNG ?? 0} Pcs</span>
                 </div>
                 <div className="w-full text-xl rounded bg-card flex flex-col items-center justify-between p-4">
                   <span className="text-yellow-300">Shopping</span>
                   <span>{data?.totalQtyShopping ?? 0} Pcs</span>
                 </div>
                 <div className="w-full text-xl rounded bg-card flex flex-col items-center justify-between p-4">
                   <span className="text-blue-300">Incoming</span>
                   <span>{data?.totalIncomingMaterial ?? 0} Pcs</span>
                 </div>
               </div>

               {/* Not Good Percentage */}
               <div className="w-full flex flex-col justify-between items-center rounded bg-card p-6">
                 <span className="text-yellow-300 text-xl">NG Percentage</span>
                 {(typeof window !== 'undefined') &&
                     <ApexChart
                         type="radialBar"
                         height={400}
                         options={optionNG}
                         series={seriesNG}
                         width="100%"
                     />
                 }
               </div>

               {/* Delivery Per Hours */}
               <div className="w-full col-span-2 flex flex-col justify-between items-center rounded bg-card p-6">
                 <span className="text-yellow-300 text-xl">Delivery Per Hours</span>
                 <div className="w-full h-auto">
                   {(typeof window !== 'undefined') &&
                       <ApexChart
                           type="line"
                           height={350}
                           options={option}
                           series={series}
                           width="100%"
                       />
                   }
                 </div>
               </div>

               {/* Average Shopping Time */}
               <div className="w-full col-span-2 flex flex-col justify-between items-center rounded bg-card p-6">
                 <span className="text-yellow-300 text-xl">Average Shopping Time</span>
                 <div className="w-full h-auto">
                   {(typeof window !== 'undefined') &&
                       <ApexChart
                           type="line"
                           height={350}
                           options={option2}
                           series={series2}
                           width="100%"
                       />
                   }
                 </div>
               </div>
             </div>

           </div>
         </main>
       }
     </>
  );
}
