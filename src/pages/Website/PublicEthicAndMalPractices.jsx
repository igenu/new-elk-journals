import React from 'react';
import { FaEdit } from 'react-icons/fa';
import NewsWidget from "../../components/Website/NewsWidget";

const PublicEthicAndMalPractices = () => {
    return (
        <div className="container mx-auto px-4">
            <div className="flex flex-wrap">
                <div className="w-full lg:w-3/4">
                    <div className="content-inner form-panel">
                        <h1 className="text-2xl text-[#12b48b] font-normal mb-2 relative inline-block">
                            Terms and Condition
                            {/* <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#12b48b] transform translate-y-1"></span> */}
                        </h1>

                        <p className="mb-4 mt-4 text-justify text-sm text-[#555]">
                            Both the editorial board and authors are requested to maintain the research ethics and integrity during the process of peer review and publishing paper. All the parties such as the author, peer-reviewers, chief editors, managing editors and other governing members of the journal involved during the process of publishing. The Chief Editor must monitor that the status of the publishing process, check if the author and reviewers follow all publication rules and ethics. He must also keep and maintain the record of all papers submitted, peer reviewed, and approved. It is the responsibility of the editorial board to check and verify all research articles, and papers do not involve any plagiarism or fraudulent data. The authors are advised to read go through our terms and conditions and publishing policies and ethics on priority to avoid any unfavourable circumstance in future.
                        </p>

                        <strong className="block text-sm font-bold text-[#555] mb-2">Information for Authors</strong>
                        <ul className="space-y-3 mb-6">
                            {[
                                "All papers submitted are bound to blind peer review process during which the papers are scrutinized by two international and two national reviewers. The identities of the authors and the reviewers are kept anonymous throughout the process.",
                                "After the review process, there are three possible decisions made by the reviewers; rejected, approved, revise and resubmit. In case, if your manuscript is rejected either by the reviewer or chief editor, it would not be considered for publishing if resubmitted for review.",
                                "During the review process, all manuscripts shall be checked for plagiarism through anti-plagiarism software. If any paper is found plagiarized, it stands rejected on the basis of unethical practices in academia."
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-[#555]">
                                    <FaEdit className="text-[#204066] flex-shrink-0 mt-1" />
                                    <span className="text-justify">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <strong className="block text-sm font-bold text-[#555] mb-2">Author’s Concern</strong>
                        <ul className="space-y-3 mb-6">
                            {[
                                "The submitted paper should be original and authentic.",
                                "The submitted paper should not be published anywhere before.",
                                "All the data and information included in the paper should be real and authentic.",
                                "If the paper is revised and resubmitted, the author should present a revised copy along with reviewer’s comments."
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-sm text-[#555]">
                                    <FaEdit className="text-[#204066] flex-shrink-0" />
                                    <span className="text-justify">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <strong className="block text-sm font-bold text-[#555] mb-2">Reviewer’s Concern</strong>
                        <ul className="space-y-3 mb-6">
                            {[
                                "All manuscripts being evaluated should be kept confidential.",
                                "The reviewer should check and judge the paper unbiased.",
                                "The reviewer should cross-check that no similarity or likeness to already published work of any kind is found in the submitted manuscript.",
                                "Chief Editor or reviewer must provide the comments with useful suggestions for its overall improvement."
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-[#555]">
                                    <FaEdit className="text-[#204066] flex-shrink-0 mt-1" />
                                    <span className="text-justify">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <strong className="block text-sm font-bold text-[#555] mb-2">Chief Editor’s Concern</strong>
                        <ul className="space-y-3 mb-6">
                            {[
                                "The Chief Editor takes the final decision whether the submitted manuscript should be published in a journal or not.",
                                "The editor should critically evaluate the content and overall quality of the manuscript.",
                                "The editor should select the manuscript solely on the basis of its merit avoiding any other bias.",
                                "The editor should evaluate the paper for final publication only after it has been peer reviewed.",
                                "The editor should check the authenticity of the author’s funding sources.",
                                "The editor should ask the author of the paper for the consent letter from the concerned author if he has used some other published or unpublished work."
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-[#555]">
                                    <FaEdit className="text-[#204066] flex-shrink-0 mt-1" />
                                    <span className="text-justify">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <strong className="block text-sm font-bold text-[#555] mb-2">Plagiarism Policy</strong>
                        <p className="mb-4 text-justify text-sm text-[#555]">
                            The author as well as peer-reviewers and chief editor must abide by the plagiarism policy of ELK Journals. Plagiarism is considered to be an academic dishonesty in the field of academia and thus should be strictly avoided in the paper. It is defined as claiming other’s work, ideas or theory as one’s own. The author is advised to fully acknowledge all the works referred to while preparing the manuscript. All the references should be given credit and properly cited in the section of bibliography or Works Cited. Plagiarism less than 24% in manuscript, when checked on any software, is acceptable for publication. If more than 24% plagiarism is detected in the manuscript, the author shall not be able to submit the papers to the journal for a particular time determined by the Chief Editor.
                        </p>

                    </div>
                </div>

                <div className="w-full lg:w-1/4 mt-8 lg:mt-0 lg:pl-6">
                    <NewsWidget />
                </div>
            </div>
        </div>
    );
};

export default PublicEthicAndMalPractices;