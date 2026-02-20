import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookSquare, FaLinkedin } from 'react-icons/fa';
import Image from "../../assets/images/cc1.png";

const Footer = () => {
    return (
        <footer>
            <div className="container">
                <div className="flex flex-col md:flex-row justify-between items-center py-4">
                    <div className="w-full md:w-9/12 mb-4 md:mb-0">
                        <ul className="flex flex-wrap justify-center md:justify-start items-center">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about-us">About Us</Link></li>
                            <li><Link to="/scholarships">Scholarship</Link></li>
                            <li><a href="docs/copyrights.pdf" target="_blank" rel="noopener noreferrer">Copyrights</a></li>
                            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                            <li><Link to="/terms-and-conditions">Terms and Conditions</Link></li>
                            <li><Link to="/sitemap">Sitemap</Link></li>
                            {/* <li><a href="blog" target="_blank" rel="noopener noreferrer">Blog</a></li> */}
                            <li><Link to="/contact-us">Contact Us</Link></li>
                        </ul>
                    </div>
                    <div className="w-full md:w-3/12 flex justify-center md:justify-end">
                        {/* <ul className="flex items-center gap-4">
                            <li className="!border-0 !p-0">
                                <a href="https://www.facebook.com/impactfactorjournal" target="_blank" rel="noopener noreferrer" className="text-2xl">
                                    <FaFacebookSquare />
                                </a>
                            </li>
                            <li className="!border-0 !p-0">
                                <a href="#" target="_blank" rel="noopener noreferrer" className="text-2xl">
                                    <FaLinkedin />
                                </a>
                            </li>
                        </ul> */}
                    </div>
                </div>
            </div>

            <section className="creative-comms py-4">
                <div className="container">
                    <div className="flex flex-col items-center text-center">
                        <img src={Image} alt="elkjournals" className="mb-2" />
                        <p className="mb-0">
                            All journal articles are published under the terms of the <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Creative Commons Attribution 4.0 International License</a>
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mt-4">
                <div className="flex flex-col md:flex-row footer justify-between items-center">
                    <div className="footer-b w-full md:w-1/2 text-center md:text-left">
                        <p>&copy; ELK-APJ 2026. All Rights Reserved.</p>
                    </div>

                    <div className="footer-c w-full md:w-1/2 text-center md:text-right">
                        <p>Website Designed by: <a href="https://www.360websitedesign.in/" target="_blank" rel="noopener noreferrer">360WebsiteDesign</a></p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
