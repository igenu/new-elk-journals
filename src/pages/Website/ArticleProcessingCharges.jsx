import React from 'react';
import { FaEdit } from 'react-icons/fa';
import NewsWidget from "../../components/Website/NewsWidget";
import SEO from '../../components/SEO';

const ArticleProcessingCharges = () => {
    return (
        <>
            <SEO 
                title="Article Processing Charge, Paper Publication Fee - ELK Asia Pacific Journals"
                description="Details of Article Processing Charge (APC) for publishing in our International Google Scholar indexed journals"
            />
            <div className="container mx-auto px-4 py-3">
            <div className="flex flex-wrap">
                <div className="w-full lg:w-3/4">
                    <div className="">
                        <h1 className="text-2xl text-[#12b48b] font-normal mb-2 relative inline-block">
                            Fee Details
                            {/* <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#12b48b] transform translate-y-1"></span> */}
                        </h1>

                        <div className=" mt-5 bg-[#204066] border-l-4 border-[#12b48b] text-white p-3 font-bold uppercase mb-6 text-sm">
                            INFORMATION FOR AUTHORS
                        </div>

                        <p className="mb-4 text-justify text-sm text-[#555]">
                            We launched ELK Asia Pacific Journals with the mandate to serve excellent reading material to interested readers. This target largely attained with the Open Access Scheme which allows readers to view, read, download, print, and share any article without any subscription charges. With our Open Access ELK Asia Pacific Journals, we strive to expand the readability count of the author’s scholarly work to the farthermost extent, which may not be sufficed with the traditional print based subscription model. While giving our efforts in this direction, we designed a systematic process that involves peer-reviewing, editing, publishing, indexing, archiving, and reference linking, all of which allows an immediate access to the full text version of the researched document. This stepwise process, on the other hand, also created space for article processing charges as time and cost are incurred at each stage.
                        </p>

                        <strong className="block text-sm font-bold text-[#555] mb-2">Deployment and Maintenance Cost</strong>
                        <p className="mb-4 text-justify text-sm text-[#555]">
                            As we indulged in indexing services which boost the travel speed of an article from the author(s) to their potential readers, we laid our hands on various technologies and journal indexes, including, Google Scholar, Index Copernicus International, Cabell’s, Research Bible and a few others. Some of these involve membership fee, deployment of certain technology, upkeep cost, etc. For instance, Google Scholar Indexing, which offers wide access to the online published journal articles, is a huge platform where doctoral candidates, professors and other members of academic community often search for reference papers, relevant to their area of research. So, an article indexed there has an enhanced chance of getting cited by other researchers.
                        </p>
                        <p className="mb-4 text-justify text-sm text-[#555]">
                            Paper Processing Charges majorly comprise of the deployment and maintenance of the Indexing technology that we have embedded. This replaces subscription charges and allows publishers to make the full-text of every published article freely available to all interested readers.
                        </p>
                        <p className="mb-4 text-justify text-sm text-[#555]">
                            Another major segment of the article processing and publication cycle is the Reference Linking. This part is better managed through our CrossRef membership, which allows us to generate (Digital Object Identifier) DOIs for each article published at ELK Asia Pacific Journals. Each reference material is also linked to their specific DOIs to create an interconnected network of quality research material. Authors can use this alpha-numeric string to share their research efforts among the academia.
                        </p>
                        <p className="mb-4 text-justify text-sm text-[#555]">
                            Underneath, we give our terms and details of Processing Charges:
                        </p>

                        <ul className="space-y-4 mb-8">
                            {[
                                "Publishing an article in any of the ELK Asia Pacific Journals calls for a fairly reasonable Article Processing Charge that would be paid by the submitting author upon acceptance of the article for publication.",
                                "Processing Charges are levied on authors as the papers undergo a thorough round of peer review, editing and formatting before being accepted for publication.",
                                "When the article is subsequently published, it is indexed on the Google Scholar to enable its search by other academicians and researchers.",
                                "The fee charged from the submitting author is used to pay for editors, reviewers and maintaining the technology for Google scholar indexing of articles."
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-[#555]">
                                    <FaEdit className="text-[#204066] flex-shrink-0 mt-1" />
                                    <span className="text-justify">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <p className="mb-4 text-justify text-sm text-[#555]">
                            It is to be noted that ELK journals do not charge for online publications. You can submit your manuscript to get it published ELK Asia Pacific Journals absolutely free of cost. However, hard copy or print publication is charged as 1500 per head. For print publication, authors can submit the processing charges for publication of their articles, upon acceptance, through any of the following payment options
                        </p>

                        <div className="mb-8 p-4 bg-gray-50 rounded border border-gray-200">
                            <strong className="block text-sm font-bold text-[#204066] mb-4 uppercase border-b border-gray-300 pb-2">Payment Options:</strong>

                            <div className="mb-4">
                                <strong className="block text-sm font-bold text-[#555] mb-1">Fee deposit through Bank:</strong>
                                <p className="text-justify text-sm text-[#555]">
                                    Authors may submit their fee through bank deposit. Write in to us at <a href="mailto:info@elkjournals.com" className="text-[#12b48b] hover:underline">[email&#160;protected]</a> for bank details.
                                </p>
                            </div>

                            <div className="mb-4">
                                <strong className="block text-sm font-bold text-[#555] mb-1">Online credit/ debit card or net banking:</strong>
                                <p className="text-justify text-sm text-[#555]">
                                    Author can also pay through online payment system. Follow this link:
                                </p>
                            </div>

                            <div className="mb-4">
                                <strong className="block text-sm font-bold text-[#555] mb-1">Demand Draft/ Cheque:</strong>
                                <p className="text-justify text-sm text-[#555]">
                                    Demand draft or cheque is also accepted for the payment of publication fees. For details, kindly drop a mail at
                                </p>
                            </div>

                            <div className="mb-4">
                                <strong className="block text-sm font-bold text-[#555] mb-1">Payment of Fee for Foreign Authors:</strong>
                                <div className="mt-2 pl-4 border-l-2 border-[#12b48b]">
                                    <strong className="block text-sm font-bold text-[#555] mb-1">Online credit/ debit card or net banking:</strong>
                                    <p className="text-justify text-sm text-[#555]">
                                        Authors can also pay through online payment system. Follow this link: <a href="http://www.elkindia.com/usdpayment/" target="_blank" rel="noopener noreferrer" className="text-[#12b48b] hover:underline">http://www.elkindia.com/usdpayment/</a>
                                    </p>
                                </div>
                            </div>

                        </div>


                    </div>
                </div>

                <div className="w-full lg:w-1/4 mt-8 lg:mt-0 lg:pl-6">
                    <NewsWidget />
                </div>
            </div>
        </div>
        </>
    );
};

export default ArticleProcessingCharges;