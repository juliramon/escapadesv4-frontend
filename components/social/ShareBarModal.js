import Image from 'next/image';
import React, { useState } from 'react';

const ShareBarModal = ({ picture, title, rating, slug, locality, colorClass }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    const handleShareModalVisibility = () => !setModalOpen(!modalOpen);
    const handleCopyToClipboard = (url) => {
        navigator.clipboard.writeText(url);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3500);
    }
    const socialShares = [
        {
            name: 'Email',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-mail" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />
                <path d="M3 7l9 6l9 -6" />
            </svg>,
            url: `mailto:?subject=Mira%20què%20he%20trobat%20a%20Escapadesenparella.cat&body=${slug}`
        },
        {
            name: 'Whatsapp',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brand-whatsapp" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
                <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
            </svg>,
            url: `https://wa.me/?text=Mira%20què%20he%20trobat%20a%20Escapadesenparella.cat%20${slug}`,
        },
        {
            name: 'Facebook',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brand-facebook" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" />
            </svg>,
            url: `http://www.facebook.com/sharer.php?u=${slug}`,
        },
        {
            name: 'X',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brand-x" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
            </svg>,
            url: `https://twitter.com/intent/tweet?url=${slug}`,
        },
        {
            name: 'Copiar enllaç',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-copy" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
                <path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
            </svg>,
            url: slug,
        },
    ]
    return (
        <>
            <button className={`${colorClass ? colorClass : 'text-white'} underline inline-flex items-center text-sm`} onClick={handleShareModalVisibility}>
                <span>Compartir</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-1.5 relative -top-px"
                    width={18}
                    height={18}
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path
                        stroke="none"
                        d="M0 0h24v24H0z"
                        fill="none"
                    ></path>
                    <path d="M6 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                    <path d="M18 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                    <path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                    <path d="M8.7 10.7l6.6 -3.4"></path>
                    <path d="M8.7 13.3l6.6 3.4"></path>
                </svg>
            </button>

            <div className={`modal ${modalOpen ? 'active' : ''}`}>
                <div className='modal__wrapper modal--sm'>
                    <div className='modal__container'>
                        <div className='modal__header no-border'>
                            <span>Compartir</span>
                            {/* Button close */}
                            <button
                                className="modal__close"
                                aria-label="Botó tancar modal"
                                onClick={handleShareModalVisibility}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="#00206B"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        <div className='modal__body pt-0'>
                            <div className='flex items-center mb-4'>
                                {picture ? <picture className='block mr-3 rounded overflow-hidden w-12 h-12 relative'>
                                    <Image src={picture} alt={title} layout='fill' objectFit='cover' />
                                </picture> : null}
                                <div className='flex flex-wrap items-center text-sm flex-1'>
                                    {title ? <div className='mr-2.5'>
                                        <span className='inline-block underline'>{title}</span>
                                    </div> : null}
                                    {rating ? <div className='mr-2.5 inline-flex items-center'>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mr-1.5 text-primary-500"
                                            width={14}
                                            height={14}
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentCOlor"
                                            fill="currentCOlor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path
                                                stroke="none"
                                                d="M0 0h24v24H0z"
                                                fill="none"
                                            ></path>
                                            <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path>
                                        </svg>
                                        <span className='inline-block'>{rating}</span>
                                    </div> : null}
                                    {locality ? <div className='mr-2.5 inline-flex items-center'>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mr-1.5 text-primary-500"
                                            width={14}
                                            height={14}
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path
                                                stroke="none"
                                                d="M0 0h24v24H0z"
                                                fill="none"
                                            ></path>
                                            <polyline points="8 16 10 10 16 8 14 14 8 16"></polyline>
                                            <circle
                                                cx={12}
                                                cy={12}
                                                r={9}
                                            ></circle>
                                        </svg>
                                        <span>{locality}</span>
                                    </div> : null}
                                </div>
                            </div>
                            <ul className='list-none m-0 p-0 grid gap-3 grid-cols-1 md:grid-cols-2'>
                                {socialShares.map((socialShare, idx) => {
                                    const isLastItem = socialShares[socialShares.length - 1] === socialShare ? true : false;
                                    return <li key={idx} className={`${socialShares[socialShares.length - 1] === socialShare ? 'md:col-span-2' : ''}`}>
                                        {isLastItem ? <button onClick={() => handleCopyToClipboard(socialShare.url)} className='w-full p-5 border border-primary-100 hover:bg-primary-50 transition-all duration-300 ease-in-out rounded-lg flex items-center relative overflow-hidden'>
                                            <div className='mr-2.5'>{socialShare.icon}</div>
                                            <span className='inline-block relative top-px'> {socialShare.name}</span>
                                            <span role='alert' className={`absolute right-5 px-2.5 py-1.5 bg-white rounded-md border border-primary-100 transition-all duration-300 ease-in-out text-xs inline-flex items-center ${!copiedLink ? '-bottom-full' : 'bottom-1/2 translate-y-1/2'}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 text-green-500" width={14} height={14} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                                    <path d="M9 12l2 2l4 -4" />
                                                </svg>
                                                Enllaç copiat
                                            </span>
                                        </button> : <a href={socialShare.url} title={socialShare.name} className='p-5 border border-primary-100 hover:bg-primary-50 transition-all duration-300 ease-in-out rounded-lg flex items-center' target='_blank' rel='nofollow noreferrer'>
                                            <div className='mr-2.5'>{socialShare.icon}</div>
                                            <span className='inline-block relative top-px'> {socialShare.name}</span>
                                        </a>}

                                    </li>
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShareBarModal;