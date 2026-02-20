import React from 'react';
import { FaEdit } from 'react-icons/fa';
import Image from "../../assets/images/im-logo.png";
import NewsWidget from "../../components/Website/NewsWidget";
import SEO from '../../components/SEO';

const ImpactFactors = () => {
    return (
        <>
            <SEO 
                title="Impact Factor Score, Journals Impact Factor - ELK Asia Pacific Journal"
                description="Know the impact factor of our journals and choose the relevant journal that is suitable to your research area"
            />
            <div className="container mx-auto px-4 py-8">
            <div className="flex flex-wrap">
                <div className="w-full lg:w-3/4">
                    <div className="">
                        <h1 className="text-2xl text-[#12b48b] font-normal mb-2 relative inline-block">
                            Impact Factor
                        </h1>

                        {/* <div className="flex justify-center mb-8">
                            <img src={Image} className="max-w-full h-auto" alt="Impact Factor Scores" />
                        </div> */}

                        <div className="bg-[#204066] text-white p-4 font-bold text-center mb-6 uppercase text-sm">
                            ELK Asia Pacific Journals reveals its success story to a trending measure of quality!
                        </div>

                        <p className="mb-6 text-justify text-sm text-[#555]">
                            In the advent of quantifying a journal's quality by its impact factor, we at ELK Asia Pacific journals also ran into the race of weighing our journals' quality standards. With our indexing in international directories, applying for a score for each journal was a necessity. This brought us closer to Journals Directory, one of the leading international journal databases which performs a quantitative survey to assign an impact factor score.
                        </p>

                        <div className="bg-gray-100 border-l-4 border-r-4 border-[#12b48b] p-6 mb-8">
                            <strong className="block mb-4 text-sm text-[#555]">
                                Their assessments and evaluations with complex software and technology were more than enough to suffice our doubt. At the onset, the inclusion criteria itself summarized on the following factors that a journal must act in accordance with:
                            </strong>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ul className="space-y-3">
                                    {[
                                        "How the journal is seeking to add value to the academia",
                                        "Does the journal offer full-text access to its readers",
                                        "How far does the journal reaches in demographic terms",
                                        "Which review process does the journal follows"
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-[#555]">
                                            <FaEdit className="text-[#204066] mt-1 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <ul className="space-y-3">
                                    {[
                                        "What is the journal’s acceptance rate",
                                        "For eJournals, how are the articles archived",
                                        "Does the journal allows self-archiving of articles",
                                        "Whether the Copyright retains with the author"
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-[#555]">
                                            <FaEdit className="text-[#204066] mt-1 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <p className="mb-8 text-justify text-sm text-[#555]">
                            Upon our journal’s inclusion in the directory, the detailed 4-step evaluation commenced, which consumed more than a month’s time. After few of such long-lasting assessments, we finally achieved success in getting our rewarding scores for our open access international journals.
                        </p>

                        <h2 class="lg-title" style={{ marginBottom: "2rem" }}>Glance below to have insight to our impact factor scores for few of our reputed publications:</h2>

                        <ul className="space-y-4  ">
                            {[
                                { title: "ELK Asia Pacific Journal of Marketing and Retail Management (Impact Factor: 3.99)", link: "https://www.journalsdirectory.com/elk-asia-pacific-journal-of-marketing-and-retail-management(eapjmrm).htm" },
                                { title: "ELK Asia Pacific Journal of Finance and Risk Management (Impact Factor: 3.456)", link: "https://www.journalsdirectory.com/elk-asia-pacific-journal-of-finance-and-risk-management(eapjfrm).htm " },
                                { title: "ELK Asia Pacific Journal of Social Sciences (Impact Factor: 2.546)", link: "https://www.journalsdirectory.com/elk-asia-pacific-journal-of-social-sciences-(eapjss).htm " },
                                { title: "ELK Asia Pacific Journal of Computer Science and Information Systems (Impact Factor: 2.026)", link: "https://www.journalsdirectory.com/elk-asia-pacific-journal-of-computer-science-and-information-systems(eapjcsis).htm" },
                                { title: "ELK Asia Pacific Journal of Human Resource Management and Organisational Behaviour (Impact Factor: 2.096)", link: "https://www.journalsdirectory.com/elk-asia-pacific-journal-of-human-resource-management-and-organisational-behaviour(eapjhrmob).htm" }
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                    <FaEdit className="text-[#204066] mt-1 flex-shrink-0" />
                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-[#204066] font-normal ">
                                        {item.title}
                                    </a>
                                </li>
                            ))}
                        </ul>

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

export default ImpactFactors