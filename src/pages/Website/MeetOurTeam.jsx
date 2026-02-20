import React from 'react';
import { FaEdit } from 'react-icons/fa';
import NewsWidget from "../../components/Website/NewsWidget";
import SEO from '../../components/SEO';

const MeetOurTeam = () => {
    return (
        <>
        <SEO
                title="Meet Our Team - ELK Asia Pacific Journals"
                description=""
            />
        <div className="container mx-auto px-4 py-2">
            <div className="flex flex-wrap">
                <div className="w-full lg:w-3/4">
                    <div className="content-inner form-panel">
                        <h1 className="text-2xl text-[#12b48b] font-normal mb-2 relative inline-block">
                            Meet Our Team
                            {/* <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#12b48b] transform translate-y-1"></span> */}
                        </h1>

                        <p className="mb-6 text-justify text-sm text-[#555]">
                            We are a unit of India’s first educational BPO ELK Consultants Pvt Ltd offering a wide range of educational services to institutions, universities, and students. We embrace the hard work done by researchers and scholars and hence, through ELK Asia Pacific Journals, attempt to let them in gaining recognition all over the world. Since its inception, over 2000 academic journals and articles are published with us, and are available on the internet with Open Access policy. As Google Scholar indexed journal and trusted educational resource, we aim to meet the requirement of readers, scholars, institutes, and universities to ease their quest of scholarly journals and papers.
                        </p>

                        <p className="mb-4 text-sm text-[#000] font-bold">
                            The management team at EECPL is as below:
                        </p>

                        <div className="space-y-6">
                            {[
                                {
                                    name: "Mr. R. S. Maker, Chief Mentor:",
                                    desc: "A post graduate from XLRI- 1974 batch, Mr. Maker has about 35 years of experience in the field of HR, Industrial Relations, Consulting and Education. From 2002 – 2006 he was the Director of ITM- Kharghar. Under his leadership, ITM saw 100% placements for the first time and the ranking of the institute rose on All India Basis."
                                },
                                {
                                    name: "Dr. (Mrs.) Vidya Vijay Naik, Advisor:",
                                    desc: "B.Sc., M.A, M.Ed, PGDBM, PhD Research expert and Associate dean for NMIMS. As a professor par excellence, she advises EECPL on various academic and research related issues. She has academic experience of over 35 years and is active member of various academic committees and board of studies."
                                },
                                {
                                    name: "Mr. Atiksh, Executive Director:",
                                    desc: "An engineer and management post graduate with hands on experience in financial services industry. An expert for quality in processes and carries with him multi-level industry relations. Atiksh has been instrumental in framing up of systems and processes at EECPL."
                                },
                                {
                                    name: "Mrs. Preeti Dhanda, IT head:",
                                    desc: "B.Sc., MCA, MBA. She has served as independent consultant to B-Schools for E-learning. Preeti has been the key force behind our expertise in development of E-learning systems and IT systems."
                                },
                                {
                                    name: "Mrs. Shilpi Verma, Finance Head:",
                                    desc: "Postgraduate in Management with specialization in Finance from University of Technology, Sydney. She manages the financial aspects of the organization and the associated economic matters."
                                }
                            ].map((member, idx) => (
                                <div key={idx}>
                                    <div className="flex items-start gap-2 mb-2">
                                        <FaEdit className="text-[#204066] mt-1 flex-shrink-0" />
                                        <strong className="text-sm text-[#555]">{member.name}</strong>
                                    </div>
                                    <p className="text-justify text-sm text-[#555] pl-6">
                                        {member.desc}
                                    </p>
                                </div>
                            ))}
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

export default MeetOurTeam;