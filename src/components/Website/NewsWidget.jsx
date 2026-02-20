import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaArrowRight, FaMapMarkerAlt } from 'react-icons/fa';
import { conferenceTemplateApi } from '../../services/api';
import { generateConferenceUrl } from '../../utils/idEncryption';
import moment from 'moment';

/**
 * NewsWidget - Now repurposed to display Upcoming Conferences
 * 
 * @param {number} limit - Number of conferences to display
 * @param {boolean} showHeader - Whether to show the header
 */
const NewsWidget = ({ limit = 5, showHeader = true }) => {
    const [conferences, setConferences] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchConferences();
    }, []);

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

            const today = moment().startOf('day');

            // Filter upcoming and sort
            const upcoming = data.filter(item => {
                const startDateStr = item.conference?.start_date;
                if (!startDateStr) return false;
                return moment(startDateStr).isSameOrAfter(today);
            }).sort((a, b) => {
                return moment(a.conference?.start_date) - moment(b.conference?.start_date);
            }).slice(0, limit);

            setConferences(upcoming);
        } catch (error) {
            console.error('Failed to fetch conferences:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConferenceClick = (name, id) => {
        navigate(generateConferenceUrl(name, id));
    };

    const truncateTitle = (title, maxLength = 60) => {
        if (!title) return "Conference";
        if (title.length <= maxLength) return title;
        return title.substring(0, maxLength) + '...';
    };

    if (loading) {
        return (
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                {showHeader && (
                    <div className="bg-[#12b48b] text-white p-3 font-bold uppercase flex items-center gap-2">
                        <FaCalendarAlt /> Upcoming Conferences
                    </div>
                )}
                <div className="p-4 text-center text-gray-500 text-sm">
                    Loading...
                </div>
            </div>
        );
    }

    if (conferences.length === 0) {
        return (
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                {showHeader && (
                    <div className="bg-[#12b48b] text-white p-3 font-bold uppercase flex items-center gap-2">
                        <FaCalendarAlt /> Upcoming Conferences
                    </div>
                )}
                <div className="p-4 text-center text-gray-500 text-sm">
                    No upcoming conferences
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            {showHeader && (
                <div className="bg-[#12b48b] text-white p-3 font-bold uppercase flex items-center gap-2">
                    <FaCalendarAlt /> Upcoming Conferences
                </div>
            )}
            <div className="divide-y divide-gray-100">
                {conferences.map((item) => {
                    const name = item.conference?.name;
                    // Parse venue if needed (assuming logic from ConferenceList)
                    let venueName = item.conference?.organized_by;
                    try {
                        const venueObj = JSON.parse(item.venue);
                        if (venueObj?.name) venueName = venueObj.name;
                    } catch (e) {
                        // ignore
                    }

                    return (
                        <div
                            key={item.id}
                            onClick={() => handleConferenceClick(name, item.conference_id)}
                            className="p-3 hover:bg-gray-50 cursor-pointer transition-colors group"
                        >
                            <h4 className="text-sm font-medium text-[#204066] group-hover:text-[#12b48b] transition-colors leading-tight mb-1">
                                {truncateTitle(name)}
                            </h4>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <FaCalendarAlt className="text-[10px] text-[#12b48b]" />
                                    <span>{moment(item.conference?.start_date).format('MMM DD, YYYY')}</span>
                                </div>
                                {venueName && (
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                        <FaMapMarkerAlt className="text-[10px]" />
                                        <span className="truncate max-w-[200px]">{venueName}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="p-3 border-t border-gray-200 bg-gray-50">
                <Link
                    to="/conferences"
                    className="flex items-center justify-center gap-2 text-sm font-medium text-[#12b48b] hover:text-[#0e9673] transition-colors"
                >
                    See All Conferences
                    <FaArrowRight className="text-xs" />
                </Link>
            </div>
        </div>
    );
};

export default NewsWidget;
