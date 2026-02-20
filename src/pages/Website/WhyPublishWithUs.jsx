import React from 'react';
import { Link } from 'react-router-dom';
import { FaHandPointer, FaFileAlt } from 'react-icons/fa';
import NewsWidget from "../../components/Website/NewsWidget";
import SEO from '../../components/SEO';
import { getSubmitManuscriptUrl } from '../../utils/navigationHelpers';

const WhyPublishWithUs = () => {
    return (
        <>
            <SEO
                title="Choose us for quick journal publication - ELK Asia Pacific Journals"
                description="Our team of expert peer reviewers aim at providing quick and easy publication service to journals. Write in to us to get published"
            />
            <div className="container mx-auto px-4 py-3">
                <div className="flex flex-wrap">
                    <div className="w-full lg:w-3/4">
                        <div className="content-inner form-panel">
                            <h1 className="text-2xl text-[#12b48b] font-normal mb-2 relative inline-block">
                                Why Publish with us?
                            </h1>

                            <p className="mb-4 text-justify text-sm text-[#555]">
                                You aspire to spread your work to the widest possible audience; we aspire to provide you a vital platform for widening to the farthest reach.
                            </p>

                            <p className="mb-4 text-justify text-sm text-[#555]">
                                At ELK Asia Pacific Journals, we stand strong to our commitments of publishing work of highest standards and disseminating with no barring. Since inception in 2009, we are working at the sole discretion of supporting & enriching the scientific research community, leaving scope for advanced future studies. Supported by our parent company, ELK Education Consultants Pvt. Ltd., we successfully empanel a qualified resource team to maintain the set criterions.
                            </p>

                            <p className="mb-4 text-sm text-[#000] font-normal">
                                Reasons you should publish with us:
                            </p>

                            <div className="space-y-6">
                                {[
                                    {
                                        title: "Open Access with DOI",
                                        desc: "We give free and open access to all the articles, solicited in our journals, making it easy to read, download, share and cite in further studies. All published manuscripts are assigned a unique and perpetual Digital Object Identifier (DOI) number through which the papers can be easily collaborated, shared and cited in further research."
                                    },
                                    {
                                        title: "Impact Factor Rewards",
                                        desc: "Our immense hard work bore us JD Impact Factor scores of 2.045 in 2014 for our international journal of marketing and retail management, with an even higher quotient of 2.137 for the journal of finance. These two, being amongst the former publications under ELK Asia Pacific Journals, have gone a long way ahead in making an impact in the academe."
                                    },
                                    {
                                        title: "Fast and fair",
                                        desc: "Running with a professional team of experienced editors and reviewers, we strive for quick and fair decisions, with constructive feedback. You can expect review of your manuscript in less than 15 working days from both the reviewers."
                                    }
                                ].map((item, idx) => (
                                    <div key={idx}>
                                        <strong className="block text-sm font-bold text-[#555] mb-1">{item.title}</strong>
                                        <p className="text-justify text-sm text-[#555]">{item.desc}</p>
                                    </div>
                                ))}

                                <div>
                                    <strong className="block text-sm font-bold text-[#555] mb-2">Refereed</strong>
                                    <p className="text-justify text-sm text-[#555] mb-2">
                                        The Double Blind Peer Review process that we follow gives every reason to an author to choose us. We take quality of manuscripts getting published with us seriously and run software based grammar check and plagiarism scan of all manuscripts before forwarding them to the editorial board.
                                    </p>
                                    <a href="#" className="inline-flex items-center gap-2 bg-[#204066] text-white px-4 py-2 text-xs font-bold uppercase hover:bg-[#1a3352]">
                                        Glance through our Review Process <FaHandPointer />
                                    </a>
                                </div>

                                {[
                                    {
                                        title: "No Bars for readers",
                                        desc: "Without any subscription cost or access constraints, we support policymakers, educationists, researchers and practitioners in their attempts of discovering new ideas and theories."
                                    },
                                    {
                                        title: "Global Reach",
                                        desc: "International indexes and databases such as Google Scholar, Journals Directory, Cabell's, Index Copernicus, ROAD, CiteFactor, JournalsGuide and various others that showcase our ELK Asia Pacific Journals, allocate us a tag of being international. Many Universities from India, Middle East, Pacific, US and Canada recommend our journal for publications and this is the best testimony of our robust evaluation process."
                                    }
                                ].map((item, idx) => (
                                    <div key={idx}>
                                        <strong className="block text-sm font-bold text-[#555] mb-1">{item.title}</strong>
                                        <p className="text-justify text-sm text-[#555]">{item.desc}</p>
                                    </div>
                                ))}

                                <div>
                                    <strong className="block text-sm font-bold text-[#555] mb-2">Simple, quick and free submission</strong>
                                    <div className="flex items-start gap-4">
                                        <Link to={getSubmitManuscriptUrl()} className="inline-flex items-center gap-2 bg-[#204066] text-white px-4 py-2 text-xs font-bold uppercase hover:bg-[#1a3352] flex-shrink-0">
                                            Submit an Article <FaFileAlt />
                                        </Link>
                                        <p className="text-justify text-sm text-[#555]">
                                            A simple online submission form seeks brief details, consuming just a minute. You are not entitled for any submission or withdrawal charges for your manuscript.
                                        </p>
                                    </div>
                                </div>

                                {[
                                    {
                                        title: "No Copyright transfers",
                                        desc: "You retain the copyrights with our publication licensing terms of Creative Commons (CC-BY 4.0), which states that your published article can be freely shared and adapted for other purpose, as long as it is attributed under the terms stated by the license agreement."
                                    },
                                    {
                                        title: "Outspreading Editorial Board",
                                        desc: "Editors from diverse research streams and foreign nations are adding on to our connections, consistently and are giving a cutting-edge to your research. Our editorial board is active and remain engaged in local communities promoting academic research."
                                    },
                                    {
                                        title: "Acknowledgement for Publication",
                                        desc: "All articles published with ELK Asia Pacific Journals are authorised and acknowledged with a Publication Certificate. At request and cost, a print copy of the journal edition can be sent to contributing author."
                                    },
                                    {
                                        title: "Membership Plan",
                                        desc: "Time to time, we bring updates and give invites to events for members, associated with us."
                                    }
                                ].map((item, idx) => (
                                    <div key={idx}>
                                        <strong className="block text-sm font-bold text-[#555] mb-1">{item.title}</strong>
                                        <p className="text-justify text-sm text-[#555]">{item.desc}</p>
                                    </div>
                                ))}

                                <div>
                                    <strong className="block text-sm font-bold text-[#555] mb-1">Email Assistance</strong>
                                    <p className="text-justify text-sm text-[#555]">
                                        Authors can write in to <a href="mailto:info@elkjournals.com" className="text-[#204066] hover:underline">info@elkjournals.com</a> or <a href="mailto:admin@elkjournals.com" className="text-[#204066] hover:underline">admin@elkjournals.com</a> for any required assistance related to review process, publication status and journal impact factor. You can also find email id of the editors at the respective journal pages.
                                    </p>
                                </div>

                                <div>
                                    <strong className="block text-sm font-bold text-[#555] mb-1">Special Issue Publications by ELK Asia Pacific Journals</strong>
                                    <p className="text-justify text-sm text-[#555] mb-4">
                                        Conferences and seminars are an open and resourceful source for expert views and opinions. These interactive sessions, in the form of paper presentations & discussions sprung up endless innovative ideas. We, at ELK Asia Pacific Journals, don’t leave any stone unturned when it comes to disseminating scientific information & knowledge.
                                    </p>
                                    <p className="text-justify text-sm text-[#555]">
                                        This introduces our initiative of Special Issue Publication for Conference Proceedings. Being an academic partner, we tie-up with national and international institutes, conducting Seminars & Conferences, and indulge in paper review and publication task. With both online and offline platforms, proceedings are published by us under this category, with an ISBN number, after a dual review process at both ends.
                                    </p>
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

export default WhyPublishWithUs;