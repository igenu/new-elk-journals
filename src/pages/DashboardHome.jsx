import { useState, useEffect } from 'react';
import { getRole } from '../utils/secureStorage';
import { conferenceTemplateApi } from '../services/api';
import { Link } from 'react-router-dom';
import { generateConferenceUrl } from '../utils/idEncryption';
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowRight, FaUsers, FaFileAlt, FaClock } from 'react-icons/fa';
import moment from 'moment';
import { Spin } from 'antd';

const DashboardHome = () => {
    const user = localStorage.getItem('user');
    const parseUser = JSON.parse(user);
    const role = getRole();
    const displayRole = role.charAt(0).toUpperCase() + role.slice(1);

    const [conferences, setConferences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConferences = async () => {
            try {
                const response = await conferenceTemplateApi.getAll();
                let data = [];
                if (response.data && response.data.success) {
                    if (Array.isArray(response.data.success)) {
                        data = response.data.success;
                    } else {
                        data = [response.data.success];
                    }
                }
                const allConferences = data.sort((a, b) => {
                    return moment(b.conference?.start_date) - moment(a.conference?.start_date);
                });
                setConferences(allConferences);
            } catch (error) {
                console.error('Failed to fetch conferences:', error);
            } finally {
                setLoading(false);
            }
        };

        if (role === 'author') {
            fetchConferences();
        } else {
            setLoading(false);
        }
    }, [role]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const upcomingConferences = conferences.filter(c =>
        moment(c.conference?.start_date).isAfter(moment())
    );

    return (
        <div className="space-y-8">
            {/* Welcome Hero Section */}
            <div className="bg-gradient-to-r from-[#204066] via-[#2c4a6e] to-[#204066] rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <p className="text-[#8ba4c4] text-sm font-medium mb-1">{getGreeting()}</p>
                            <h1 className="text-3xl font-bold mb-2">
                                Welcome back, {parseUser?.firstName || displayRole}!
                            </h1>
                            <p className="text-[#b8c9dc] text-sm max-w-lg">
                                {role === 'author'
                                    ? 'Manage your submissions and explore upcoming conferences from your personalized dashboard.'
                                    : `Access your ${role} tools and manage your workspace efficiently.`
                                }
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#8ba4c4]">
                            <FaClock />
                            <span>{moment().format('dddd, MMMM D, YYYY')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {role === 'author' && (
                <>
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#12b48b]/10 to-[#12b48b]/5 flex items-center justify-center">
                                    <FaCalendarAlt className="text-[#12b48b] text-xl" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-[#204066]">{conferences.length}</p>
                                    <p className="text-sm text-gray-500">Total Conferences</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#204066]/10 to-[#204066]/5 flex items-center justify-center">
                                    <FaClock className="text-[#204066] text-xl" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-[#204066]">{upcomingConferences.length}</p>
                                    <p className="text-sm text-gray-500">Upcoming Events</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#45cbb2]/10 to-[#45cbb2]/5 flex items-center justify-center">
                                    <FaFileAlt className="text-[#45cbb2] text-xl" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-[#204066]">Active</p>
                                    <p className="text-sm text-gray-500">Account Status</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Conferences Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Section Header */}
                        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#204066] to-[#2c4a6e] flex items-center justify-center">
                                        <FaCalendarAlt className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-[#204066]">All Conferences</h2>
                                        <p className="text-xs text-gray-500">Browse and explore available conferences</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <FaUsers className="text-[#12b48b]" />
                                    <span>{conferences.length} conferences available</span>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <Spin size="large" />
                                    <p className="mt-4 text-gray-500 text-sm">Loading conferences...</p>
                                </div>
                            ) : conferences.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {conferences.map((item) => {
                                        const name = item.conference?.name;
                                        const startDate = moment(item.conference?.start_date);
                                        const date = startDate.format('MMM DD, YYYY');
                                        const isUpcoming = startDate.isAfter(moment());
                                        let venueName = item.conference?.organized_by;
                                        try {
                                            const venueObj = JSON.parse(item.venue);
                                            if (venueObj?.name) venueName = venueObj.name;
                                        } catch (e) { }

                                        return (
                                            <div
                                                key={item.id}
                                                className="group bg-white border-2 border-gray-100 rounded-xl hover:border-[#12b48b]/30 hover:shadow-lg hover:shadow-[#12b48b]/5 transition-all duration-300 overflow-hidden flex flex-col"
                                            >
                                                {/* Card Header */}
                                                <div className="bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] px-5 py-3 border-b border-gray-100">
                                                    <div className="flex items-center justify-between">
                                                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${isUpcoming
                                                                ? 'bg-[#12b48b]/10 text-[#12b48b]'
                                                                : 'bg-gray-100 text-gray-500'
                                                            }`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${isUpcoming ? 'bg-[#12b48b]' : 'bg-gray-400'}`}></span>
                                                            {isUpcoming ? 'Upcoming' : 'Past'}
                                                        </span>
                                                        <span className="text-xs text-gray-400">{startDate.fromNow()}</span>
                                                    </div>
                                                </div>

                                                {/* Card Body */}
                                                <div className="p-5 flex-grow">
                                                    <h3 className="font-bold text-[#204066] mb-3 line-clamp-2 group-hover:text-[#12b48b] transition-colors leading-snug">
                                                        {name}
                                                    </h3>
                                                    <div className="space-y-2.5">
                                                        <div className="flex items-center gap-2.5 text-sm text-gray-600">
                                                            <div className="w-8 h-8 rounded-lg bg-[#12b48b]/10 flex items-center justify-center flex-shrink-0">
                                                                <FaCalendarAlt className="text-[#12b48b] text-xs" />
                                                            </div>
                                                            <span className="font-medium">{date}</span>
                                                        </div>
                                                        {venueName && (
                                                            <div className="flex items-center gap-2.5 text-sm text-gray-600">
                                                                <div className="w-8 h-8 rounded-lg bg-[#204066]/10 flex items-center justify-center flex-shrink-0">
                                                                    <FaMapMarkerAlt className="text-[#204066] text-xs" />
                                                                </div>
                                                                <span className="truncate">{venueName}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Card Footer */}
                                                <div className="px-5 pb-5">
                                                    <Link
                                                        to={generateConferenceUrl(name, item.conference_id)}
                                                        className="flex items-center justify-center gap-2 w-full py-3
bg-gradient-to-r from-[#204066] to-[#2c4a6e]
hover:from-[#12b48b] hover:to-[#0e9470]
text-white hover:text-white
rounded-xl transition-all duration-300
font-semibold text-sm shadow-sm hover:shadow-md
"
                                                    >
                                                        View Details
                                                        <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 px-4">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mb-4">
                                        <FaCalendarAlt className="text-3xl text-gray-300" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Conferences Available</h3>
                                    <p className="text-gray-500 text-sm text-center max-w-md">
                                        There are no conferences available at the moment. Please check back later for updates.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Non-author welcome section */}
            {role !== 'author' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#204066] to-[#2c4a6e] flex items-center justify-center mb-4 shadow-lg">
                            <FaUsers className="text-3xl text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-[#204066] mb-2 capitalize">{role} Dashboard</h2>
                        <p className="text-gray-500 text-center max-w-md">
                            Welcome to your dashboard. Use the sidebar navigation to access your tools and manage your workspace.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardHome;
