import React, { useState } from 'react';
import ConferenceList from './ConferenceList';
import ProposalRequestForm from '../../components/Website/ProposalRequestForm';
import ConferencePublications from '../../components/Website/ConferencePublications';
import ConferenceListWithFilters from '../../components/Website/ConferenceListWithFilters';
import {
    FaGlobe,
    FaFileAlt,
    FaClipboardCheck,
    FaSync,
    FaComments,
    FaEnvelopeOpenText,
    FaChartPie,
    FaBookOpen,
    FaCertificate,
    FaSearch,
    FaPencilRuler,
    FaBullhorn,
    FaHandshake,
    FaCloud
} from 'react-icons/fa';

const ConferenceSolutionsPage = () => {
    // Default to "List of Conferences" as per user request to show current content?
    // User content: "I want current content which currently show on "CONFERENCE SOLUTIONS" page in "List of conferences tab."
    // User also said: "I want tab meun when we click on "CONFERENCE SOLUTIONS""
    // Usually the first tab is default. Let's make "List of Conferences" default if that's what they want to see, 
    // OR "Conference Home" if that's the first tab. 
    // Unless "Conference Home" is empty.
    // Let's stick to the order: Home, List, Pubs, Proposal. 
    // And set active to "List of Conferences" IF the user wants the content strictly there.
    // BUT usually one expects the first tab to be active.
    // However, if "Conference Home" is a placeholder, maybe start with List?
    // Let's start with "Conference Home" as default to follow standard tab behavior, but I'll make sure the user knows it's a placeholder.
    // Actually, re-reading: "I want current content which currently show on "CONFERENCE SOLUTIONS" page in "List of conferences tab."
    // This implies when I go to the page, I might want to see that.
    // But if I put it in 2nd tab, and 1st tab is empty, it looks bad.
    // I will set the default State to "list" for now so they see the content immediately, or "home" if I add some dummy text.
    // Let's set default to 'list' for better UX if 'home' is empty.
    const [activeTab, setActiveTab] = useState('home');

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <div className="space-y-12 animate-fadeIn">
                        {/* Hero Section */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#12b48b] to-[#204066]"></div>
                            <div className="p-8 text-center">
                                <h2 className="text-2xl md:text-3xl font-extrabold text-[#204066] mb-4 tracking-tight">
                                    ELK Online Conference Management System
                                </h2>
                                <p className="text-xl text-[#12b48b] font-semibold mb-6 italic text-center">
                                    "One-Stop Solution for All Your Conference Needs"
                                </p>
                                <p className="text-gray-600 max-w-4xl mx-auto leading-relaxed text-lg">
                                    ELK CMS is a comprehensive online solution designed to help organizers manage key conference activities through a single, intuitive platform. Whether you are hosting a National or Global academic Conference/Seminar, our system brings efficiency, transparency, and specific visibility to your event.
                                </p>
                            </div>
                        </div>

                        {/* Highlights Section - List View */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                            <div className="mb-8 border-b border-gray-100 pb-4">
                                <h3 className="text-xl font-bold text-[#204066] uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-[#12b48b] rounded-full"></span>
                                    Key Highlights
                                </h3>
                            </div>

                            <ul className="space-y-4">
                                {[
                                    { title: "Exclusive Website", desc: "Up to 20+ webpages for each conference with Independent conference weblink." },
                                    { title: "Individual Webpages", desc: "For conference Objectives, Theme/Sub-themes, Organizers, CFP, Boards, Submissions, Publications etc." },
                                    { title: "Online Submission Management", desc: "Registration, Abstracts & Paper at conference theme/track level." },
                                    { title: "Auto-reconciliation Management", desc: "In between Registrations & Submissions and Paper & Abstract submission." },
                                    { title: "Online Query Management", desc: "For participants, to post their queries directly to the conference team." },
                                    { title: "Auto Acknowledgement E-mails", desc: "To participants, authors, conference team for each registration, abstract, paper and query submission." },
                                    { title: "Periodic MIS & Analytics", desc: "For all Submissions & Registrations and Shared drive access to download submitted documents." },
                                    { title: "Open Access e-Publication", desc: "In a 'flip book animation & downloadable pdf version' Edited Book & Proceedings with e-ISBN and DOI number." },
                                    { title: "Certificate", desc: "For Participants/Presentations/Publications and Copyright Form for authors." },
                                    { title: "Plagiarism/Similarity", desc: "Check Tool Service." },
                                    { title: "Designing Services", desc: "For Conference Brochure/Flyer etc." },
                                    { title: "Promotion", desc: "For Conference & Publications via ELK academic network." },
                                    { title: "Opportunity", desc: "To publish selected quality articles in ELK journals." },
                                    { title: "Conference website hosting", desc: "At best-in-class Amazon's AWS cloud server with high-end security." },
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start gap-3 text-gray-700">
                                        <div className="mt-1.5 min-w-[6px] h-[6px] rounded-full bg-[#12b48b]"></div>
                                        <span className="text-[15px] leading-relaxed">
                                            <strong className="text-[#204066] font-semibold italic">{item.title}</strong>
                                            {item.desc.startsWith(":") ? item.desc : ` ${item.desc}`}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8 pt-4 border-t border-gray-100 text-gray-600 italic">
                                ... and many more features.
                            </div>
                        </div>
                    </div>
                );
            case 'list':
                return <ConferenceListWithFilters />;
            case 'proposal':
                return <ProposalRequestForm />;
            case 'publications':
                return <ConferencePublications />;
            default:
                return <ConferenceList type="all" />;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Tabs Section - Direct placement without heading */}
            <div className="container mx-auto px-4 pt-8">
                {/* Tabs Container */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                    <div className="flex flex-wrap md:flex-nowrap">
                        {/* Tab: Conference Home */}
                        <button
                            onClick={() => setActiveTab('home')}
                            className={`flex-1 py-4 px-2 text-center font-bold text-sm uppercase tracking-wide transition-colors duration-300
                                ${activeTab === 'home'
                                    ? 'bg-[#12b48b] text-white'
                                    : 'bg-white text-[#2c4a6e] hover:bg-gray-100'
                                } border-r border-gray-200 last:border-r-0`}
                        >
                            Conference Home
                        </button>

                        {/* Tab: List of Conferences */}
                        <button
                            onClick={() => setActiveTab('list')}
                            className={`flex-1 py-4 px-2 text-center font-bold text-sm uppercase tracking-wide transition-colors duration-300
                                ${activeTab === 'list'
                                    ? 'bg-[#12b48b] text-white'
                                    : 'bg-white text-[#2c4a6e] hover:bg-gray-100'
                                } border-r border-gray-200 last:border-r-0`}
                        >
                            List of Conferences
                        </button>

                        {/* Pricing Tab REMOVED as per request */}

                        {/* Tab: Proposal Request Form */}
                        <button
                            onClick={() => setActiveTab('proposal')}
                            className={`flex-1 py-4 px-2 text-center font-bold text-sm uppercase tracking-wide transition-colors duration-300
                                ${activeTab === 'proposal'
                                    ? 'bg-[#12b48b] text-white'
                                    : 'bg-white text-[#2c4a6e] hover:bg-gray-100'
                                } border-r border-gray-200 last:border-r-0`}
                        >
                            Proposal Request Form
                        </button>

                        {/* Tab: Conference Publications */}
                        <button
                            onClick={() => setActiveTab('publications')}
                            className={`flex-1 py-4 px-2 text-center font-bold text-sm uppercase tracking-wide transition-colors duration-300
                                ${activeTab === 'publications'
                                    ? 'bg-[#12b48b] text-white'
                                    : 'bg-white text-[#2c4a6e] hover:bg-gray-100'
                                }`}
                        >
                            Conference Publications
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="pb-12">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default ConferenceSolutionsPage;
