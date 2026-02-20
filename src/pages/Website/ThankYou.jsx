import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaHome } from 'react-icons/fa';

const ThankYou = () => {

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center py-16 px-4 bg-gray-50">
            <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-lg w-full transform transition-all hover:scale-[1.01]">
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                        <FaCheckCircle className="text-[#12b48b] text-5xl" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h1>

                <p className="text-gray-600 mb-8 text-lg leading-relaxed text-center">
                    Your application has been successfully submitted.
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-[#12b48b] text-white px-8 py-3 rounded-full font-semibold shadow-md hover:bg-[#0e9f7a] transition-all hover:shadow-lg transform hover:-translate-y-1"
                >
                    <FaHome /> Back to Home
                </Link>
            </div>
        </div>
    );
};

export default ThankYou;
