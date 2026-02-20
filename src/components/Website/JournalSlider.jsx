import React from 'react';
import SliderImage from "../../assets/images/jm-eapjmrm.jpg";
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { getSubmitManuscriptUrl } from '../../utils/navigationHelpers';

const JournalSlider = ({ journalData }) => {
    return (
        <section className="slider relative w-full font-roboto">
            <div className="relative w-full">
                <img
                    src={SliderImage}
                    className="w-full h-full object-cover"
                    alt="ELK Asia Pacific Journals"
                />

                {/* Overlay Box */}
                <div className="absolute !top-1/4 !left-1/2 !transform !-translate-x-1/2 !-translate-y-1/2 w-[90%] md:w-[85%] lg:w-[80%] !bg-black/85 rounded-lg !p-6 md: text-center " style={{ marginTop: "4rem" }}>
                    <div className="heading text-white text-xl md:text-3xl font-normal  leading-tight mb-5">
                        {journalData?.title}
                    </div>



                    <div className="flex flex-col md:flex-row justify-center gap-6">
                        <Link
                            to={getSubmitManuscriptUrl()}
                            style={{ background: 'linear-gradient(to bottom, #08c495 0%, #00644b 100%)' }}
                            className="text-white hover:!text-white text-sm md:text-base font-bold py-3 px-8 rounded-full uppercase inline-flex items-center justify-center gap-2 transition-colors duration-300 btn jrnl-btn hover:opacity-90"
                        >
                            Submit Your Manuscript <FaArrowRight />
                        </Link>
                        <Link
                            to="/authors-guidelines"
                            style={{ background: 'linear-gradient(to bottom, #08c495 0%, #00644b 100%)' }}
                            className="text-white hover:!text-white text-sm md:text-base font-bold py-3 px-8 rounded-full uppercase inline-flex items-center justify-center gap-2 transition-colors duration-300 btn jrnl-btn hover:opacity-90"
                        >
                            Author's Guidelines <FaArrowRight />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default JournalSlider;