type inputSize = 'sm' | 'md' | 'lg';

const sizeStyles: Record<inputSize, string> = {
    sm: "w-48 h-8 text-sm p-1",
    md: "w-64 h-11 text-base p-4",
    lg: "w-72 h-12 text-lg p-5"
};

const sizeStyles_title: Record<inputSize, string> = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl font-semibold"
};

interface inputProps {
    type : string 
    size : inputSize
    inputTitle? : string;
    placeholder? : string;
}

export const InputBox = ({type, size,inputTitle, placeholder} : inputProps) => {
    return (
        <div className="grid place-content-center gap-2 mb-5">
            <span className={`${sizeStyles_title[size]} font-serif`}>
                {inputTitle}
            </span>

            <input type={type} placeholder={placeholder} className={`${sizeStyles[size]} border border-gray-300 rounded-lg`}/>
        </div>
    );
}