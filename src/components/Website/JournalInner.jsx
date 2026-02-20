import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUnlockAlt, FaCheck, FaCalendarAlt, FaBookOpen, FaUserTie, FaTwitter, FaPrint, FaGlobe, FaEnvelope } from 'react-icons/fa';
import NewsWidget from './NewsWidget';
import { getSubmitManuscriptUrl } from '../../utils/navigationHelpers';

import Image1 from "../../assets/images/6.png";
import Image2 from "../../assets/images/11.png";
import Image3 from "../../assets/images/12.png";
import Image4 from "../../assets/images/13.png";
import Image5 from "../../assets/images/17.png";
import Image6 from "../../assets/images/14.jpg";
import Image7 from "../../assets/images/15.jpg";
import { ImageURl } from '../../services/serviceApi';


const JournalInner = ({ journalData }) => {
    const [activeTab, setActiveTab] = useState('journals');
    const [currentCitation, setCurrentCitation] = useState(Image1);
    const navigate = useNavigate();

    const citationImages = [Image1, Image2, Image3, Image4, Image5, Image6, Image7];

    useEffect(() => {
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * citationImages.length);
            setCurrentCitation(citationImages[randomIndex]);
        }, 3000); // Change image every 3 seconds
        return () => clearInterval(interval);
    }, []);



    return (
        <section className="py-12 bg-gray-50 font-roboto">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* LEFT SIDEBAR */}
                    <div className="w-full lg:w-1/4 space-y-6">
                        {/* Open Access Widget */}
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                            <div className="bg-gradient-to-r from-[#12b48b] to-[#0e9673] text-white p-4 font-bold uppercase flex items-center gap-2">
                                <FaUnlockAlt className="text-xl" /> Open Access
                            </div>
                            <div className="p-6 flex justify-center bg-gradient-to-b from-white to-gray-50">
                                <img src={`${ImageURl}${journalData.coverImage}`} alt={journalData.title} className="max-w-full h-auto shadow-xl rounded-md hover:scale-105 transition-transform duration-300" />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            <button className="w-full bg-gradient-to-r from-[#204066] to-[#1a3352] text-white py-4 px-5 uppercase font-bold text-sm tracking-wide text-left flex justify-between items-center hover:from-[#1a3352] hover:to-[#12304a] transition-all duration-300 shadow-lg hover:shadow-xl rounded-lg border-l-4 border-l-[#12b48b] transform hover:scale-105 relative overflow-hidden group">
                                <span className="relative z-10">Peer Review Process</span>
                                <span className="relative z-10 text-xl">→</span>
                            </button>
                            <button onClick={() => navigate('/publication-ethics-and-malpractice-statement')} className="w-full bg-gradient-to-r from-[#12b48b] to-[#0e9673] text-white py-4 px-5 uppercase font-bold text-sm tracking-wide text-left flex justify-between items-center hover:from-[#0e9673] hover:to-[#0a7857] transition-all duration-300 shadow-lg hover:shadow-xl rounded-lg border-l-4 border-l-[#204066] transform hover:scale-105 relative overflow-hidden group">
                                <span className="relative z-10">Publication Ethics <br />& Malpractice Statement</span>
                            </button>
                            <button className="w-full bg-gradient-to-r from-[#0d2a4f] to-[#1a3a63] text-white py-4 px-5 uppercase font-bold text-sm tracking-wide text-center hover:from-[#112233] hover:to-[#1a3352] transition-all duration-300 shadow-lg hover:shadow-xl rounded-lg transform hover:scale-105 relative overflow-hidden group">
                                <Link to="mailto:info@elkjournals.com" className="flex items-center justify-center gap-2">
                                    <span className="relative z-10 text-white">Contact Editorial Office</span>
                                    <FaEnvelope className="relative z-10 text-white text-lg" />
                                </Link>
                            </button>
                        </div>

                        {/* News Widget */}
                        <div className="mt-4">
                            <NewsWidget />
                        </div>
                    </div>


                    {/* CENTER CONTENT */}
                    <div className="w-full lg:w-1/2">
                        <h1 className="text-2xl text-[#12b48b] font-normal mb-6 leading-tight">
                            {journalData.title}
                        </h1>

                        {/* Tabs Navigation */}
                        <div className="flex border-b-2 border-gray-300 mb-6">
                            {['journals', 'areas', 'editorial'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`relative py-3 px-6 text-sm font-bold transition-all duration-300 rounded-t-lg mr-2 ${activeTab === tab
                                        ? 'bg-gradient-to-b from-[#204066] to-[#1a3352] text-white shadow-lg transform -translate-y-0.5 after:content-[""] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-t-[10px] after:border-t-[#1a3352] after:border-x-[10px] after:border-x-transparent'
                                        : 'bg-gray-100 text-[#204066] hover:bg-gray-200 hover:shadow-md border border-gray-300'
                                        }`}
                                >
                                    {tab === 'journals' ? 'About Journals' : tab === 'areas' ? 'Areas Covered' : 'Editorial Board'}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="bg-white p-8 shadow-xl rounded-lg border border-gray-200 min-h-[500px]">

                            {/* ABOUT JOURNALS TAB */}
                            {activeTab === 'journals' && (
                                <div className="space-y-4 text-gray-700 text-sm leading-relaxed text-justify">
                                    <div className="font-bold text-[#204066] bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border-l-4 border-[#12b48b] shadow-md">
                                        <span className="text-[#12b48b] text-xl font-extrabold">{journalData.stats.volumes}</span> Volumes,
                                        <span className="text-[#12b48b] text-xl font-extrabold mx-2">{journalData.stats.issues}</span> Issues,
                                        <span className="text-[#12b48b] text-xl font-extrabold">{journalData.stats.articles}</span> Articles available from {journalData.stats.yearRange}.
                                    </div>

                                    {Array.isArray(journalData.about) && journalData.about.map((para, index) => (
                                        <p key={index} dangerouslySetInnerHTML={{ __html: para }} />
                                    ))}

                                    <div className="mt-6">
                                        <h4 className="font-bold text-[#204066] mb-3 border-b pb-2">Key Audiences:</h4>
                                        <ul className="space-y-2">
                                            {Array.isArray(journalData.keyAudiences) && journalData.keyAudiences.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <FaUserTie className="text-[#12b48b] mt-1 shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* AREAS COVERED TAB */}
                            {activeTab === 'areas' && (
                                <div>
                                    <p className="font-bold text-[#204066] mb-4">The subject areas covered under the scope of the journal include:</p>
                                    {Array.isArray(journalData.areasCovered) && journalData.areasCovered.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {journalData.areasCovered.map((area, idx) => (
                                                <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 border-l-2 border-[#12b48b] hover:bg-gray-100 transition-colors">
                                                    <FaBookOpen className="text-gray-400 text-xs" />
                                                    <span className="text-sm font-medium text-gray-700">{area}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-600">
                                            <FaBookOpen className="text-4xl text-gray-300 mx-auto mb-2" />
                                            <p>No subject areas have been defined for this journal yet.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* EDITORIAL BOARD TAB */}
                            {activeTab === 'editorial' && (
                                <div className="space-y-8">
                                    {/* Chief Editor */}
                                    {journalData?.editorialBoard?.chiefEditor?.title && <div>
                                        <h3 className="bg-[#204066] text-white p-2 font-bold text-sm uppercase mb-0">Chief Editor</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse border border-gray-200 text-sm">
                                                <tbody>
                                                    <tr className="bg-gray-50">
                                                        <td className="border p-3 font-bold text-[#204066] w-[10%]">{journalData?.editorialBoard?.chiefEditor?.title}</td>
                                                        <td className="border p-3 font-bold text-[#12b48b] w-[25%]">{journalData?.editorialBoard?.chiefEditor?.name}</td>
                                                        <td className="border p-3 text-gray-700 w-[45%]">{journalData?.editorialBoard?.chiefEditor?.affiliation}</td>
                                                        <td className="border p-3 text-center w-[20%]">
                                                            <a href={journalData?.editorialBoard?.chiefEditor?.profileLink} className="text-[#204066] hover:text-[#12b48b] underline font-medium text-xs">View Profile</a>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>}

                                    {/* Members */}
                                    <div>
                                        <h3 className="bg-[#12b48b] text-white p-2 font-bold text-sm uppercase mb-0">Editorial Board Members</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse border border-gray-200 text-sm">
                                                <tbody>
                                                    {Array.isArray(journalData?.editorialBoard?.members) && journalData.editorialBoard.members.map((member, idx) => (
                                                        <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                            <td className="border p-3 font-bold text-[#204066] w-[10%]">{member?.title}</td>
                                                            <td className="border p-3 font-bold text-gray-800 w-[25%]">{member?.name}</td>
                                                            <td className="border p-3 text-gray-600 w-[45%]">{member?.affiliation}</td>
                                                            <td className="border p-3 text-center w-[20%]">
                                                                <a href={member?.profileLink} className="text-[#204066] hover:text-[#12b48b] underline font-medium text-xs">View Profile</a>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>


                    {/* RIGHT SIDEBAR */}
                    <div className="w-full lg:w-1/4 space-y-6">

                        {/* Metrics Widget */}
                        <div className="bg-gradient-to-r from-[#12b48b] to-[#0e9673] text-white p-4 font-bold uppercase text-sm rounded-t-lg shadow-md">
                            Journal Metrics
                        </div>
                        <div className="bg-white rounded-b-lg p-4 space-y-4 shadow-lg border border-t-0 border-gray-200">
                            <div className="flex items-center gap-4 border-b border-dashed border-gray-300 pb-4 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                <div className="bg-gradient-to-br from-gray-200 to-gray-300 p-3 rounded-lg text-[#204066] shadow-md"><FaPrint size={24} /></div>
                                <div className="text-[#204066] font-semibold">
                                    {journalData.issn.print} <span className="text-sm text-gray-600">(ISSN Print)</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 border-b border-dashed border-gray-300 pb-4 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                <div className="bg-gradient-to-br from-gray-200 to-gray-300 p-3 rounded-lg text-[#204066] shadow-md"><FaGlobe size={24} /></div>
                                <div className="text-[#204066] font-semibold">
                                    {journalData.issn.online} <span className="text-sm text-gray-600">(ISSN Online)</span>
                                </div>
                            </div>
                        </div>

                        {/* Impact Factor Widget */}
                        {journalData?.impactFactors?.length > 0 && <>   <div className="bg-gradient-to-r from-[#00cca3] to-[#00b894] text-white p-4 font-bold uppercase text-sm rounded-t-lg shadow-md">
                            JID Impact Factor
                        </div>
                            <div className="bg-white rounded-b-lg border border-t-0 border-gray-200 p-3 space-y-2 shadow-lg max-h-[400px] overflow-y-auto custom-scrollbar">
                                {journalData?.impactFactors?.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-[#00cca3] transition-all duration-200">
                                        <div className="bg-[#00cca3] text-white p-2 rounded-lg">
                                            <FaCalendarAlt className="text-sm" />
                                        </div>
                                        <div className="font-semibold text-gray-700 text-sm">
                                            <span className="font-bold text-[#204066]">{item.year}:</span> <span className="text-[#00cca3] font-bold">{item.score}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>  </>}

                        {/* Submit Manuscript Button */}
                        <Link to={getSubmitManuscriptUrl()} className="block w-full bg-gradient-to-r from-[#204066] to-[#1a3352] hover:from-[#12b48b] hover:to-[#0e9673] text-white hover:text-white font-bold py-5 px-4 text-center uppercase tracking-wider transition-all duration-300 shadow-xl hover:shadow-2xl rounded-lg transform hover:scale-105">
                            Submit Your Manuscript →
                        </Link>

                        {/* Index & Citations Widget */}
                        <div className="bg-gradient-to-r from-[#009688] to-[#00796b] text-white p-4 font-bold uppercase text-sm rounded-t-lg shadow-md">
                            Index & Citations
                        </div>
                        <div className="bg-gradient-to-b from-white to-gray-50 rounded-b-lg border border-t-0 border-gray-200 p-6 flex justify-center items-center shadow-lg min-h-[140px]">
                            <img
                                src={currentCitation}
                                alt="Index and Citation"
                                className="max-w-full max-h-[90px] object-contain transition-all duration-500 hover:scale-110"
                            />
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}

export default JournalInner;