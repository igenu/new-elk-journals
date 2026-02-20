import React from 'react';
import { FaBook } from 'react-icons/fa';
// Importing a dummy image, or we can use a placeholder URL
import pubImage from '../../assets/images/pub.png';
import journalImage from '../../assets/images/jm-eapjmrm.jpg';

const publicationsData = [
    {
        id: 1,
        institute: "C.H.M.E. Society - Dr. Moonje Institute of Management and Computer Studies, Nashik",
        title: "Innovative Sustainable Management with Intelligent Technologies",
        isbn: "978-93-49790-69-8",
        doi: "10.17492/JPI/ICISI2025/251200",
        editor: "Dr. Preeti Mahesh Kulkarni",
        image: journalImage
    },
    {
        id: 2,
        institute: "Prestige Institute of Management and Research, Gwalior",
        title: "Digital Transformation in Business and Society: Future Perspectives",
        isbn: "978-93-5566-123-4",
        doi: "10.17492/JPI/DTBS2025/112233",
        editor: "Dr. Davish Jain",
        image: pubImage
    },
    {
        id: 3,
        institute: "Symbiosis Institute of Operations Management, Nashik",
        title: "Operations Excellence in the Era of Industry 4.0",
        isbn: "978-93-8899-77-1",
        doi: "10.17492/JPI/OEIE2024/889977",
        editor: "Dr. Vandana Sonwaney",
        image: journalImage
    },
    {
        id: 4,
        institute: "Amity Business School, Amity University, Noida",
        title: "Sustainable Business Practices for Global Competitiveness",
        isbn: "978-81-9456-22-0",
        doi: "10.17492/JPI/SBPGC2024/556677",
        editor: "Dr. Sanjeev Bansal",
        image: pubImage
    },
    {
        id: 5,
        institute: "Jaipuria Institute of Management, Lucknow",
        title: "Emerging Trends in Finance and Accounting",
        isbn: "978-93-1122-33-4",
        doi: "10.17492/JPI/ETFA2024/998811",
        editor: "Dr. Masood Siddiqui",
        image: journalImage
    },
];

const ConferencePublications = () => {
    return (
        <div className="space-y-6 animate-fadeIn">
            {publicationsData.map((pub) => (
                <div
                    key={pub.id}
                    className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row"
                >
                    {/* Image Section */}
                    <div className="md:w-48 h-64 md:h-auto flex-shrink-0 bg-gray-100 flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-gray-100">
                        {pub.image ? (
                            <img
                                src={pub.image}
                                alt={pub.title}
                                className="max-h-full max-w-full object-contain shadow-sm"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}
                        {/* Fallback Icon if image fails or isn't provided (hidden by default if image exists) */}
                        <div
                            className="text-6xl text-gray-300 hidden items-center justify-center w-full h-full"
                            style={{ display: pub.image ? 'none' : 'flex' }}
                        >
                            <FaBook />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex flex-col justify-center flex-grow">
                        <div className="mb-2">
                            <h4 className="text-gray-500 font-bold text-sm uppercase tracking-wide">
                                {pub.institute}
                            </h4>
                        </div>

                        <h3 className="text-2xl font-bold text-[#008ba3] mb-4 leading-tight font-sans">
                            {pub.title}
                        </h3>

                        <div className="space-y-2 mb-6">
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 font-medium">
                                <span>
                                    <span className="text-gray-400">e-ISBN :</span> {pub.isbn}
                                </span>
                                <span>
                                    <span className="text-gray-400">DOI :</span> {pub.doi}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-gray-500 font-bold text-lg">Editor:</span>
                            <span className="bg-[#6c757d] text-white px-3 py-1 rounded text-sm font-bold shadow-sm">
                                {pub.editor}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ConferencePublications;
