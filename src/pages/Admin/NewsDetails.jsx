import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spin, message, Tag, Divider, Tooltip } from 'antd';
import { FaArrowLeft, FaCalendarDay, FaHashtag, FaRegClock, FaShareAlt } from 'react-icons/fa';
import moment from 'moment';
import DOMPurify from 'dompurify';
import { newsApi } from '../../services/api';
import { decryptId } from '../../utils/idEncryption';

const NewsDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const decryptedId = decryptId(id);
        if (decryptedId) {
            fetchNewsDetails(decryptedId);
        } else {
            message.error("Invalid News Link");
            navigate('/dashboard/manage-news');
        }
    }, [id]);

    const fetchNewsDetails = async (newsId) => {
        try {
            const response = await newsApi.getById(newsId);
            setNews(response.data.data);
        } catch (error) {
            console.error("Failed to fetch news details", error);
            message.error("Failed to load news details");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Spin size="large" tip="Loading Story..." />
            </div>
        );
    }

    if (!news) return null;

    let tags = [];
    if (typeof news.tags === 'string') {
        try {
            tags = JSON.parse(news.tags);
        } catch (e) {
            tags = [];
        }
    } else if (Array.isArray(news.tags)) {
        tags = news.tags;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-full">
                {/* Navigation Bar */}
                <div className="flex justify-between items-center mb-8">
                    <Button
                        type="text"
                        icon={<FaArrowLeft className="text-gray-500 group-hover:text-gray-900 transition-colors" />}
                        onClick={() => navigate('/dashboard/manage-news')}
                        className="group flex items-center text-gray-500 hover:text-gray-900 hover:bg-transparent px-0 font-medium text-lg transition-colors"
                    >
                        Back
                    </Button>
                    {/* <div className="flex gap-2">
                        {/* Placeholder for future actions */}
                    {/* <Tooltip title="Share this news (Coming Soon)">
                            <Button shape="circle" icon={<FaShareAlt />} className="text-gray-400 border-gray-200" />
                        </Tooltip>
                    </div> */}
                </div>

                <article className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header Section */}
                    <div className="px-8 pt-10 pb-6 md:px-12 md:pt-14">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 font-medium mb-4 uppercase tracking-wider">
                            <span className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                                <FaCalendarDay />
                                {news.news_date ? moment(news.news_date).format('MMMM DD, YYYY') : 'Date N/A'}
                            </span>
                            {news.createdAt && (
                                <span className="flex items-center gap-2">
                                    <FaRegClock />
                                    Posted {moment(news.createdAt).fromNow()}
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                            {news.title}
                        </h1>

                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {tags.map((tag, index) => (
                                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                        <FaHashtag className="mr-1 text-gray-400 text-xs" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <Divider className="my-0 border-gray-100" />

                    {/* Content Section */}
                    <div className="px-8 py-8 md:px-12 md:py-12">
                        <div
                            className="prose prose-lg prose-slate max-w-none text-gray-600 selection:bg-indigo-100 selection:text-indigo-900"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.description) }}
                        />
                    </div>
                </article>


            </div>
        </div>
    );
};

export default NewsDetails;
