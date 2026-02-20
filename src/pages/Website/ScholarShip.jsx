import React from 'react';
import { FaEdit } from 'react-icons/fa';
import ScholarshipForm from '../../components/Website/ScholarshipForm';
import NewsWidget from "../../components/Website/NewsWidget";
import SEO from '../../components/SEO';

const ScholarShip = () => {
    return (
        <>
        <SEO
            title="Scholarships - ELK Asia Pacific Journals"
            description=""
        />
        <div className=" bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* LEFT COLUMN - content area */}
                    <div className="lg:col-span-3">
                        <div className="content-inner form-panel">
                            <h1 className="text-2xl text-[#12b48b] font-normal mb-4 relative inline-block">
                                ELK’s Scholarships
                                {/* <span className="absolute bottom-0 left-0 w-12 h-1 bg-[#12b48b] -mb-2"></span> */}
                            </h1>

                            <p className="text-justify text-base text-gray-600 mb-4 leading-relaxed">
                                We are delighted to announce that ELK Asia Pacific Journals has launched its scholarship program. Under which, the winning author with best journal paper will be rewarded a scholarship of $500. The manuscript may be written in any of the following research domain:
                            </p>

                            <div className="space-y-2 mb-4 text-gray-600 text-sm">
                                <div className="flex items-center gap-2 item-center">
                                    <FaEdit className="text-[#204066]" /> Management
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaEdit className="text-[#204066]" /> Computer Science
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaEdit className="text-[#204066]" /> Engineering focused into
                                </div>

                                <div className="pl-8 space-y-2 mt-2">
                                    <div className="flex items-center gap-2">
                                        <FaEdit className="text-[#204066]" /> Mechanical
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaEdit className="text-[#204066]" /> Thermal
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaEdit className="text-[#204066]" /> Civil
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaEdit className="text-[#204066]" /> Manufacturing
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaEdit className="text-[#204066]" /> Electrical
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-2">
                                    <FaEdit className="text-[#204066]" /> Social Sciences
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaEdit className="text-[#204066]" /> Law
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaEdit className="text-[#204066]" /> Medical Sciences
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaEdit className="text-[#204066]" /> Communication Technology
                                </div>
                            </div>

                            <p className="text-justify text-base text-gray-600 mb-8 leading-relaxed">
                                The deadline for submitting your manuscript is Saturday, 29th September, 2018. The winner will be announced on Wednesday, 10th October, 2018. Submissions can be made using the following form or via email at <a href="mailto:info@elkjournals.com" className="text-blue-600 hover:underline">info@elkjournals.com</a>.
                            </p>

                            {/* Refactored Form Component */}
                            <ScholarshipForm />
                        </div>
                    </div>

                    {/* RIGHT COLUMN - Sidebar */}
                    <div className="lg:col-span-1">
                        <NewsWidget />
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default ScholarShip;
