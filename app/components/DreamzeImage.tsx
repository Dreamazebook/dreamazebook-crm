import Image from "next/image";

interface DreamzeImageProps {
  src:string
  alt:string
  cssClass?:string
  style?:React.CSSProperties
  unoptimized?:boolean
}
export default function DreamzeImage({src,alt,cssClass='',style,unoptimized=false}: DreamzeImageProps) {
  return (
    <Image 
      src={src} 
      alt={alt} 
      className={`object-cover ${cssClass}`} 
      style={style as React.CSSProperties} 
      fill 
      loading="lazy" 
      unoptimized={unoptimized}
      sizes="(max-width: 768px) 100vw, 100vw"
    />
  )
}