import Image from "next/image";

interface ButtonProps {
  tl: string
  id?: string
  className?: string
  isLoading?: boolean
  url?: string
  icon?: string
  target?: string
  leftIcon?: string
  disabled?: boolean
  onClick?: () => void
}

export default function Button({tl,id='',isLoading,url,disabled=false,target,icon,leftIcon,onClick,className='w-full bg-[#FFC023] text-[#222222]'}:ButtonProps) {
  const buttonStyle = `${className} text-[16px] cursor-pointer font-bold px-4 py-3 rounded capitalize disabled:opacity-50 hover:opacity-90 transition-opacity flex justify-center items-center`;

  if (url) {
    return (
      <a className={buttonStyle} id={id} target={target} href={url} onClick={onClick}>
        {leftIcon && <Image src={leftIcon} className="mr-2" alt="" width={12} height={12} />}
        <span>{tl}</span>
        {icon && <Image src={icon} className="ml-2" alt="" width={28} height={28} />}
      </a>
    )
  }
  return (
    <button 
      id={id}
      disabled={isLoading || disabled}
      onClick={onClick}
      className={buttonStyle}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 disabled:opacity-50 disabled:cursor-not-allowed border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <>
          {leftIcon && <Image src={leftIcon} className="mr-2" alt="icon" width={28} height={28} />}
          <span className="font-bold">{tl}</span>
          {icon && <Image src={icon} alt="icon" width={16} height={8} />}
        </>
      )}
    </button>
  )
}