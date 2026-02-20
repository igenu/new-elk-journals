import React from 'react';
import { FaCheckCircle, FaBan, FaEdit } from 'react-icons/fa';
import NewsWidget from "../../components/Website/NewsWidget";
import SEO from '../../components/SEO';

const OpenAccessAndLicencing = () => {
    return (
        <>
            <SEO 
                title="Open Access Policies - ELK Asia Pacific Journals"
                description="ELK Asia Pacific Journals are Open Access and adhere to the BOAI definition of Open Access. After blind review process, articles are published under CC-BY International license."
            />
            <div className="container mx-auto px-4 py-2">
            <div className="flex flex-wrap">
                <div className="w-full lg:w-3/4">
                    <div className="">
                        <h1 className="text-2xl text-[#12b48b] font-normal mb-2 relative inline-block">
                            Open Access Policy at ELK Asia Pacific Journals
                            {/* <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#12b48b] transform translate-y-1"></span> */}
                        </h1>

                        <p className="mb-4 text-justify"> <strong>Free, Unlimited Access to research information</strong></p>
                        <p className="mb-4 text-justify text-sm text-[#555]">Open Access, as its name suggests, all the scholarly articles and journals have unrestricted access by its readers, without any charge to the user or his/her institution.</p>
                        <p className="mb-4 text-justify text-sm text-[#555]">With our devotion to strengthen and expand the base of quality research material, we endeavour to serve the best interest of the researchers and scholars through our Open Access publishing policy. Making all the published articles freely available online for global access, we stand our objective of wide dissemination of research material.</p>
                        <p className="mb-4 text-justify"><strong>Under the Open Access Terms:</strong></p>
                        <p className="mb-6 text-justify text-sm text-[#555]">Users can search, read, download, and cite any article from the journals without prior permission from the publisher or the author.</p>

                        <h2 className="title-heading-content mb-4"><a href="#" className="text-[#12b48b] hover:underline text-lg">ELK ASIA PACIFIC JOURNALS ADHERES TO THE PRINCIPLES OF BUDAPEST OPEN ACCESS INITIATIVE (BOAI)</a></h2>
                        <p className="mb-4 text-justify text-sm text-[#555]"><strong>Following the declarations of BOAI, we allow Open Access to peer reviewed research literature to make research articles, papers and journals available and accessible on internet free of cost. ELK Journals allow readers and users across the globe to: </strong></p>

                        <ul className="ml-2 mb-6 text-sm text-[#555] space-y-3 list-none">
                            {[
                                "Read",
                                "Download",
                                "Distribute",
                                "Print",
                                "Search",
                                "Or link to the full texts of these articles",
                                "Crawl them for indexing",
                                "Pass them as data to software",
                                "Use them for any lawful purpose, without financial, legal, or technical barriers (other than those inseparable from gaining access to the internet itself)."
                            ].map((item, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <FaEdit className="text-[#204066] mt-0.5 text-xs flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <p className="mb-4 text-justify text-sm text-[#555]"><strong>Note:</strong> Users and readers are strongly recommended to read, understand and follow the provided BAOI guideline below,</p>
                        <p className="mb-8 text-justify text-sm text-[#555]">"The only constraint on reproduction and distribution, and the only role for copyright in this domain, should be to give authors control over the integrity of their work and the right to be properly acknowledged and cited".</p>

                        <div className="overflow-x-auto">
                            <table className="table w-full mb-8 border border-gray-300">
                                <thead>
                                    <tr className="bg-[#757575]" style={{ backgroundColor: "#757575" }}>
                                        <th className="  text-center p-3 text-lg font-bold text-white border-r border-gray-200 w-1/3" style={{ color: "white" }} >Key Points</th>
                                        <th className="  text-center p-3 text-lg font-bold text-white border-r border-gray-200 w-1/3" style={{ color: "white" }} >Open Access</th>
                                        <th className="  text-center p-3 text-lg font-bold text-white w-1/3 border-gray-200 w-1/3" style={{ color: "white" }}>Restricted Access</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { label: "Wide Reach", open: true, restricted: false },
                                        { label: "Increased Citation", open: true, restricted: false },
                                        { label: "Unlimited & Free Subscription", open: true, restricted: false },
                                        { label: "Easy to share & redistribute", open: true, restricted: false },
                                        { label: "Convenient Access", open: true, restricted: false },
                                        { label: "Blind Peer Reviewed", open: true, restricted: true },
                                        { label: "Easy in tracking references", open: true, restricted: false },
                                        { label: "Time lag from publication to receipt of article", open: false, restricted: true },
                                        { label: "Copyrights Transfer", open: false, restricted: true },
                                        { label: "Google Scholar Indexing", open: true, restricted: false },
                                        { label: "Entry to Foreign Databases", open: true, restricted: false },
                                    ].map((row, idx) => (
                                        <tr key={idx} className={`border-b border-gray-300 ${idx % 2 === 0 ? 'bg-[#eee]' : 'bg-white'}`}>
                                            <td className="p-3 text-sm text-[#555] text-center border-r border-gray-300 font-medium">{row.label}</td>
                                            <td className="p-3 text-center border-r border-gray-300 align-middle">
                                                {row.open ? <FaCheckCircle className="inline text-[#12b48b] text-2xl" /> : <FaBan className="inline text-black text-2xl" />}
                                                {/* Using FaBan as a placeholder for the crossed circle icon in the image if needed, or stick to FaBan */}
                                            </td>
                                            <td className="p-3 text-center align-middle">
                                                {row.restricted ? <FaCheckCircle className="inline text-[#12b48b] text-2xl" /> : <FaBan className="inline text-black text-2xl" />}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>


                        <p className="mb-4 text-justify text-sm text-[#555]">All openly accessible articles undergo the same quality and relevancy check; they go through the same review process as the traditional print journal articles. The decision of acceptance or rejection rests on the papers’ merit. The articles are archived, through a self-archiving mode, for perpetuity and are submitted for relevant indexing and abstracting services, adopted by ELK Asia Pacific Journals.</p>

                        <p className="mb-4 text-justify text-sm text-[#555]">For liberal reproduction and distribution of published journal articles, we adopt Creative Commons license and encourage authors to choose for CC-BY license to realise the full potential of a research literature by removing the barriers to reuse. The license acts as an effective legal agreement in achieving this.</p>

                        <p className="mb-4 text-justify text-sm text-[#555]">More information on our policies can be extracted by getting in touch with us at <a href="mailto:info@elkjournals.com" className="text-[#12b48b] hover:underline">info@elkjournals.com.</a></p>


                    </div>
                </div>

                <div className="w-full lg:w-1/4 mt-8 lg:mt-0 lg:pl-6">
                    <NewsWidget />
                </div>

            </div>
        </div>
        </>
    )
}

export default OpenAccessAndLicencing;