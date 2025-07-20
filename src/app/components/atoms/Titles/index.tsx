import React from 'react'

const TextTiltleName = ({text}: {text: string}) => {
    return (
        <h1 className='text-[36px] font-regular text-[#5226A6] m-0 leading-[1.3]'style={{WebkitTextStroke: '1px black'}}>
            {text}
        </h1>
    )
}

const TextSubTitleName = ({text}: {text: string}) => {
    return (
        <h1 className='text-[20px] font-regular text-[#2B222C] m-0 leading-[1.0]'>
            {text}
        </h1>
    )
}

const InPageTitle = ({text}: {text: string}) => {
    return (
        <h1 className='text-[30px] font-bold text-[#2B222C]'>
            {text}
        </h1>
    )
}

const InPageSubTitle = ({text}: {text: string}) => {
    return (
        <h1 className='text-[20px] font-semibold text-[#604878]'>
            {text}
        </h1>
    )
}


export {TextTiltleName, TextSubTitleName, InPageTitle, InPageSubTitle}