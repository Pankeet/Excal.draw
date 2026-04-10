import { ReactNode } from 'react';

export default function IconButton({
    icon , onClick , activated
} : Readonly<{
    icon : ReactNode,
    onClick : () => void,
    activated : boolean
}>){
    return(
        <button
            className={`p-2 hover:rounded-2xl hover:bg-gray-300 hover:text-black ${activated ? "text-red-400" : "text-white"}`} 
            onClick={onClick} >
            {icon}
        </button>
    )
}