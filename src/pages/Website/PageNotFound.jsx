import React from 'react';
import { Link } from 'react-router-dom';
import { FaAngleDoubleLeft } from 'react-icons/fa';
import Image404 from "../../assets/images/404.jpg";

const PageNotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 bg-white font-roboto">
            <div className="text-center">
                <h4 className="text-3xl font-medium text-[#1ABC9C] inline-block relative pb-2 mb-8">
                    Page Not Found
                    <span className="absolute bottom-0 left-0 w-1/4 h-[3px] bg-[#1ABC9C]"></span>
                </h4>

                <div className="flex justify-center mb-8">
                    <img
                        src={Image404}
                        alt="404 Page Not Found"
                        className="max-w-[500px] w-full h-auto object-contain"
                    />
                </div>

                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-[#333333] hover:bg-black text-white text-sm font-medium py-2 px-6 rounded transition-colors duration-300"
                >
                    <FaAngleDoubleLeft /> Back To Home
                </Link>
            </div>
        </div>
    );
};

export default PageNotFound;