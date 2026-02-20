import React from 'react';
import { FaEdit } from "react-icons/fa";
import NewsWidget from "../../components/Website/NewsWidget";
import SEO from '../../components/SEO';

const TermsAndConditions = () => {
    return (
        <>
        <SEO 
            title="Terms & Conditions - ELK Asia Pacific Journals"
            description=""
        />
        <div className="py-8 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* LEFT COLUMN - content area */}
                    <div className="lg:col-span-3">
                        <div className="mb-8">
                            <h1 className="text-2xl text-[#12b48b] font-normal mb-2 relative inline-block">
                                Terms and Conditions
                                {/* <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#12b48b] transform translate-y-1"></span> */}
                            </h1>
                        </div>

                        <div className="text-sm text-gray-600 leading-relaxed text-justify space-y-6">
                            <p>
                                Elkjournals and its affiliates provide their services in subjection with the terms and conditions given hereunder. All our readers, users and authors are directed to read and accept our terms and conditions. You are subjected to the terms and conditions whenever you avail the services of ELK Asia Pacific Journals for any business affiliated with www.elkjournals.com, whether or not included in the www.elkjournals.com web site.
                            </p>

                            <p>
                                These terms and conditions supersede all previous representations, understandings, or agreements and shall prevail notwithstanding any variance with any other terms of any order placed or service provided by ELK Education Consultants Pvt. Ltd. By using the services of ELK Education Consultants Pvt. Ltd you agree to be bound by these terms and conditions. All services and information displayed on ELK Education Consultants Pvt. Ltd constitute an "invitation to offer".
                            </p>

                            <div>
                                <h3 className="text-[#204066] font-bold mb-2">Applicable law</h3>
                                <p>
                                    This site is created and controlled by ELK Education Consultants Pvt. Ltd. The laws of India shall apply and courts in Delhi/New Delhi shall have jurisdiction in respect of all the terms, conditions and disclaimers. ELK Education Consultants Pvt. Ltd reserves the right to make changes to the website and the terms, conditions and disclaimers at any time and without information to the customers/users of the services/website of ELK Education Consultants Pvt. Ltd.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-[#204066] font-bold mb-2">Definitions</h3>
                                <p>
                                    "Agreement" means the terms and conditions as detailed herein including all schedules, appendices, annexure, privacy policy, and will include the references to this agreement as amended, negated, supplemented, varied or replaced from time to time.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-[#204066] font-bold mb-2">Electronic Communication</h3>
                                <p>
                                    When you visit ELK Education Consultants Pvt. Ltd or send emails to us, or give us your feedback, you are communicating with us electronically. You also consent to receive communications from us electronically. We will communicate with you by email or by posting notices on this website. You agree that all agreements, notices, disclosures and other communications that we provide to you electronically satisfy any legal requirement that such communications be in writing.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-[#204066] font-bold mb-2">Trademark</h3>
                                <p>
                                    The logo/image of ELK Education Consultants Pvt. Ltd on the home page of the website and other pages and as used in the communication to the User is registered by ELK Education Consultants Pvt. Ltd and cannot be used or communicated or distributed without the specific and written permission of ELK Education Consultants Pvt. Ltd.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-[#204066] font-bold mb-2">License and Site Access</h3>
                                <p>
                                    ELK Education Consultants Pvt. Ltd grants you a limited license to access and make personal use of this site and not to download (other than page caching) or modify it, or any portion of it, except in case ELK Education Consultants Pvt. Ltd gives consent for the same. This license does not include any resale or commercial use of this site or its contents; any collection and use of any product listings, descriptions, or prices; any derivative use of this site or its contents; any downloading or copying of account information for the benefit of another merchant; or any use of data mining, robots, or similar data gathering and extraction tools. This site, or any portion of this site, may not be reproduced, duplicated, copied, sold, resold, visited, or otherwise exploited for any commercial purpose without express written consent of ELK Education Consultants Pvt. Ltd. You may not frame or use framing techniques to enclose any trademark, logo, or other proprietary information (including images, text, page layout, or form) of www.elkjournals.com and our affiliates without express written consent. You may not use any Meta tags or any other "hidden text" and ELK Education Consultants Pvt. Ltd's name or trademarks without the express written consent of ELK Education Consultants Pvt. Ltd. Any unauthorized use terminates the permission or license granted by ELK Education Consultants Pvt. Ltd. You are granted a limited, revocable, and non-exclusive right to create a hyperlink to the home page of ELK Education Consultants Pvt. Ltd as long as the link does not portray ELK Education Consultants Pvt. Ltd, its affiliates, or their products or services in a false, misleading, derogatory, or otherwise offensive manner or having a right to ownership of the same in any form. You may not use any ELK Education Consultants Pvt. Ltd logo or other proprietary graphic or trademark as part of the link without express written permission.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-[#204066] font-bold mb-2">Suspension due to Non-Compliance with Agreement</h3>
                                <p className="mb-4">
                                    Notwithstanding other legal remedies that may be available to ELK Education Consultants Pvt. Ltd, ELK Education Consultants Pvt. Ltd may in its sole discretion limit user activity by immediately removing user listing either temporarily or indefinitely, or suspend or terminate user membership, and/or refuse to provide user with access to the site if:
                                </p>
                                <ul className="space-y-2 ml-4">
                                    <li className="flex gap-2 items-start">
                                        <div className="mt-1 text-[#204066]">
                                            <FaEdit className="text-xs" />
                                        </div>
                                        <span>The user is in breach of any of the terms and conditions of this agreement and/or the terms and conditions of usage of ELK Education Consultants Pvt. Ltd;</span>
                                    </li>
                                    <li className="flex gap-2 items-start">
                                        <div className="mt-1 text-[#204066]">
                                            <FaEdit className="text-xs" />
                                        </div>
                                        <span>The user has provided wrong, inaccurate, incomplete or incorrect information;</span>
                                    </li>
                                    <li className="flex gap-2 items-start">
                                        <div className="mt-1 text-[#204066]">
                                            <FaEdit className="text-xs" />
                                        </div>
                                        <span>Your actions may cause any harm, damage or loss to the other Users or ELK Education Consultants Pvt. Ltd.</span>
                                    </li>
                                </ul>
                                <p className="mt-4">
                                    Illegal and/or unauthorized use of the service, including unauthorized framing of or linking to the ELK Education Consultants Pvt. Ltd site will be investigated, and appropriate legal action will be taken, including without limitation, civil, criminal and injunctive redress.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-[#204066] font-bold mb-2">Advertising Material</h3>
                                <p>
                                    Part of the site contains advertising/other material submitted to www.elkjournals.com by third parties. Responsibility for ensuring that material submitted for inclusion on the Site complies with applicable International and National law is exclusively on the advertisers and ELK Education Consultants Pvt. Ltd will not be responsible for any claim, error, omission or inaccuracy in advertising material. ELK Education Consultants Pvt. Ltd reserves the right to omit, suspend or change the position of any advertising material submitted for insertion. Acceptance of advertisements on the Site will be subject to ELK Education Consultants Pvt. Ltd terms and conditions which are available on request.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-[#204066] font-bold mb-2">Force Majeure</h3>
                                <p>
                                    These Terms of Service constitute the entire agreement between the parties with respect to the subject matter hereof and supersedes and replaces all prior or contemporaneous understandings or agreements, written or oral, regarding such subject matter. The clauses as above shall survive the termination or expiry of this agreement.
                                </p>
                            </div>
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

export default TermsAndConditions;