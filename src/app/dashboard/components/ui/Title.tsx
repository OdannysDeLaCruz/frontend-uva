
const Title: React.FC<{title: string}> = ({title}) => { 
  return (
    <div className="flex items-center mb-6">
      <h2 className="text-3xl text-blue-100 font-semibold text-nowrap mr-6">{title}</h2>
      <div className='w-full h-[1px] bg-blue-200'></div>
    </div>
  )
}

export default Title