import { ReactNode } from 'react';

export default function Icon_button({
    icon , onClick , activated
} : {
    icon : ReactNode,
    onClick : () => void,
    activated : boolean
}){
    return(
        <div className={`p-2 hover:rounded-2xl hover:bg-gray-300 hover:text-black ${activated ? "text-red-400" : "text-white"}`} onClick={onClick} >
            {icon}
        </div>
    )
}