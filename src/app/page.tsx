"use client"
import React, {useEffect, useRef, useState} from "react";
import Image from "next/image";
import clips from "../const/clips.json";
import CardPart from "@/app/components/card_part";
import {Select} from "antd";
import {useHotkeys} from "react-hotkeys-hook";
import Webcam from "react-webcam";
import printHelloWorld from "@/utils/print";
import {printers} from "tauri-plugin-printer";

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingCam, setLoadingCam] = useState<boolean>(false);
  const camera = useRef<Webcam|null>(null);
  const [deviceId, setDeviceId] = useState('');
  const [base64, setBase64] = useState('');
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [isOk, setIsOk] = useState(true);
  const [res, setRes] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false); // State for image preview
  const [qty, setQty] = useState(0)
  const [part, setPart] = useState('-')

  useEffect(() => {
    setTimeout( () =>{
      navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {
        setDevices(mediaDevices.filter(({kind}) => kind === "videoinput"));
      });
      setLoading(false)
    }, 1000)
    init()
  }, []);

  const init = async () =>{
    const list = await printers()
    console.log(list)
  }

  const handlePrint = () => {
    // Ensure printHelloWorld runs only in the client environment
    if (typeof window !== 'undefined') {
      return processStart();
    }
  };

  const processStart = () => {
    setLoadingCam(true);
    const imageSrc = camera.current?.getScreenshot();

    // Mengambil file gambar
    const file = dataURLtoFile(imageSrc, 'image.jpg');

    // Membuat objek FormData
    const formData = new FormData();
    formData.append('photo', file);

    // Kirim FormData ke API
    sendImageToAPI(formData);
  }
  useHotkeys('enter', () => processStart())
  const dataURLtoFile = (dataUrl: any, filename: string) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
  }
  const sendImageToAPI = (formData: FormData) => {
    fetch('http://localhost:8080/clip', {
      method: 'POST',
      body: formData  // Mengirimkan FormData langsung sebagai body
    })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setRes(data['detected_objects']);
          setBase64(data['image_base64'])
          checkIsOk(data['detected_objects'])
          setShowPreview(true);
          setTimeout(() => setShowPreview(false), 2000);
        })
        .catch(error => {
          console.error('Error:', error);
        })
        .finally(() => {
          setLoadingCam(false);
        })
  }
  const checkIsOk = async (data: any[]) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const allMatch = clips.every((part: any) => {
        const count = data.find((r) => r.object_name === part.name)?.count ?? 0;
        return qty === count;
      });

      if (!allMatch) {
        const audio = new Audio('ng.mp3');
        audio.playbackRate = 1.1;
        await audio.play();
      } else {
        const matchedItems = clips.filter((part: any) => {
          const count = data.find((r) => r.object_name === part.name)?.count ?? 0;
          return part.qty === count;
        });

        if (qty === 9) {
          const audio = new Audio('9.aac');
          audio.playbackRate = 1.3;
          await audio.play();
        } else if (qty === 11) {
          const audio = new Audio('11.aac');
          audio.playbackRate = 1.3;
          await audio.play();
        } else if (qty === 15) {
          const audio = new Audio('15.aac');
          audio.playbackRate = 1.3;
          await audio.play();
        } else if (qty === 17) {
          const audio = new Audio('17.aac');
          audio.playbackRate = 1.3;
          await audio.play();
        } else if (qty === 18) {
          const audio = new Audio('18.aac');
          audio.playbackRate = 1.3;
          await audio.play();
        } else if (qty === 19) {
          const audio = new Audio('19.aac');
          audio.playbackRate = 1.3;
          await audio.play();
        }
        await printHelloWorld(qty,part )

        // audioRef2.current?.play();
      }
      setIsOk(allMatch);
    }
  };
  return (
     <>
       {
         loading ? <center className={`flex h-screen w-full text-white justify-center items-center text-center`}>Loading...</center> :
             <main className="flex flex-col min-h-screen max-h-screen px-4 py-5">
               <div className="flex flex-row gap-1 min-h-screen w-full">
                 <div
                     className={`flex flex-col gap-4 w-[500px] max-h-full overflow-y-scroll hidden-scroll min-h-full`}>
                   <div className={`flex w-full justify-between items-center gap-4 mt-2`}>
                     {/*<Image src={'/vuteq.png'} alt={'Logo Vuteq'} width={110} height={20}/>*/}
                     <Image
                           src={'/nova3.png'} alt={'Logo Vuteq'} width={120} height={25}/>
                     <span>Vuteq Visual Inspection System</span>
                   </div>
                   {clips.map((part: any, index ) => (
                       <CardPart
                           key={index}
                           ok={{
                             ...part,
                             qty
                           }}
                           detected={res.find((r: any) => r.object_name === part.name)?.count || 0}
                           result={
                             res ? (qty === (res.find((r: any) => r.object_name === part.name)?.count || 0)) : true
                           }
                       />
                   ))}
                 </div>
                 <div className={`flex flex-col w-full h-screen justify-between items-start px-4 py-2`}>
                 <div className={'w-full flex-row flex gap-1 h-fit justify-between'}>
                   <div className={'flex flex-col flex-grow'}>
                        <span
                            id={'printable-content'}
                            className={`text-white text-2xl font-semibold mb-5`}>Produksi A Line D40 - CLIP</span>
                     <div className={'w-full grid-cols-2 grid gap-1 text-black'}>
                       <Select onSelect={(value) => setDeviceId(value)} placeholder={'Select Camera Device'} className={'mb-5 w-full text-black'}>
                         {devices.map((device, index) => (
                             <Select.Option  key={index} value={device.deviceId}>{device.label}</Select.Option>
                         ))}
                       </Select>
                       <Select onSelect={(value) => setQty(parseInt(value))} placeholder={'Select QTY'} className={'mb-5 w-full text-black'}>
                         <Select.Option value={1}>1 Pcs</Select.Option>
                         <Select.Option value={6}>6 Pcs</Select.Option>
                         <Select.Option value={9}>9 Pcs</Select.Option>
                         <Select.Option value={11}>11 Pcs</Select.Option>
                         <Select.Option value={15}>15 Pcs</Select.Option>
                         <Select.Option value={17}>17 Pcs</Select.Option>
                         <Select.Option value={18}>18 Pcs</Select.Option>
                         <Select.Option value={19}>19 Pcs</Select.Option>
                       </Select>
                       <Select onSelect={(value) => setPart(value)} placeholder={'Select Part Number'} className={'mb-5 w-full text-black col-span-2'}>
                         <Select.Option value={'67771-BZ010-00'}>67771-BZ010-00</Select.Option>
                         <Select.Option value={'67771-BZ060-00'}>67771-BZ060-00</Select.Option>
                         <Select.Option value={'67771-BZ070'}>67771-BZ070</Select.Option>
                         <Select.Option value={'9004A-46275-01'}>9004A-46275-01</Select.Option>
                       </Select>
                     </div>
                   </div>
                   <button
                       onClick={()=>printHelloWorld(qty, part)}
                       className={`text-2xl p-5 mb-0 w-[200px] rounded text-center text-white font-bold hover:cursor-pointer ${isOk ? 'bg-green-600' : 'bg-red-600'}`}
                   >
                     {isOk ? 'OK' : 'NG'}
                   </button>
                 </div>
                   <div className={`w-full flex justify-between h-full pb-5 flex-col`}>
                     {!loading && (
                         <Webcam
                             ref={camera}
                             className={'w-full mb-3 h-fit'}
                             audio={false}
                             height={1080}
                             screenshotFormat="image/jpeg"
                             width={1920}
                             videoConstraints={{
                               deviceId: deviceId,
                               height: 1080,
                               width: 1920
                             }}
                         />
                     )}
                     <div
                         onClick={handlePrint}
                          className={'text-2xl p-5 w-full rounded bg-blue-600 text-center text-white font-bold hover:cursor-pointer'}>
                       {
                         loadingCam ? 'Loading...' : 'CHECK'
                       }
                     </div>
                   </div>
                   {showPreview && (
                       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                         <img src={`data:image/jpeg;base64,${base64}`} alt="Preview"/>
                       </div>
                   )}
                 </div>
               </div>
             </main>
       }
     </>
  );
}
