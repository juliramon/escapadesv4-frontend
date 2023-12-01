import React, { useState } from 'react';
import { copyTextToClipboard } from '../../utils/helpers';

const ListingDiscount = ({ discountCode, discountInfo }) => {
    const [copied, setCopied] = useState(false);

    const handleCopyContent = (e) => {
        if (copied) return;

        copyTextToClipboard(e);
        setCopied(true);
    }

    if (copied) {
        setTimeout(() => setCopied(false), 5000);
    };

    return (
        <div class="mt-6 p-5 rounded shadow-lg shadow-primary-50">
            <div className="flex items-center text-primary-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-1" width={18} height={18} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M17 17m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                    <path d="M7 7m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                    <path d="M6 18l12 -12" />
                </svg>
                <span className="inline-block text-sm font-normal">
                    <span className='underline'>{discountInfo}</span> amb el codi:
                </span>
            </div>
            <button className="mt-2.5 flex items-center" onClick={(e) => handleCopyContent(e)}>
                <span className="font-normal text-xl">{discountCode}</span>
                <div className="w-8 h-8 flex items-center justify-center ml-2.5">
                    {copied ? <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
                        <path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
                        <path d="M11 14l2 2l4 -4" />
                    </svg> : <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
                        <path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
                    </svg>}
                </div>
            </button>
        </div>
    );
};

export default ListingDiscount;