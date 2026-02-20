import React from 'react';
import { FaEdit } from 'react-icons/fa';
import NewsWidget from "../../components/Website/NewsWidget";
import SEO from '../../components/SEO';

const ViewCallForPaper = () => {
    return (
        <><SEO
            title="View Latest Call for Papers by ELK Asia Pacific Journals"
            description="Find and submit relevant journal for your manuscript publication here. All journals have ISSN and are listed internationally"
            
            />
        <div className="container mx-auto px-4 py-4">
            <div className="flex flex-wrap">
                <div className="w-full lg:w-3/4">
                    <div className="">
                        <h1 className="text-2xl text-[#12b48b] font-normal mb-2 relative inline-block">
                            Call for Papers
                        </h1>

                        <div className="bg-[#204066] mt-5 border-l-4 border-[#12b48b] text-white p-3 font-bold uppercase mb-6 text-sm">
                            ELK ASIA PACIFIC JOURNALS CALL FOR PAPERS
                        </div>

                        <p className="mb-4 text-justify text-sm text-[#555]">
                            ELK Asia Pacific Journals are the <strong>first Indian Open-Access Journals to have a CrossRef membership</strong>(Membership ID: 10.16962), which enables us to provide a unique and persistent DOI (Digital Object Identifier) for every article. All our internationally listed journals have ISSN and are Google Scholar indexed.
                        </p>
                        <p className="mb-4 text-justify text-sm text-[#555]">
                            Articles can be submitted through <strong><a href="#" className="text-[#204066] hover:underline">Online Submission Form</a></strong> or email at <strong><a href="mailto:info@elkjournals.com" className="text-[#12b48b] hover:underline">[email&#160;protected]</a></strong> or <strong><a href="mailto:admin@elkjournals.com" className="text-[#12b48b] hover:underline">[email&#160;protected]</a></strong>.
                        </p>
                        <p className="mb-4 text-justify text-sm text-[#555]">
                            Every submission is undergone a <strong><a href="#" className="text-[#204066] hover:underline">Double-blind Peer review process</a></strong> which takes up to 12-14 days. Authors are requested to revise their scripts as per the directions of our Editorial Board members.
                        </p>

                        <strong className="block text-sm font-bold text-[#555] mb-4">How publishing with us credits you:</strong>

                        <div className="space-y-4 border-t border-b border-gray-300 py-4 mb-4">
                            {[
                                {
                                    title: "Publish Open-Access:",
                                    desc: "Articles published with us are fully accessible for readers with no fee restrictions. This enables wider readability of research material and thereby increased citation of the same."
                                },
                                {
                                    title: "Google Scholar Indexing:",
                                    desc: "Every article is indexed at Google Scholar. You may see one of our indexed journals for your reference."
                                },
                                {
                                    title: "Digital Object Identifier (DOI):",
                                    desc: "Unique and persistent DOI is assigned to every article which continues to link to the correct resource even if the URL changes overtime or the specific location of the content moves. The registered articles for DOI are also indexed at CrossRef metadata search. (For instance, click here)"
                                },
                                {
                                    title: "List in Global Directories:",
                                    desc: "Internationally recognised by Cabell's Directory, Index Copernicus International, and ROAD Directory of Open Access Scholarly Resources."
                                }
                            ].map((item, idx) => (
                                <div key={idx} className={` ${idx !== 3 ? 'border-b border-dashed border-gray-300' : ''}`}>
                                    <div className="flex items-start gap-2 text-sm text-[#555]">
                                        <FaEdit className="text-[#204066] flex-shrink-0 mt-1" />
                                        <p className="text-justify">
                                            <strong>{item.title}</strong> {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <p className="mb-4 text-justify text-sm text-[#555]">
                            Thus, your papers reach to masses, increase your readership, and appreciated in academia.
                        </p>
                        <p className="mb-4 text-justify text-sm text-[#555]">
                            Authors are invited to submit their Research Articles, Review Papers, Case Studies, Empirical Analysis and Industry Reports.
                        </p>
                        <p className="mb-4 text-justify text-sm text-[#555]">
                            <strong>Note:</strong> Print on-demand option can also be opted for a complete issue. All articles are published under the terms of Creative Commons Attribution 4.0 International (CC-BY 4.0) License. With this, the copyright remains with the author and shall not be transferred to the journal publishers.
                        </p>

                        <strong className="block text-sm font-bold text-[#555] mb-4">The complete list of our publications is as follows:</strong>

                        <ul className="space-y-2 mb-8">
                            {[
                                "ELK Asia Pacific Journal of Finance and Risk Management",
                                "ELK Asia Pacific Journal of Marketing and Retail Management",
                                "ELK Asia Pacific Journal of Computer Science and Information Systems",
                                "ELK Asia Pacific Journal of Manufacturing Science and Engineering",
                                "ELK Asia Pacific Journal of Human Resource Management and Organisational Behaviour",
                                "ELK Asia Pacific Journal of Leadership and Innovation Management",
                                "ELK Asia Pacific Journal of Mechanical Engineering Research",
                                "ELK Asia Pacific Journal of Applied Thermal Engineering",
                                "ELK Asia Pacific Journal of Civil Engineering and Structural Development",
                                "ELK Asia Pacific Journal of Electronics and Communication Management",
                                "ELK Asia Pacific Journal of Library Management and Information Technology",
                                "ELK Asia Pacific Journal of Social Sciences",
                                "ELK Asia Pacific Journal of Project Management and Control"
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-sm text-[#555]">
                                    <FaEdit className="text-[#204066] flex-shrink-0" /> {item}
                                </li>
                            ))}
                        </ul>

                        <p className="text-justify text-sm text-[#555]">
                            For more details on manuscript preparation and submission, email at <a href="mailto:info@elkjournals.com" className="text-[#12b48b] hover:underline">[email&#160;protected]</a> or <a href="mailto:admin@elkjournals.com" className="text-[#12b48b] hover:underline">[email&#160;protected]</a>.
                        </p>

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

export default ViewCallForPaper;