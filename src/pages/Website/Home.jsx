import React from 'react';
import { Link } from 'react-router-dom';
import { FaLongArrowAltRight } from 'react-icons/fa';
import RequestAccess from '../../components/Website/RequestAccess';
import Services from '../../components/Website/Services';
import ServiceImage from '../../components/Website/ServiceImage';
import SEO from '../../components/SEO';
import { getSubmitManuscriptUrl } from '../../utils/navigationHelpers';

const Home = () => {
    return (
        <>
            <SEO
                title="Open Access Journals in India - ELK Asia Pacific Journals"
                description="ELK Asia Pacific Journals is Expanding Literary Knowledge Base through its reputed Open Access journal published in multiple research areas."
            />
            <section className="relative w-full border-t-2 border-white bg-gradient-to-r from-[#204066] to-[#204066] h-auto">
                <div className="container mx-auto px-4">
                    <div className="w-full py-10 md:py-20 text-center relative z-10">
                        <div className="text-3xl font-light text-white leading-tight mb-5">
                            Unpaid, Open Access Journals
                            <br />
                            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
                                <Link
                                    to="/authors-guidelines"
                                    className="inline-flex items-center justify-center px-8 py-2 text-lg uppercase text-white hover:text-white font-light rounded-full bg-[#f39b2b] hover:bg-[#d47d0e] transition-all duration-300"
                                >
                                    Author's guidelines
                                    <FaLongArrowAltRight className="ml-2" />
                                </Link>

                                <Link
                                    to={getSubmitManuscriptUrl()}
                                    className="inline-flex items-center justify-center px-8 py-2 text-lg uppercase text-white hover:text-white font-light rounded-full bg-gradient-to-b from-[#08c495] to-[#00644b] hover:from-[#0a9773] hover:to-[#00644b] transition-all duration-300"
                                >
                                    Submit Your Manuscript
                                    <FaLongArrowAltRight className="ml-2" />
                                </Link>
                            </div>
                            <a href="" style={{ display: 'none' }}>The Last of Us 2</a>
                        </div>
                    </div>
                </div>
            </section>
            <RequestAccess />
            <Services />

            <section className="content-home">
                <div className="container">
                    <h1><strong>ELK</strong> Asia Pacific Journals</h1>
                    <p>ELK Asia Pacific Journals, as international Open Access and Google Scholar indexed journals, is a unit of ELK Education Consultants Pvt. Ltd (EECPL), India's first education BPO. With its gamut of offerings for the educational institutions and professional scholars, the company aims to be amongst the most value added companies for research support. The team, in its attempt to bring scientific open access journals for the academia, shares the vision of making EECPL the preferred choice of every Institute/University for various services. With a blend of expertise, experience, and consistency of services, we are poised to deliver excellent services to our clients by getting their research work published in SCI indexed journals..</p>

                    <p>All journal articles are published under the terms and conditions of the Creative Commons Attribution 4.0 International License <a style={{ color: '#f6f6f6' }} rel="dofollow" href="https://www.pornatro.com/" title="porno">porno</a>
                    </p>
                </div>
            </section>

            <ServiceImage />
        </>
    );
};

export default Home;