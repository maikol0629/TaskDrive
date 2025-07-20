<<<<<<< HEAD
import React from 'react';
import Image from 'next/image';

const ListIcon = () => {
    return (
        <Image
        src="/ListIcon.png"
        alt="List Icon"
        width={24}
        height={26}
      />
    );
}

const FolderIcon = () => {
    return (
        <Image
        src="/FolderIcon.png"
        alt="Folder Icon"
        width={24}
        height={26}
      />
    );
}

const PersonIcon = () => {
    return (
        <Image
        src="/PersonIcon.png"
        alt='Person Icon'
        width={24}
        height={26}
        />
    );
}

export {ListIcon, FolderIcon, PersonIcon};
=======
export { default as TaskIcon } from './TaskIcon';
export { default as ProjectIcon } from './ProjectIcon';
export { default as TeamIcon } from './TeamIcon';
export { default as ArrowIcon } from './ArrowIcon';
>>>>>>> michael
