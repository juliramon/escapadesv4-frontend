import React, { useState } from 'react';
import NewsletterService from '../services/newsletterService';
import Link from 'next/link';
import GlobalMetas from '../components/head/GlobalMetas';
import BreadcrumbRichSnippet from '../components/richsnippets/BreadcrumbRichSnippet';

const Newsletter = () => {
    const [newsletterFormData, setNewsletterFormData] = useState({
        name: '',
        email: '',
        serverMessage: '',
        submitted: false,
    });

    const newsletterService = new NewsletterService();

    const handleNewsletterFormChange = (e) => {
        setNewsletterFormData({ ...newsletterFormData, [e.target.name]: e.target.value })
    };

    const handleNewsletterFormSubmit = (e) => {
        e.preventDefault();
        const { name, email } = newsletterFormData;

        if (name !== "" && email !== "") {
            newsletterService.subscribeToNewsletter(name, email).then((res) => {
                console.log(res);
                if (res.status === 200) {
                    setNewsletterFormData({ ...newsletterFormData, serverMessage: res.message, submitted: true })
                }
            });
        }
    };
    return (
        <>
            {/* Browser metas  */}
            <GlobalMetas
                title="Subscriu-te a la newsletter"
                description="Subscriu-te a la nostra newsletter pre rebre les últimes novetats i ofertes."
                url="https://escapadesenparella.cat/newsletter"
                image="https://escapadesenparella.cat/img/containers/main/img/og-histories.png/69081998ba0dfcb1465f7f878cbc7912.png"
                canonical="https://escapadesenparella.cat/newsletter"
                index="false"
            />
            {/* Rich snippets */}
            <BreadcrumbRichSnippet
                page1Title="Inici"
                page1Url="https://escapadesenparella.cat"
                page2Title="Subscriu-te a la newsletter"
                page2Url={`https://escapadesenparella.cat/newsletter`}
            />
            <div className="newsletter h-screen flex items-center justify-center relative">
                <section className="py-12 md:py-24 relative z-10">
                    <div className="container">
                        <div className="flex flex-col items-center">
                            <div className='bg-primary-50 rounded-md px-8 pb-8 pt-6 md:px-12 md:pt-8 md:pb-12 relative'>
                                <picture className="block w-64 lg:w-80 h-auto mx-auto mix-blend-multiply">
                                    <img src="https://res.cloudinary.com/juligoodie/image/upload/v1626446634/getaways-guru/static-files/email-confirmation_lu3qbp.jpg" width="256" height="170" className="w-full h-auto object-contain" alt="Subscriu-te a la nostra newsletter" loading="lazy" />
                                </picture>
                                <div className="w-full md:max-w-md flex flex-col items-center gap-5 pt-6 md:pt-0 md:flex-1">
                                    <div className="w-full md:max-w-xs">
                                        <h2 className="mb-2 text-2xl leading-tight text-center">Subscriu-te a la nostra newsletter</h2>
                                        <p className="mb-0 font-light text-center">Per rebre les últimes novetats i ofertes</p>
                                    </div>
                                    {!newsletterFormData.submitted ? <form className="form flex flex-wrap items-center flex-1" onSubmit={handleNewsletterFormSubmit}>
                                        <fieldset className="form__group w-full">
                                            <label htmlFor="name" className="form__label">Nom</label>
                                            <input type="text" id="name" name="name" onChange={handleNewsletterFormChange} className="form__control bg-white" />
                                        </fieldset>
                                        <fieldset className="form__group w-full">
                                            <label htmlFor="email" className="form__label">Correu electrònic</label>
                                            <input type="email" id="email" name="email" onChange={handleNewsletterFormChange} className="form__control bg-white" />
                                        </fieldset>
                                        <fieldset className="form__group w-full">
                                            <button type="submit" className="button button__med button__primary justify-center md:mt-1">Subscriure'm</button>
                                        </fieldset>
                                        <span className="block w-full px-1.5 mt-1 form__text_info">Al fer clic a "Subscriure'm" confirmes haver llegit i estàs d'acord amb la <Link href="/politica-privadesa"><a title="Política de Privacitat" className="text-primary-900 underline">Política de Privacitat.</a></Link></span>
                                    </form> : <div className="flex items-center justify-center md:justify-start xl:justify-center flex-1 lg:flex-none xl:flex-1">
                                        <div className="max-w-[280px] mx-auto md:mx-0 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2.5 text-green-500" width={32} height={32} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                                <path d="M9 12l2 2l4 -4" />
                                            </svg>
                                            <span className="inline-block flex-1">{newsletterFormData.serverMessage}</span>
                                        </div>
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <picture className='block absolute w-full h-full inset-0 before:absolute before:inset-0 before:backdrop-blur-xl before:bg-primary-500 before:bg-opacity-25'>
                    <img src="home-about-s.jpg" alt="Subscriu-te a la newsletter" className='w-full h-full object-cover' loading='eager' />
                </picture>
            </div>
        </>
    );
};

export default Newsletter;