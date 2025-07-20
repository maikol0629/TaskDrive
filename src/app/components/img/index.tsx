import React from 'react'
import Image from 'next/image';

const Photo = ({url}: {url:string}) => {
    return (
        <Image
        src={url}
        alt="Main photo"
        width={214}
        height={237}

      />
    );
}
export { Photo };