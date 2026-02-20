
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { journalCategoryApi } from '../../services/api';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await journalCategoryApi.getWithJournals();
                // Check if response is an array (based on user request example)
                const data = Array.isArray(response.data) ? response.data : response;

                // Flatten the structure: Category -> Journals to flat list of Journals with Category route
                const flattenedServices = [];
                if (Array.isArray(data)) {
                    data.forEach(category => {
                        if (category.journals && category.journals.length > 0) {
                            category.journals.forEach(journal => {
                                flattenedServices.push({
                                    id: journal.id, // Use journal ID for key if unique, or combination
                                    link: `/journals/${category.route}`,
                                    issnPrint: journal.print_issn,
                                    issnOnline: journal.e_issn,
                                    title: journal.title
                                });
                            });
                        }
                    });
                }
                setServices(flattenedServices);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching services:", err);
                setError("Failed to load services.");
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    if (loading) {
        return (
            <section className="bg-white py-6">
                <div className="w-full max-w-[1164px] mx-auto px-4 text-center">
                    <div>Loading...</div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="bg-white py-6">
                <div className="w-full max-w-[1164px] mx-auto px-4 text-center text-red-500">
                    <div>{error}</div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white py-6">
            <div className="w-full max-w-[1164px] mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services?.length > 0 && services?.map((service, index) => (
                        <Link
                            to={service.link}
                            key={index}
                            className="bg-[#333] hover:bg-[#333] transition-colors duration-300 p-2 flex items-center group shadow-sm"
                        >
                            <div className="w-1/3 border-r border-gray-500  text-center">
                                <div className="text-xs text-white mb-1">ISSN PRINT</div>
                                <div className="text-xs  text-[#12b48b] font-medium mb-1">{service.issnPrint}</div>
                                <div className="text-xs text-white mb-1">ISSN ONLINE</div>
                                <div className="text-xs text-[#12b48b] font-medium">{service.issnOnline}</div>
                            </div>
                            <div className="w-2/3 pl-4">
                                <h5 className="text-white text-base md:text-sm font-normal leading-snug">
                                    {service.title}
                                </h5>
                            </div>
                        </Link>
                    ))}
                </div>
            </div >
        </section >
    );
};

export default Services;