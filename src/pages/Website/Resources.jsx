import React from 'react';
import NewsWidget from "../../components/Website/NewsWidget";
import SEO from '../../components/SEO';

const Resources = () => {
    return (
        <>
            <SEO 
                title="Resources - ELK Asia Pacific Journals"
                description="Authors can download resources such as journal paper template, Call for Papers, Agreement for Editors, Cover letter template and other needed documents"
            />
            <div className="container mx-auto px-4 py-3">
            <div className="flex flex-wrap">
                <div className="w-full lg:w-3/4">
                    <div className="content-inner form-panel">
                        <h1 className="text-2xl text-[#12b48b] font-normal mb-2 relative inline-block">
                            Resources
                            {/* <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#12b48b] transform translate-y-1"></span> */}
                        </h1>

                        <div className=" mt-5 bg-[#204066] border-l-4 border-[#12b48b] text-white p-3 font-bold uppercase mb-6 text-sm">
                            INFORMATION FOR AUTHORS
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#757575] text-white">
                                        <th className="p-3 text-sm font-bold border-r border-gray-400 w-16">S.No</th>
                                        <th className="p-3 text-sm font-bold border-r border-gray-400">Title of the Content</th>
                                        <th className="p-3 text-sm font-bold w-32">Download</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-[#e0e0e0]">
                                        <td colSpan="3" className="p-3 text-center text-sm text-[#555]">
                                            No Records Found
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
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

export default Resources;