import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import NewsWidget from "../../components/Website/NewsWidget";

const SiteMap = () => {
    const sections = [
        {
            title: "About ELK",
            links: [
                { label: "Publishing Policies", isHeader: true },
                { label: "Open Access & Licencing", to: "/open-access-and-licencing" },
                { label: "Ethical Guidelines", to: "/ethical-guidelines" },
            ]
        },
        {
            title: "Impact Factor Score",
            links: [
                { label: "Impact Factor", to: "/impact-factor" },
                { label: "Journal Indexing", to: "/journal-indexing" },
                { label: "Meet our team", to: "/meet-our-team" },
                { label: "Why publish with us?", to: "/why-publish-with-us" },
            ]
        },
        {
            title: "Journals we publish",
            links: [
                { label: "Marketing and Retail Management", to: "/journal-of-marketing" },
                { label: "Finance and Risk Management", to: "/journal-of-finance" },
                { label: "Social Sciences", to: "/social-sciences" },
                { label: "HR Management and Organizational Behaviour", to: "/hr-management" },
                { label: "Computer Science and Information Systems", to: "/computer-science" },
                { label: "Leadership and Innovation Management", to: "/leadership-management" },
                { label: "Civil Engineering and Structural Development", to: "/civil-engineering" },
                { label: "Mechanical Engineering Research", to: "/mechanical-engineering" },
                { label: "Applied Thermal Engineering", to: "/applied-thermal" },
                { label: "Electronics and Communication Technology", to: "/electronics-communication" },
                { label: "Library Management and Information Technology", to: "/library-management" },
                { label: "Project Management and Control", to: "/project-management" },
                { label: "Manufacturing Science and Engineering", to: "/manufacturing-science" },
            ]
        },
        {
            title: "Authors",
            links: [
                { label: "Browse Journals", to: "/browse-journals" },
                { label: "View Call for Papers", to: "/view-call-for-papers" },
                { label: "Author's Guidelines", to: "/authors-guidelines" },
                { label: "Article Processing Charges", to: "/article-processing-charges" },
                { label: "Resources", to: "/resources" },
            ]
        },
        {
            title: "Footer Menu",
            links: [
                { label: "Home", to: "/" },
                { label: "About Us", to: "/about-us" },
                { label: "Scholarship", to: "/scholarships" },
                { label: "Copyrights", to: "/docs/copyrights.pdf", external: true },
                { label: "Privacy Policy", to: "/privacy-policy" },
                { label: "Terms and Conditions", to: "/terms-and-conditions" },
                { label: "Blog", to: "/blog" },
                { label: "Contact Us", to: "/contact-us" },
            ]
        }
    ];

    const itemRenderer = (link, idx) => (
        <div key={idx} className="flex items-center gap-2 min-w-fit">
            <FaEdit className="text-[#666] text-[10px] mt-0.5" />
            {link.external ? (
                <a href={link.to} target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#555] hover:text-[#12b48b] transition-colors leading-tight">
                    {link.label}
                </a>
            ) : (
                <Link to={link.to} className="text-[12px] text-[#555] hover:text-[#12b48b] transition-colors leading-tight">
                    {link.label}
                </Link>
            )}
        </div>
    );

    return (
        <div className="py-8 bg-white min-h-screen font-sans">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        <div className="flex justify-between items-start mb-6">
                            <h1 className="text-2xl text-[#12b48b] font-normal mb-2 relative inline-block">
                                ELK's Sitemap

                                {/* <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#12b48b] transform translate-y-1"></span> */}
                            </h1>
                        </div>

                        <div className="mb-8">
                            <Link to="/" className="inline-flex items-center gap-2 text-lg font-bold text-[#204066] pb-2 border-b-2 border-[#12b48b] hover:text-[#12b48b] transition-colors group">
                                <span className="text-2xl group-hover:scale-110 transition-transform">🏠</span>
                                Home
                            </Link>
                        </div>

                        <div className="space-y-6">
                            {sections?.length > 0 && sections.map((section, idx) => (
                                <div key={idx}>
                                    <h2 className="text-lg font-bold text-[#204066] mb-3 pb-2 border-b-2 border-[#12b48b] flex items-center gap-2">
                                        <span className="text-xl">📌</span>
                                        {section.title}
                                    </h2>
                                    <div className="flex flex-wrap gap-x-8 gap-y-2 pl-2">
                                        {section?.links?.length > 0 && section?.links.map((link, linkIdx) => (
                                            link.isHeader ? (
                                                <div key={linkIdx} className="w-full text-[#333] text-sm font-semibold mb-2 mt-2 uppercase tracking-wide">
                                                    {link.label}
                                                </div>
                                            ) : (
                                                <div key={linkIdx} className="flex items-center gap-2 group">
                                                    <span className="text-[#12b48b] text-sm group-hover:scale-125 transition-transform">→</span>
                                                    {link.external ? (
                                                        <a href={link.to} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-700 hover:text-[#12b48b] hover:font-semibold transition-all duration-200">
                                                            {link.label}
                                                        </a>
                                                    ) : (
                                                        <Link to={link.to} className="text-sm text-gray-700 hover:text-[#12b48b] hover:font-semibold transition-all duration-200">
                                                            {link.label}
                                                        </Link>
                                                    )}
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <NewsWidget />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SiteMap;