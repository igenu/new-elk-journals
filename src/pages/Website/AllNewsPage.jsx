import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaNewspaper, FaCalendarAlt, FaHashtag, FaFilter, FaTimes, FaArrowRight } from 'react-icons/fa';
import moment from 'moment';
import { newsApi } from '../../services/api';
import { encryptId } from '../../utils/idEncryption';

const ITEMS_PER_PAGE = 9;

const AllNewsPage = () => {
    const navigate = useNavigate();
    const [allNews, setAllNews] = useState([]);
    const [displayedNews, setDisplayedNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    // Filters
    const [selectedTag, setSelectedTag] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [availableTags, setAvailableTags] = useState([]);

    const observerRef = useRef();
    const lastNewsRef = useCallback((node) => {
        if (loadingMore) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                loadMoreNews();
            }
        });

        if (node) observerRef.current.observe(node);
    }, [loadingMore, hasMore]);

    useEffect(() => {
        fetchAllNews();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [selectedTag, dateFrom, dateTo, allNews]);

    const fetchAllNews = async () => {
        try {
            const response = await newsApi.getAll();
            const sortedNews = response.data.data.sort(
                (a, b) => new Date(b.news_date) - new Date(a.news_date)
            );
            setAllNews(sortedNews);

            // Extract unique tags
            const tags = new Set();
            sortedNews.forEach((item) => {
                const itemTags = parseTags(item.tags);
                itemTags.forEach((tag) => tags.add(tag));
            });
            setAvailableTags([...tags]);
        } catch (error) {
            console.error('Failed to fetch news:', error);
        } finally {
            setLoading(false);
        }
    };

    const parseTags = (tags) => {
        if (typeof tags === 'string') {
            try {
                return JSON.parse(tags);
            } catch {
                return [];
            }
        }
        return Array.isArray(tags) ? tags : [];
    };

    const getFilteredNews = () => {
        let filtered = [...allNews];

        // Filter by tag
        if (selectedTag) {
            filtered = filtered.filter((item) => {
                const itemTags = parseTags(item.tags);
                return itemTags.includes(selectedTag);
            });
        }

        // Filter by date range
        if (dateFrom) {
            filtered = filtered.filter(
                (item) => new Date(item.news_date) >= new Date(dateFrom)
            );
        }
        if (dateTo) {
            filtered = filtered.filter(
                (item) => new Date(item.news_date) <= new Date(dateTo)
            );
        }

        return filtered;
    };

    const applyFilters = () => {
        const filtered = getFilteredNews();

        // Reset pagination and display first page
        setPage(1);
        setDisplayedNews(filtered.slice(0, ITEMS_PER_PAGE));
        setHasMore(filtered.length > ITEMS_PER_PAGE);
    };

    const loadMoreNews = () => {
        setLoadingMore(true);

        setTimeout(() => {
            const filtered = getFilteredNews();

            const nextPage = page + 1;
            const startIndex = 0;
            const endIndex = nextPage * ITEMS_PER_PAGE;

            setDisplayedNews(filtered.slice(startIndex, endIndex));
            setPage(nextPage);
            setHasMore(endIndex < filtered.length);
            setLoadingMore(false);
        }, 300);
    };

    const handleNewsClick = (id) => {
        const encryptedId = encryptId(id);
        navigate(`/news/${encryptedId}`);
    };

    const clearFilters = () => {
        setSelectedTag('');
        setDateFrom('');
        setDateTo('');
    };

    const truncateText = (text, maxLength = 120) => {
        // Remove HTML tags first
        const plainText = text.replace(/<[^>]*>/g, '');
        if (plainText.length <= maxLength) return plainText;
        return plainText.substring(0, maxLength) + '...';
    };

    if (loading) {
        return (
            <section className="py-12 bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#12b48b] mx-auto"></div>
                        <p className="mt-4 text-gray-500">Loading news...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 bg-gray-50 min-h-screen font-roboto">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#204066] mb-3 flex items-center justify-center gap-3">
                        <FaNewspaper className="text-[#12b48b]" />
                        News & Updates
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Stay updated with the latest from ELK Journals
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 text-[#204066] font-medium">
                            <FaFilter />
                            <span>Filters:</span>
                        </div>

                        {/* Tag Filter */}
                        <div className="flex-1 min-w-[200px]">
                            <select
                                value={selectedTag}
                                onChange={(e) => setSelectedTag(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#12b48b] focus:border-transparent"
                            >
                                <option value="">All Tags</option>
                                {availableTags.map((tag, index) => (
                                    <option key={index} value={tag}>
                                        {tag}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date From */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">From:</span>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#12b48b] focus:border-transparent"
                            />
                        </div>

                        {/* Date To */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">To:</span>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#12b48b] focus:border-transparent"
                            />
                        </div>

                        {/* Clear Filters */}
                        {(selectedTag || dateFrom || dateTo) && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1 px-3 py-2 text-sm text-red-500 hover:text-red-700 transition-colors"
                            >
                                <FaTimes />
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* News Grid */}
                {displayedNews.length === 0 ? (
                    <div className="text-center py-12">
                        <FaNewspaper className="text-5xl text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No news found matching your filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedNews.map((item, index) => {
                            const tags = parseTags(item.tags);
                            const isLast = index === displayedNews.length - 1;

                            return (
                                <div
                                    key={item.id}
                                    ref={isLast ? lastNewsRef : null}
                                    onClick={() => handleNewsClick(item.id)}
                                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                                >
                                    <div className="p-5">
                                        {/* Date */}
                                        <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                                            <FaCalendarAlt />
                                            <span>{moment(item.news_date).format('MMMM DD, YYYY')}</span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-lg font-semibold text-[#204066] group-hover:text-[#12b48b] transition-colors mb-3 leading-tight">
                                            {item.title}
                                        </h3>

                                        {/* Tags */}
                                        {tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {tags.slice(0, 3).map((tag, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600"
                                                    >
                                                        <FaHashtag className="mr-0.5 text-[8px]" />
                                                        {tag}
                                                    </span>
                                                ))}
                                                {tags.length > 3 && (
                                                    <span className="text-xs text-gray-400">
                                                        +{tags.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Excerpt */}
                                        <p className="text-sm text-gray-500 leading-relaxed mb-4">
                                            {truncateText(item.description)}
                                        </p>

                                        {/* Read More */}
                                        <div className="flex items-center gap-1 text-sm font-medium text-[#12b48b] group-hover:text-[#0e9673] transition-colors">
                                            Read More
                                            <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Loading More Indicator */}
                {loadingMore && (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#12b48b] mx-auto"></div>
                        <p className="mt-2 text-gray-500 text-sm">Loading more...</p>
                    </div>
                )}

                {/* End of List */}
                {!hasMore && displayedNews.length > 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-400 text-sm">You've reached the end</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AllNewsPage;
