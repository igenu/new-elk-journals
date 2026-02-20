import React from 'react';
import { FaEdit } from 'react-icons/fa';
import NewsWidget from "../../components/Website/NewsWidget";
import SEO from '../../components/SEO';

const EthicalGuidLine = () => {
    return (
        <>
            <SEO 
                title="Publication Ethics - ELK Asia Pacific Journals"
                description="For ethical publishing of journal papers we have mentioned our ethical guidelines for authors, reviewers and editors so as to maintain authenticity and originality of the papers"
            />
            <div className="container mx-auto px-4 py-3">
            <div className="flex flex-wrap">
                <div className="w-full lg:w-3/4">
                    <div className="">
                        <h1 className="text-2xl text-[#12b48b] font-normal mb-2 relative inline-block">
                            Publication Ethics
                            {/* <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#12b48b] transform translate-y-1"></span> */}
                        </h1>

                        <h2 className="text-[#12b48b] text-lg font-normal mb-4 uppercase">INTRODUCTION - ETHICS AND INTEGRITY</h2>
                        <p className="mb-4 text-justify text-sm text-[#444]">
                            <strong>ELK Asia Pacific Journals is committed to upholding ethical standards and publisher’s integrity towards the journals’ authors, editors and the members of academic community.</strong>
                        </p>

                        <p className="mb-4 text-justify text-sm text-[#555]">
                            In the stride to maintain these high standards, we list down few essential guidelines for academic authors, reviewers and journal editors.
                        </p>

                        <p className="mb-8 text-justify text-sm text-[#555]">
                            <strong>ELK Group</strong> ensures that all the publications are refereed and complied with Double-Blind Review process. The guidelines are given below to help authors, peer reviewers and editors in keeping a check on the areas like work integrity, conflict of interest, plagiarism, validity of science, adaptions of the existing material, adequacy of context, avoidance of unethical experimentation, and authorship disputes.
                        </p>

                        <h2 className="text-[#12b48b] text-lg font-normal mb-4 uppercase">ETHICAL GUIDELINES FOR AUTHORS</h2>

                        <p className="mb-4 text-justify text-sm text-[#555]">
                            We expect authors, submitting their manuscripts to ELK Asia Pacific Journals, to agree upon the expected ethical guidelines:
                        </p>
                        <ul className="mb-8 space-y-3">
                            {[
                                "Authors must adhere to the fact that their work is original and does not infringe the intellectual property rights of any party, person or entity. Scientific articles are deemed to be free of plagiarism and therefore, cannot be construed on existing publications, including their own previously published work.",
                                "All authors, associated with the development of the manuscript with significant scientific contribution, must be mentioned on the title page since each of them holds equal rights regarding accountability for the content. One of the authors must represent as the corresponding author, who will be in contact till the publication process is completed.",
                                "All co-authors’ consent to publication and being named as co-author must be presented through the Copyright Transfer Agreement by the Corresponding author.",
                                "The manuscript, submitted to any of the ELK Asia Pacific Journals, should not be the sole submission. The same should not be submitted simultaneously to any other journal.",
                                "Authors should clearly declare that the work is not published before and it is not based in substance on any previously published material, either in whole or in part.",
                                "Authors must ensure to cite all relevant references appropriately in the APA format. Any information, useful to the manuscript, which is obtained from sources such as conversations, correspondence, or discussion with some third party, should be reported or cited in the reference section. Prior permission must be taken from that third party before citing the same.",
                                "Manuscripts must include all appropriate and necessary instructions and warnings, relating to the specific experiment conducted in the study. It is advisable to provide any safety guidelines or prevalent code of practice as reference in the manuscript.",
                                "The data sets or databases described in the article must be facilitated with access details for the readers to refer, if needed.",
                                "Authors should describe any potential conflict of interest which could be held to arise with respect to the article content. The same can be declared in a cover letter and shall be submitted to the journal.",
                                "Authors must disclose information of all funders or sources of funding for the research conducted in the article."
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-[#555]">
                                    <FaEdit className="text-[#204066] mt-1 flex-shrink-0" />
                                    <span className="text-justify">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <h2 className="text-[#12b48b] text-lg font-normal mb-4 uppercase">ETHICAL GUIDELINES FOR PEER REVIEWERS</h2>
                        <p className="mb-4 text-justify text-sm text-[#555]">
                            All peer reviewers must make every reasonable effort to adhere to enlisted ethical guidelines for reviewing articles submitted to ELK Asia Pacific Journals:
                        </p>
                        <ul className="mb-8 space-y-3">
                            {[
                                "Reviewers must give unbiased consideration to the manuscript solely on the basis of its merits.",
                                "Reviewers should bring to the journal editor’s notice any potential conflict of interest with regards to the content of the research article, prior to reviewing the same.",
                                "Reviewers must maintain confidentiality with reference to the manuscript, its research information and correspondence cited in the reference, if any. The manuscript should, in no case, be shared with a third party, external to the peer review process.",
                                "Referees should develop a comprehensive and appropriately evidenced peer review report, with constructive feedback for the author to work on.",
                                "Any statement, which might be impugning to any person's reputation, should be avoided.",
                                "Reviewers should strive to stand up to the specified deadlines to ensure submission and publication in a timely manner.",
                                "Reviewers should declare any significant similarity, if found between the article under consideration and any published paper of which they are aware."
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-[#555]">
                                    <FaEdit className="text-[#204066] mt-1 flex-shrink-0" />
                                    <span className="text-justify">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <h2 className="text-[#12b48b] text-lg font-normal mb-4 uppercase">ETHICAL GUIDELINES FOR JOURNAL EDITORS</h2>

                        <p className="mb-4 text-justify text-sm text-[#555]">
                            Significant ethical guidelines that all journal editors must comply with are as given below:
                        </p>
                        <ul className="mb-8 space-y-3">
                            {[
                                "Editors must give unbiased consideration to the manuscript solely on the basis of its merits.",
                                "Editors must maintain confidentiality with reference to the manuscript, research information and correspondence cited in the reference, if any. The manuscript should, in no case, be shared with a third party, external to the peer review process.",
                                "Any claim received against the submitted article that the same is being under consideration elsewhere or has already been published, should be called to the journal editor’s attention for the latter to investigate further.",
                                "Editors hold the authority to accept or reject a submitted manuscript without resort to formal peer review if the manuscript is found inappropriate to the journal’s scope or entails plagiarized content.",
                                "Editors should strive to stand up to the specified deadlines to ensure submission and publication in a timely manner."
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-[#555]">
                                    <FaEdit className="text-[#204066] mt-1 flex-shrink-0" />
                                    <span className="text-justify">{item}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="mb-8 text-justify text-sm text-[#555]">
                            ELK Asia Pacific Journals recommend authors, peer reviewers and editors to comply with the aforementioned ethical code of conduct.
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

export default EthicalGuidLine;