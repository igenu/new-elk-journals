import React from 'react';
import { FaDownload, FaEdit } from 'react-icons/fa';
import NewsWidget from "../../components/Website/NewsWidget";
import SEO from '../../components/SEO';

const AuthorGuidlinens = () => {
    return (
        <>
            <SEO 
                title="Authors Information - ELK Asia Pacific Journals"
                description="Resources and instructions for Authors including Submission Guidelines, Research paper template, sample for covering letter, Call for Papers"
            />
            <div className="container mx-auto px-4 py-4">
            <div className="flex flex-wrap">
                <div className="w-full lg:w-3/4">
                    <div className="">
                        <h1 className="text-2xl text-[#12b48b] font-normal mb-2 relative inline-block">
                            Authors Guidelines
                            {/* <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#12b48b] transform translate-y-1"></span> */}
                        </h1>

                        <div className="bg-[#204066] border-l-4 border-[#12b48b] text-white p-3 font-bold uppercase mb-6 text-sm">
                            Information for Authors
                        </div>

                        <p className="mb-4 text-justify text-sm text-[#555]">
                            ELK Asia Pacific Journals feature a series of resources for authors to access, prepare, and submit manuscript. Alike a research article, the following section is categorised into major sections with guidelines, specific to each section.
                        </p>
                        <p className="mb-4 text-justify text-sm text-[#555]">
                            Following are the given sections of the series, click for direct access:
                        </p>

                        <div className="mb-8 space-y-8">
                            <div>
                                <h3 className="text-[#204066] font-bold text-sm mb-2 hover:text-[#12b48b] cursor-pointer">Manuscript Submission</h3>
                                <ul className="space-y-1">
                                    <li className="flex items-center gap-2 text-sm text-[#555]">
                                        <FaEdit className="text-[#204066]" /> Initial Submission
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-[#555]">
                                        <FaEdit className="text-[#204066]" /> Revised Submission
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-[#204066] font-bold text-sm mb-2 hover:text-[#12b48b] cursor-pointer">Research Paper Template for Manuscript Preparation</h3>
                                <ul className="space-y-1">
                                    <li className="flex items-center gap-2 text-sm text-[#555]">
                                        <FaEdit className="text-[#204066]" /> Title & Headings
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-[#555]">
                                        <FaEdit className="text-[#204066]" /> Manuscript Structure
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-[#555]">
                                        <FaEdit className="text-[#204066]" /> Referencing Style
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-[#555]">
                                        <FaEdit className="text-[#204066]" /> Figures & Tables
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-[#555] mb-2 uppercase">Undertaking for Manuscript Submission</h3>
                            <a href="#" className="inline-flex items-center gap-2 bg-[#204066] text-white px-4 py-2 text-xs font-bold uppercase hover:bg-[#1a3352] mb-4">
                                DOWNLOAD THE UNDERTAKING FORM <FaDownload />
                            </a>
                            <p className="text-justify text-sm text-[#555]">
                                Each manuscript must be accompanied by a declaration that it has neither been published nor submitted for publication, in whole or in part, either in a serial, professional journal or as part in a book which is formally published and made available to the public. This Undertaking also set terms of our Creative Commons licensing policy stating, “All contents in ELK Asia Pacific Journals are published under the terms of the Creative Commons Attribution 4.0 International License”.
                            </p>
                            <p className="text-justify text-sm text-[#555] mt-2 italic">
                                “All contents in ELK Asia Pacific Journals are published under the terms of the Creative Commons Attribution 4.0 International License”.
                            </p>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-[#555] mb-2 uppercase">Research Paper Template for Manuscript Preparation</h3>
                            <a href="#" className="inline-flex items-center gap-2 bg-[#204066] text-white px-4 py-2 text-xs font-bold uppercase hover:bg-[#1a3352] mb-4">
                                DOWNLOAD MS WORD TEMPLATE <FaDownload />
                            </a>
                            <p className="text-justify text-sm text-[#555]">
                                Authors are advised to download this word template and insert their paper content in the same for as to comply with the format of paper publication at ELK Asia Pacific Journals.
                            </p>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-[#555] mb-2">Title & Headings</h3>
                            <p className="text-justify text-sm text-[#555] mb-4">
                                The manuscript file must instigate with the ‘Title of the paper’ (Centered Times New Roman 10 Bold in Capital), which should be succeeded by the Author details, including
                            </p>
                            <ul className="space-y-1 mb-4">
                                {[
                                    "Full Name (Times New Roman 10 Bold in Capital)",
                                    "Designation (Times New Roman 10)",
                                    "Institutional Department (Times New Roman 10)",
                                    "Name of the Institute/University (Times New Roman 10)",
                                    "Address (Times New Roman 10)",
                                    "Email ID (Times New Roman 10)",
                                    "Contact Number (optional) (Times New Roman 10)"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm text-[#555]">
                                        <FaEdit className="text-[#204066] flex-shrink-0" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-8">
                            <strong className="block text-sm font-bold text-[#555] mb-2">Manuscript Structure</strong>

                            <div className="mb-4">
                                <strong className="block text-sm font-bold text-[#555] mb-1">1. Abstract</strong>
                                <p className="text-justify text-sm text-[#555]">
                                    The abstract should summarize the content of the paper. Try to keep the abstract below 350 words. Do not make references nor display equations in the abstract. The journal will be printed from the same-sized copy prepared by you. Your manuscript should be printed on A4 paper (21.0 cm x 29.7 cm). It is imperative that the margins and style described below be adhered to carefully. This will enable us to keep uniformity in the final printed copies of the Journal. Please keep in mind that the manuscript you prepare will be photographed and printed as it is received. Readability of copy is of paramount importance. (Times New Roman 10 Italicized Justified)
                                </p>
                            </div>
                            <div className="mb-4">
                                <strong className="block text-sm font-bold text-[#555] mb-1">2. Keywords</strong>
                                <p className="text-justify text-sm text-[#555]">
                                    About five key words in alphabetical order, separated by comma (Times New Roman 10)
                                </p>
                            </div>
                            <div className="mb-4">
                                <strong className="block text-sm font-bold text-[#555] mb-1">3. Other essential Sections:</strong>

                                <div className="mb-2">
                                    <strong className="text-sm font-bold text-[#555]">Introduction (Times New Roman 12 BOLD)</strong>
                                    <p className="text-justify text-sm text-[#555]">
                                        The introduction of the paper should explain the nature of the problem, previous work, purpose, and the contribution of the paper. The contents of each section may be provided to understand easily about the paper. (Times New Roman 12)
                                    </p>
                                </div>
                                <div className="mb-2">
                                    <strong className="text-sm font-bold text-[#555]">Heading I (Times New Roman 12 BOLD)</strong>
                                    <p className="text-justify text-sm text-[#555]">
                                        The headings and subheadings, starting with "Introduction", appear in upper and lower case letters and should be set in bold and aligned flush left. All headings from the Introduction to Acknowledgements are numbered sequentially using 1, 2, 3, etc. Subheadings are numbered 1.1, 1.2, etc. If a subsection must be further divided, use numbers in format 1.1.1, 1.1.2, etc. The font size for heading is 12 points bold face and subsections with 12 points and not bold. Do not underline any of the headings, or add dashes, colons, etc. (Times New Roman 12)
                                    </p>
                                </div>
                                <div className="mb-2">
                                    <strong className="text-sm font-bold text-[#555]">Indentations and Equations (Times New Roman 12 BOLD)</strong>
                                    <p className="text-justify text-sm text-[#555]">
                                        The first paragraph under each heading or subheading should be flush left, and subsequent paragraphs should have a five-space indentation. A colon is inserted before an equation is presented, but there is no punctuation following the equation. All equations are numbered and referred to in the text solely by a number enclosed in a round bracket (i.e., (3) reads as "equation 3"). Ensure that any miscellaneous numbering system you use in your paper cannot be confused with a reference [4] or an equation (3) designation. (12) (Times New Roman 12)
                                    </p>
                                </div>
                                <div className="mb-2">
                                    <strong className="text-sm font-bold text-[#555]">Conclusion (Times New Roman 12 Bold)</strong>
                                    <p className="text-justify text-sm text-[#555]">
                                        A conclusion section must be included and should indicate clearly the advantages, limitations, and possible applications of the paper. Although a conclusion may review the main points of the paper, do not replicate the abstract as the conclusion. A conclusion might elaborate on the importance of the work or suggest applications and extensions. (Times New Roman 12)
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <strong className="block text-sm font-bold text-[#555] mb-1">Referencing Styles</strong>
                                <p className="text-justify text-sm text-[#555]">
                                    A reference list MUST be included using the following information as a guide. Only cited text references are included. Each reference is referred to in the text by a number enclosed in a square bracket (i.e., [1]). References must be numbered and ordered alphabetically. All references must be complete and accurate. Where possible, include the DOI for the reference in the end of each reference.
                                </p>
                            </div>

                            <div className="mb-4">
                                <strong className="block text-sm font-bold text-[#555] mb-1">Examples follow:</strong>

                                <div className="mb-2">
                                    <strong className="text-sm font-bold text-[#555]">Journal Papers:</strong>
                                    <p className="text-justify text-sm text-[#555]">
                                        [1] Harlow, H. F. (1983). Fundamentals for preparing psychology journal articles. <em>Journal of Comparative and Physiological Psychology, 55,</em> 893-896.
                                    </p>
                                </div>
                                <div className="mb-2">
                                    <strong className="text-sm font-bold text-[#555]">Books:</strong>
                                    <p className="text-justify text-sm text-[#555]">
                                        [2] Duncan, G. J., & Brooks-Gunn, J. (Eds.). (1997). <em>Consequences of growing up poor.</em> New York, NY: Russell Sage Foundation.
                                    </p>
                                </div>
                                <div className="mb-2">
                                    <strong className="text-sm font-bold text-[#555]">Chapters in Books:</strong>
                                    <p className="text-justify text-sm text-[#555]">
                                        [3] Bishop, P. O. (1970). Neurophysiology of binocular vision. In J. Houseman (Ed.), <em>Handbook of physiology </em>(pp. 324-366). New York, NY: Springer.
                                    </p>
                                </div>
                                <div className="mb-2">
                                    <strong className="text-sm font-bold text-[#555]">Thesis:</strong>
                                    <p className="text-justify text-sm text-[#555]">
                                        [4] Chan, D.S. (1978). <em>Theory and implementation of multidimensional discrete systems for signal processing</em> (Doctoral dissertation). Massachusetts Institute of Technology, Cambridge, MA.
                                    </p>
                                </div>
                                <div className="mb-2">
                                    <strong className="text-sm font-bold text-[#555]">Proceedings Papers:</strong>
                                    <p className="text-justify text-sm text-[#555]">
                                        [5] Schnase, J. L., & Cunnius, E. L. (Eds.). (1995). Proceedings from CSCL '95: <em>The First International Conference on Computer Support for Collaborative Learning</em>. Mahwah, NJ: Erlbaum.
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <strong className="block text-sm font-bold text-[#555] mb-1">Figures & Tables</strong>
                                <ul className="list-disc pl-5 text-sm text-[#555] space-y-1">
                                    <li>To ensure high-quality illustrations, diagrams and tables MUST be computer drafted and supplied electronically in either TIFF or EPS format.</li>
                                    <li>Figure captions appear below the figure, are flush left, and are in lower case letters. When referring to a figure in the body of the text, the abbreviation "Fig." is used. Figures and Tables should be numbered in the order they appear in the text.</li>
                                    <li>Table captions appear centred above the table in upper and lower case letters. When referring to a table in the text, no abbreviation is used and "Table" is capitalized. (Times New Roman 12).</li>
                                    <li>Figures and tables should be included on a separate page at the end of the paper under the heading "List of Figures" and "List of Tables".</li>
                                </ul>
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

export default AuthorGuidlinens;