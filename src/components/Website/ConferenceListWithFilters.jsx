import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { journalApi } from '../../services/api';
import { Spin } from 'antd';
import moment from 'moment';
import { generateConferenceUrl } from '../../utils/idEncryption';
import axios from 'axios';
import { scriptUrl } from '../../services/serviceApi';
import { FaSearch, FaSyncAlt, FaCalendarAlt } from 'react-icons/fa';

const ConferenceListWithFilters = () => {
    const [allConferences, setAllConferences] = useState([]);
    const [filteredConferences, setFilteredConferences] = useState([]);
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Conferences
                const response = await axios.get(`${scriptUrl}api/conferences/template`);

                let data = [];
                if (response.data && response.data.success) {
                    if (Array.isArray(response.data.success)) {
                        data = response.data.success;
                    } else {
                        data = [response.data.success];
                    }
                }

                const today = moment().startOf('day');

                // Sort: upcoming first (ascending), then previous (descending)
                const upcoming = [];
                const previous = [];

                data.forEach((item) => {
                    const startDateStr = item.conference?.start_date;
                    if (!startDateStr) return;

                    const startDate = moment(startDateStr);
                    if (startDate.isSameOrAfter(today)) {
                        upcoming.push(item);
                    } else {
                        previous.push(item);
                    }
                });

                upcoming.sort((a, b) => moment(a.conference?.start_date || 0) - moment(b.conference?.start_date || 0));
                previous.sort((a, b) => moment(b.conference?.start_date || 0) - moment(a.conference?.start_date || 0));

                const sortedData = [...upcoming, ...previous];
                setAllConferences(sortedData);
                setFilteredConferences(sortedData);

                // Fetch Journals
                const journalResponse = await journalApi.getAll({ skipAuthRedirect: true });
                if (journalResponse.data && journalResponse.data.success) {
                    setJournals(journalResponse.data.success);
                } else if (Array.isArray(journalResponse.data)) {
                    setJournals(journalResponse.data);
                }
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Apply filters
    const applyFilters = () => {
        let filtered = [...allConferences];

        // Filter by date range
        if (fromDate) {
            const from = moment(fromDate).startOf('day');
            filtered = filtered.filter((item) => {
                const startDate = moment(item.conference?.start_date);
                return startDate.isSameOrAfter(from);
            });
        }

        if (toDate) {
            const to = moment(toDate).endOf('day');
            filtered = filtered.filter((item) => {
                const startDate = moment(item.conference?.start_date);
                return startDate.isSameOrBefore(to);
            });
        }

        // Filter by search text (conference name or organizer)
        if (searchText.trim()) {
            const search = searchText.toLowerCase().trim();
            filtered = filtered.filter((item) => {
                const name = (item.conference?.name || '').toLowerCase();
                const organizer = (item.conference?.organized_by || '').toLowerCase();
                return name.includes(search) || organizer.includes(search);
            });
        }

        setFilteredConferences(filtered);
    };

    // Reset filters
    const resetFilters = () => {
        setFromDate('');
        setToDate('');
        setSearchText('');
        setFilteredConferences(allConferences);
    };

    // Helper to get date display and label
    const getDateDisplay = (item) => {
        const startDateStr = item.conference?.start_date;
        const today = moment().startOf('day');
        const isUpcoming = moment(startDateStr).isSameOrAfter(today);
        const labelText = isUpcoming ? 'UPCOMING' : 'PREVIOUS';

        if (!startDateStr) return { dateStr: 'Date TBA', label: labelText };

        const start = moment(startDateStr);
        const dateStr = start.format('DD MMM YYYY').toUpperCase();

        return { dateStr, label: labelText };
    };

    // Render conference cards
    const renderConferenceList = (items) => {
        if (items.length === 0) {
            return (
                <div className="text-center py-20 px-6 bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl shadow-xl border-2 border-gray-200">
                    <div className="text-6xl mb-4 animate-bounce">📭</div>
                    <h2 className="text-2xl font-bold text-[#204066] mb-3">No Conferences Found</h2>
                    <p className="text-gray-600 text-lg max-w-md mx-auto mb-2">
                        No conferences match your filter criteria.
                    </p>
                    <button
                        onClick={resetFilters}
                        className="mt-4 inline-block bg-gradient-to-r from-[#12b48b] to-[#0e9673] hover:from-[#0e9673] hover:to-[#0a7857] text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        Clear Filters
                    </button>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 gap-6 mb-12">
                {items.map((item) => {
                    const { dateStr, label } = getDateDisplay(item);
                    const venueName = item?.conference?.organized_by;
                    const name = item.conference?.name || 'Conference';

                    return (
                        <Link
                            to={generateConferenceUrl(name, item?.conference_id)}
                            key={item.id}
                            className="block bg-white shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden flex flex-col md:flex-row min-h-[120px] rounded-xl border border-gray-200 hover:border-[#12b48b]/50 transform hover:scale-105"
                        >
                            {/* Left Date Box */}
                            <div className="bg-gradient-to-br from-[#5c6e91] to-[#3d4f6f] text-white flex flex-col justify-center items-center text-center w-full md:w-64 flex-shrink-0 group-hover:from-[#12b48b] group-hover:to-[#0e9673] transition-all duration-300 relative p-6 rounded-xl md:rounded-none">
                                <div className="text-sm font-bold mb-2 opacity-90 tracking-wide">{dateStr}</div>
                                <div className="text-2xl font-bold tracking-widest uppercase border-t border-white/30 pt-2 mt-2">
                                    {label}
                                </div>
                            </div>

                            {/* Right Content */}
                            <div className="p-6 flex-grow flex flex-col justify-center bg-gradient-to-r from-white to-gray-50 group-hover:from-gray-50 group-hover:to-white transition-colors duration-300">
                                <h2 className="text-xl font-bold text-[#202020] mb-2 leading-tight group-hover:text-[#12b48b] transition-colors font-sans capitalize">
                                    {name}
                                </h2>
                                <div className="flex items-center gap-2 text-sm text-[#0097a7] font-medium">
                                    <span className="text-lg">📍</span>
                                    {venueName}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        );
    };

    // Render journals (same as original)
    const renderJournalList = () => {
        if (!journals || journals.length === 0) return null;

        return (
            <div className="mt-16">
                <div className="mb-8 flex items-center gap-3">
                    <div className="h-8 w-1.5 bg-[#12b48b] rounded-full"></div>
                    <h1 className="text-2xl text-[#204066] font-bold tracking-tight">Our Journals</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {journals.map((journal) => (
                        <div
                            key={journal.id}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col h-full transform hover:-translate-y-1"
                        >
                            <div className="p-1 bg-gradient-to-r from-[#12b48b] to-[#204066] opacity-80 group-hover:opacity-100 transition-opacity"></div>
                            <div className="p-6 flex-grow flex flex-col">
                                <h3 className="text-lg font-bold text-[#204066] mb-4 line-clamp-3 group-hover:text-[#12b48b] transition-colors min-h-[3.5rem]">
                                    {journal.title}
                                </h3>

                                <div className="mt-auto space-y-3">
                                    <div className="flex items-center justify-between text-sm bg-gray-50 p-2.5 rounded-lg group-hover:bg-[#12b48b]/5 transition-colors">
                                        <span className="text-gray-500 font-medium">Print ISSN</span>
                                        <span className="text-[#204066] font-mono font-semibold">{journal.print_issn || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm bg-gray-50 p-2.5 rounded-lg group-hover:bg-[#12b48b]/5 transition-colors">
                                        <span className="text-gray-500 font-medium">E-ISSN</span>
                                        <span className="text-[#204066] font-mono font-semibold">{journal.e_issn || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96 bg-gray-50">
                <Spin size="large" tip="Loading Content..." />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Filter Section */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Title */}
                    <h2 className="text-xl font-bold text-[#12b48b] whitespace-nowrap">
                        List of Conferences
                    </h2>

                    <div className="flex flex-col md:flex-row flex-grow gap-4 md:items-center md:justify-end">
                        {/* From Date */}
                        <div className="relative">
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                placeholder="From Date"
                                className="w-full md:w-40 px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#12b48b] text-sm text-gray-700 appearance-none"
                            />
                            {!fromDate && (
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                                    From Date
                                </span>
                            )}
                        </div>

                        {/* To Date */}
                        <div className="relative">
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                placeholder="To Date"
                                className="w-full md:w-40 px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#12b48b] text-sm text-gray-700 appearance-none"
                            />
                            {!toDate && (
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                                    To Date
                                </span>
                            )}
                        </div>

                        {/* Search */}
                        <div className="flex-grow md:max-w-xs">
                            <input
                                type="text"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder="Search"
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#12b48b] text-sm text-gray-700"
                                onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                            />
                        </div>

                        {/* Search Button */}
                        <button
                            onClick={applyFilters}
                            className="bg-[#12b48b] hover:bg-[#0e9673] text-white p-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
                            title="Search"
                        >
                            <FaSearch className="text-lg" />
                        </button>

                        {/* Reset Button */}
                        <button
                            onClick={resetFilters}
                            className="bg-[#12b48b] hover:bg-[#0e9673] text-white p-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
                            title="Reset Filters"
                        >
                            <FaSyncAlt className="text-lg" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Conference List */}
            {renderConferenceList(filteredConferences)}

            {/* Journals */}
            {renderJournalList()}
        </div>
    );
};

export default ConferenceListWithFilters;
