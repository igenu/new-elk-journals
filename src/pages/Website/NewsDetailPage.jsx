import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaHashtag, FaNewspaper } from 'react-icons/fa';
import moment from 'moment';
import DOMPurify from 'dompurify';
import { newsApi } from '../../services/api';
import { decryptId } from '../../utils/idEncryption';

const NewsDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const decryptedId = decryptId(id);
        if (decryptedId) {
            fetchNewsDetails(decryptedId);
        } else {
            setError('Invalid news link');
            setLoading(false);
        }
    }, [id]);

    const fetchNewsDetails = async (newsId) => {
        try {
            const response = await newsApi.getById(newsId);
            setNews(response.data.data);
        } catch (error) {
            console.error('Failed to fetch news details:', error);
            setError('Failed to load news');
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#12b48b] mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading article...</p>
                </div>
            </div>
        );
    }

    if (error || !news) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error || 'News not found'}</p>
                    <button
                        onClick={() => navigate('/news')}
                        className="text-[#12b48b] hover:underline"
                    >
                        View All News
                    </button>
                </div>
            </div>
        );
    }

    const tags = parseTags(news.tags);

    return (
        <section className="py-12 bg-gray-50 font-roboto min-h-screen">
            <div className="container mx-auto px-4">
                {/* Navigation Bar */}
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-[#204066] hover:text-[#12b48b] transition-colors font-medium"
                    >
                        <FaArrowLeft />
                        Back
                    </button>
                    <Link
                        to="/news"
                        className="flex items-center gap-2 text-[#12b48b] hover:text-[#0e9673] transition-colors font-medium"
                    >
                        <FaNewspaper />
                        View All News
                    </Link>
                </div>

                {/* Article Card */}
                <article className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="px-6 py-8 md:px-10 md:py-10 border-b border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                            <FaCalendarAlt className="text-[#12b48b]" />
                            <span>{moment(news.news_date).format('MMMM DD, YYYY')}</span>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold text-[#204066] leading-tight mb-4">
                            {news.title}
                        </h1>

                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#12b48b]/10 text-[#12b48b]"
                                    >
                                        <FaHashtag className="mr-1 text-[10px]" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="px-6 py-8 md:px-10">
                        <div
                            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.description) }}
                        />
                    </div>
                </article>
            </div>
        </section>
    );
};

export default NewsDetailPage;
