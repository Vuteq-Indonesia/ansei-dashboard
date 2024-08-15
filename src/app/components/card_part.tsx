'use client'
import {Tag} from "antd";

export default function CardPart({ok, result, detected}: { ok?: { name: string, qty:number }, result: boolean, detected?: number }) {
    return (<div className={`flex flex-col gap-2 w-full px-5 py-3 rounded-lg shadow-lg font-bold text-xl ${
        result ? 'bg-green-300' : 'bg-red-300'
    }`}>
        <span>Part {ok?.name ?? '-'}</span>
        <div>
            <span className={'text-sm font-semibold'}>Result : </span>
            {
                (result) ? <Tag color="green">PASS</Tag> : <Tag color="magenta">NOT PASS</Tag>
            }
            <span className={'text-sm'}>{detected}/{ok?.qty}</span>
        </div>
    </div>)
}