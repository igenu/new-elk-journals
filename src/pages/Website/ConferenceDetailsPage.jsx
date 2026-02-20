import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Spin, Tabs, Card, Row, Col, Typography, Button, Divider, Tag, Space, Alert, Modal, Form, Upload, message } from 'antd';
import {
    CalendarOutlined,
    EnvironmentOutlined,
    ShareAltOutlined,
    UserOutlined,
    MailOutlined,
    GlobalOutlined,
    ArrowRightOutlined,
    InfoCircleOutlined,
    TeamOutlined,
    FileTextOutlined,
    SafetyCertificateOutlined,
    ScheduleOutlined,
    TrophyOutlined,
    FieldTimeOutlined,
    LeftOutlined,
    RightOutlined,
    CheckCircleFilled,
    HistoryOutlined,
    BankOutlined,
    UploadOutlined
} from '@ant-design/icons';
import { Carousel } from 'antd'; // Added for Keynote Speakers
import { conferenceTemplateApi, conferenceApi, abstractSubmissionApi, journalApi } from '../../services/api'; // Ensure this path is correct based on original file
import { ImageURl } from '../../services/serviceApi'; // Ensure this path is correct
import DOMPurify from 'dompurify';
import Logo from "../../assets/images/elk-logo.png"; // check relative path
import { decryptId } from '../../utils/idEncryption';
import { getRole } from '../../utils/secureStorage';
import ConferenceRegistrationModal from '../../components/Website/ConferenceRegistrationModal';
import SubmitAbstractModal from '../../components/Website/SubmitAbstractModal';
import Swal from 'sweetalert2';

const { Title, Text, Paragraph } = Typography;

const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => {
    // Filter out slick-prev to prevent default pseudo-element arrow
    const filteredClassName = (props.className || "").replace("slick-prev", "").trim();

    return (
        <div
            {...props}
            className={
                "slick-arrow !bg-[#204066] !h-10 !w-10 !flex !items-center !justify-center !rounded-full !left-[-25px] !absolute !top-1/2 !translate-y-[-50%] !z-10 hover:!bg-[#0b1c2e] custom-slick-arrow-left " +
                filteredClassName
            }
            aria-hidden="true"
            aria-disabled={currentSlide === 0 ? true : false}
            type="button"
        >
            <LeftOutlined className="text-white text-lg" />
        </div>
    );
};

const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => {
    // Filter out slick-next to prevent default pseudo-element arrow
    const filteredClassName = (props.className || "").replace("slick-next", "").trim();

    return (
        <div
            {...props}
            className={
                "slick-arrow !bg-[#204066] !h-10 !w-10 !flex !items-center !justify-center !rounded-full !right-[-25px] !absolute !top-1/2 !translate-y-[-50%] !z-10 hover:!bg-[#0b1c2e] custom-slick-arrow-right " +
                filteredClassName
            }
            aria-hidden="true"
            aria-disabled={currentSlide === slideCount - 1 ? true : false}
            type="button"
        >
            <RightOutlined className="text-white text-lg" />
        </div>
    );
};

const ConferenceDetailsPage = () => {
    const { encryptedId } = useParams();
    const navigate = useNavigate();
    const [conferenceData, setConferenceData] = useState(null);
    const [journal, setJournal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
    const [isAbstractModalOpen, setIsAbstractModalOpen] = useState(false);
    const [submittingAbstract, setSubmittingAbstract] = useState(false);
    const [error, setError] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);

    const id = decryptId(encryptedId);

    // Check for logged-in user
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                setLoggedInUser(user);
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
    }, []);

    useEffect(() => {
        const fetchDetails = async () => {
            // Mock Data structure logic removed as per request to use real API flow, but keeping the fetch logic.
            if (!id) {
                setError('Invalid conference URL');
                setLoading(false);
                return;
            }
            try {
                const response = await conferenceTemplateApi.getById(id);
                if (response.data && response.data.success) {
                    const confData = response.data.success;
                    setConferenceData(confData);

                    // Fetch journal details if journal_id exists
                    if (confData.conference?.journal_id) {
                        try {
                            const journalResponse = await journalApi.getById(confData.conference.journal_id);
                            if (journalResponse.data && journalResponse.data.success) {
                                setJournal(journalResponse.data.success);
                            }
                        } catch (journalErr) {
                            console.error('Error fetching journal:', journalErr);
                        }
                    }
                } else {
                    setError('Failed to load conference details.');
                }
            } catch (err) {
                console.error(err);
                setError('An error occurred while fetching details.');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) return <div className="flex justify-center items-center h-screen"><Spin size="large" /></div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    if (!conferenceData) return null;

    const {
        conference,
        description,
        organizing_committee,
        important_dates,
        key_benefits,
        who_should_join,
        organizer_image,
        organizer_logo,
        partner_image,
        conference_objectives,
        program_schedule,
        themes,
        keynote_speakers,
        venue,
        venue_image,
        past_conferences,
        organisers,
        steering_committee,
        review_board,
        call_for_papers,
        guidelines,
    } = conferenceData;

    // Helper to safely parse JSON strings from the API response
    const parseJSON = (data, fallback = null) => {
        try {
            if (typeof data === 'object' && data !== null) return data;
            return typeof data === 'string' ? JSON.parse(data) : data;
        } catch (e) {
            console.error("JSON Parse Error", e);
            return fallback;
        }
    };

    const parsedImportantDates = parseJSON(important_dates, {});
    const parsedKeyBenefits = parseJSON(key_benefits, []);
    const parsedVenue = parseJSON(venue, {});
    const parsedKeynoteSpeakers = parseJSON(keynote_speakers, []);

    // Note: User asked to render "all these details", so I should try to render steering/review if they have content. 
    const parsedSteeringCommittee = parseJSON(steering_committee, []);
    const parsedReviewBoard = parseJSON(review_board, []);
    const parsedPastConferences = parseJSON(past_conferences, []);


    const createMarkup = (html) => ({ __html: DOMPurify.sanitize(html) });
    const formattedDate = conference?.start_date ? new Date(conference.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Date TBA';

    // Helper component for content sections
    const ContentSection = ({ title, content, icon }) => {
        if (!content || content === 'null' || content === 'undefined') return null;
        return (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8" id={title.toLowerCase().replace(/\s/g, '-')}>
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                    {icon && <div className="text-blue-600 text-2xl">{icon}</div>}
                    <h3 className="text-xl font-bold text-gray-800 m-0">{title}</h3>
                </div>
                <div className="text-gray-600 leading-relaxed ql-editor">
                    <div dangerouslySetInnerHTML={createMarkup(content)} />
                </div>
            </div>
        );
    };

    const importantDateKeys = Object.keys(parsedImportantDates);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* 1. Header Section */}
            <header className="bg-gradient-to-r from-[#0b1c2e] to-[#204066] shadow-lg sticky top-0 z-50 border-b border-white/5 backdrop-blur-sm bg-opacity-95">
                <div className="container mx-auto px-4">
                    {/* Top Row - Logo and ELK Logo */}
                    <div className="h-auto lg:h-16 py-3 lg:py-0 flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-8">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
                            {organizer_logo ? (
                                <img src={`${ImageURl}${organizer_logo}`} alt="Conference Logo" className="h-10 md:h-12 object-contain bg-white rounded px-2 py-1 shadow-sm group-hover:scale-105 transition-transform duration-300" />
                            ) : (
                                <span className="text-xl font-bold text-white tracking-wide">{conference?.name}</span>
                            )}
                        </Link>

                        {/* Navigation Menu - Desktop */}
                        <nav className="hidden xl:flex flex-nowrap justify-center items-center gap-8">
                            {[
                                { label: 'About', href: '#about-the-conference' },
                                { label: 'Call for Papers', href: '#call-for-papers' },
                                { label: 'Guidelines', href: '#submission-guidelines' },
                                { label: 'Committee', href: '#committee' },
                                { label: 'Speakers', href: '#keynote-speakers' },
                                { label: 'Benefits', href: '#key-benefits' },
                                { label: 'Venue', href: '#venue' },
                            ].map((item, idx) => (
                                <a
                                    key={idx}
                                    href={item.href}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const element = document.querySelector(item.href);
                                        if (element) {
                                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }
                                    }}
                                    className="relative py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300 group"
                                >
                                    {item.label}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                                </a>
                            ))}
                        </nav>

                        <div className="flex items-center gap-3">
                            <Link to="/">
                                <img src={Logo} alt="ELK Logo" className="h-8" />
                            </Link>
                        </div>
                    </div>

                    {/* Navigation Menu - Mobile/Tablet */}
                    <nav className="xl:hidden flex flex-wrap justify-center items-center gap-x-6 gap-y-2 pb-4">
                        {[
                            { label: 'About', href: '#about-the-conference' },
                            { label: 'Papers', href: '#call-for-papers' },
                            { label: 'Committee', href: '#committee' },
                            { label: 'Speakers', href: '#keynote-speakers' },
                            { label: 'Venue', href: '#venue' },
                        ].map((item, idx) => (
                            <a
                                key={idx}
                                href={item.href}
                                onClick={(e) => {
                                    e.preventDefault();
                                    const element = document.querySelector(item.href);
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                }}
                                className="text-xs font-medium text-gray-300 hover:text-white transition-colors duration-300"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>
                </div>
            </header>

            {/* 2. Hero Section */}
            <div className="relative bg-[#0b1c2e] text-white py-12 lg:py-20 overflow-hidden">
                {/* Dynamic Background or Fallback */}
                <div className="absolute inset-0 bg-cover bg-center opacity-10"
                    style={{ backgroundImage: venue_image ? `url(${ImageURl}${venue_image})` : `url('https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2070&auto=format&fit=crop')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0b1c2e] via-[#0b1c2e]/90 to-transparent" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                        <div className="w-full">
                            {/* Breadcrumbs and Welcome Message Row */}
                            <div className="flex items-center justify-between mb-4">
                                {/* Breadcrumbs */}
                                <div className="flex items-center gap-2 text-orange-400 text-sm">
                                    <Link to="/" className="hover:underline">Home</Link>
                                    <span>&gt;</span>
                                    {journal && (
                                        <>
                                            <span className="truncate max-w-md">{journal.journal_name}</span>
                                            <span>&gt;</span>
                                        </>
                                    )}
                                    <span className="truncate max-w-md">{conference?.name}</span>
                                </div>

                                {/* Welcome Message for Logged-in Users - Simple Text */}
                                {loggedInUser && (loggedInUser.firstName || loggedInUser.username) && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <UserOutlined className="text-orange-400" />
                                        <span className="text-gray-300">Welcome,</span>
                                        <span className="text-white font-medium">{loggedInUser.firstName || loggedInUser.username}</span>
                                    </div>
                                )}
                            </div>

                            {/* Organized By Badge */}
                            {conference?.organized_by && (
                                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 mb-4">
                                    <span className="text-gray-300 text-xs font-bold uppercase tracking-wider">Organized by</span>
                                    <span className="text-white text-sm font-semibold">{conference?.organized_by}</span>
                                </div>
                            )}
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6">
                                {conference?.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-gray-300 mb-8">
                                <div className="flex items-center gap-2">
                                    <CalendarOutlined className="text-lg" />
                                    <span className="font-medium text-white">{formattedDate}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <EnvironmentOutlined className="text-lg" />
                                    <span className="font-medium text-white">{parsedVenue?.name || conference?.city || 'Venue TBA'}</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4 mt-6">
                                {/* <Button
                                    type="primary"
                                    size="large"
                                    className="bg-[#204066] hover:bg-[#0b1c2e] border-none px-8 h-12 text-lg font-semibold rounded-md flex items-center gap-2"
                                    onClick={() => setIsRegistrationModalOpen(true)}
                                >
                                    Register Now <ArrowRightOutlined />
                                </Button> */}

                                {/* Submit Abstract Button for Logged-in Users */}
                                {localStorage.getItem('token') && getRole() === 'author' && (
                                    <Button
                                        type="default"
                                        size="large"
                                        className="border-2 border-white text-white hover:bg-white hover:text-[#0b1c2e] bg-transparent px-8 h-12 text-lg font-semibold rounded-md flex items-center gap-2 transition-all"
                                        onClick={() => setIsAbstractModalOpen(true)}
                                    >
                                        Submit Abstract <FileTextOutlined />
                                    </Button>
                                )}
                            </div>
                        </div >
                    </div >
                </div >
            </div >

            <SubmitAbstractModal
                isOpen={isAbstractModalOpen}
                onClose={() => setIsAbstractModalOpen(false)}
                conferenceId={conference?.id}
            />

            {/* 3. Main Content Layout */}








            < div className="container mx-auto px-4 py-12" >
                <Row gutter={[32, 32]}>
                    <Col xs={24} lg={16}>
                        {/* About the Conference - Enhanced */}
                        {description && (
                            <div id="about-the-conference" className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
                                {/* Header with gradient */}
                                <div className="bg-gradient-to-r from-[#0b1c2e] via-[#204066] to-[#0b1c2e] p-6 relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/4"></div>
                                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/4"></div>
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                                <InfoCircleOutlined className="text-white text-xl" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white m-0">About the Conference</h3>
                                        </div>
                                        <p className="text-blue-100 text-sm m-0">Learn more about what makes this conference unique</p>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 lg:p-8">
                                    <div
                                        dangerouslySetInnerHTML={createMarkup(description)}
                                        className="text-gray-600 leading-relaxed text-base ql-editor [&>p]:mb-4"
                                    />
                                </div>
                            </div>
                        )}




                        {/* Call For Papers - Enhanced */}
                        {call_for_papers && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden" id="call-for-papers">
                                {/* Header with gradient */}
                                <div className="bg-gradient-to-r from-[#0b1c2e] via-[#204066] to-[#0b1c2e] p-6 relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/4"></div>
                                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/4"></div>
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                                <ShareAltOutlined className="text-white text-xl" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white m-0">Call for Papers</h3>
                                        </div>
                                        <p className="text-gray-300 text-sm m-0">Submit your research work</p>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 lg:p-8">
                                    <div
                                        dangerouslySetInnerHTML={createMarkup(call_for_papers)}
                                        className="text-gray-600 leading-relaxed ql-editor
                                        [&>ul]:space-y-2 [&>ul]:list-none [&>ul]:p-0 [&>ul]:m-0
                                        [&>ul>li]:bg-gray-50 [&>ul>li]:p-4 [&>ul>li]:rounded-xl [&>ul>li]:border [&>ul>li]:border-gray-100
                                        [&>ul>li]:hover:bg-white [&>ul>li]:hover:border-[#204066]/30 [&>ul>li]:hover:shadow-md [&>ul>li]:transition-all
                                        [&>ol]:space-y-2 [&>ol]:list-none [&>ol]:p-0 [&>ol]:m-0
                                        [&>ol>li]:bg-gray-50 [&>ol>li]:p-4 [&>ol>li]:rounded-xl [&>ol>li]:border [&>ol>li]:border-gray-100
                                        [&>ol>li]:hover:bg-white [&>ol>li]:hover:border-[#204066]/30 [&>ol>li]:hover:shadow-md [&>ol>li]:transition-all
                                        [&_strong]:text-[#0b1c2e] [&_strong]:font-bold
                                        [&>p]:mb-4"
                                    />
                                </div>
                            </div>
                        )}



                        {/* Who Should Join - Enhanced */}
                        {/* Who Should Join - Enhanced List View */}
                        {who_should_join && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
                                {/* Header with gradient */}
                                <div className="bg-gradient-to-r from-[#0b1c2e] via-[#204066] to-[#0b1c2e] p-6 relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/4"></div>
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/4"></div>
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                                <UserOutlined className="text-white text-xl" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white m-0">Who Should Join</h3>
                                        </div>
                                        <p className="text-gray-300 text-sm m-0">Target audience for this conference</p>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8">
                                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-x-12 gap-y-4">
                                            {(() => {
                                                // Parse HTML list items into array
                                                const tempDiv = document.createElement('div');
                                                tempDiv.innerHTML = who_should_join;
                                                const listItems = tempDiv.querySelectorAll('li');

                                                if (listItems.length === 0) {
                                                    // Fallback: render as HTML if no list items
                                                    return (
                                                        <div className="col-span-full text-gray-600 leading-relaxed ql-editor">
                                                            <div dangerouslySetInnerHTML={createMarkup(who_should_join)} />
                                                        </div>
                                                    );
                                                }

                                                return Array.from(listItems).map((li, idx) => (
                                                    <div key={idx} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0 hover:bg-white hover:pl-2 transition-all duration-300 rounded-lg group">
                                                        <div className="mt-1.5 h-2 w-2 rounded-full bg-[#204066] flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                                                        <p className="text-gray-700 text-[15px] leading-relaxed m-0 font-medium group-hover:text-[#0b1c2e] transition-colors text-left">
                                                            {li.textContent.trim()}
                                                        </p>
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}


                        {/* Committee Section - Enhanced UX */}
                        <div id="committee" className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
                            {/* Section Header with theme gradient */}
                            <div className="bg-gradient-to-r from-[#0b1c2e] via-[#204066] to-[#0b1c2e] p-6 relative overflow-hidden">
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/4"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/4"></div>
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold text-white m-0 flex items-center gap-3">
                                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                            <TeamOutlined className="text-2xl" />
                                        </div>
                                        Conference Committee
                                    </h3>
                                    <p className="text-gray-300 text-sm mt-2 mb-0">Meet the team behind this conference</p>
                                </div>
                            </div>

                            <Tabs
                                defaultActiveKey="organizing"
                                className="committee-tabs"
                                tabBarStyle={{
                                    padding: '0 24px',
                                    marginBottom: 0,
                                    background: '#f8fafc',
                                    borderBottom: '1px solid #e2e8f0'
                                }}
                                items={[
                                    {
                                        key: 'organizing',
                                        label: (
                                            <span className="flex items-center gap-2 py-3 px-4 text-base font-semibold">
                                                <div className="bg-[#0b1c2e]/10 text-[#0b1c2e] p-1.5 rounded-lg">
                                                    <TeamOutlined />
                                                </div>
                                                Organizing Committee
                                            </span>
                                        ),
                                        children: (
                                            <div className="p-6 bg-gradient-to-b from-gray-50/50 to-white min-h-[200px]">
                                                {organizing_committee ? (
                                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {(() => {
                                                            // Parse HTML list items into array
                                                            const tempDiv = document.createElement('div');
                                                            tempDiv.innerHTML = organizing_committee;
                                                            const listItems = tempDiv.querySelectorAll('li');

                                                            if (listItems.length === 0) {
                                                                // Fallback: render as HTML if no list items
                                                                return (
                                                                    <div className="col-span-full text-gray-600 leading-relaxed ql-editor">
                                                                        <div dangerouslySetInnerHTML={createMarkup(organizing_committee)} />
                                                                    </div>
                                                                );
                                                            }

                                                            return Array.from(listItems).map((li, i) => {
                                                                // Extract name (usually in strong tag) and role/affiliation
                                                                const strongTag = li.querySelector('strong');
                                                                const name = strongTag ? strongTag.textContent.trim() : li.textContent.split(',')[0].trim();
                                                                const subtext = strongTag
                                                                    ? li.textContent.replace(strongTag.textContent, '').trim().replace(/^[,:\s-]+/, '')
                                                                    : li.textContent.includes(',') ? li.textContent.split(',').slice(1).join(',').trim() : null;

                                                                return (
                                                                    <div key={i} className="group bg-white p-4 rounded-xl border border-gray-100 hover:border-[#204066]/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                                                        <div className="flex items-center gap-4">
                                                                            <div className="h-12 w-12 bg-gradient-to-br from-[#0b1c2e] to-[#204066] text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-md group-hover:scale-110 transition-transform">
                                                                                {name.charAt(0).toUpperCase()}
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <div className="font-bold text-gray-800 truncate">{name}</div>
                                                                                {subtext && <div className="text-xs text-gray-500 truncate">{subtext}</div>}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            });
                                                        })()}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
                                                        <div className="bg-gray-100 p-4 rounded-full mb-3">
                                                            <TeamOutlined className="text-2xl" />
                                                        </div>
                                                        <p>No Record Available</p>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    },
                                    {
                                        key: 'steering',
                                        label: (
                                            <span className="flex items-center gap-2 py-3 px-4 text-base font-semibold">
                                                <div className="bg-[#204066]/10 text-[#204066] p-1.5 rounded-lg">
                                                    <SafetyCertificateOutlined />
                                                </div>
                                                Steering Committee
                                            </span>
                                        ),
                                        children: (
                                            <div className="p-6 bg-gradient-to-b from-gray-50/50 to-white min-h-[200px]">
                                                {parsedSteeringCommittee.length > 0 ? (
                                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {parsedSteeringCommittee.map((item, i) => {
                                                            const name = typeof item === 'object' ? (item.name || JSON.stringify(item)) : item;
                                                            const subtext = typeof item === 'object' && item.affiliation ? item.affiliation : null;

                                                            return (
                                                                <div key={i} className="group bg-white p-4 rounded-xl border border-gray-100 hover:border-[#204066]/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="h-12 w-12 bg-gradient-to-br from-[#0b1c2e] to-[#204066] text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-md group-hover:scale-110 transition-transform">
                                                                            {name.charAt(0).toUpperCase()}
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="font-bold text-gray-800 truncate">{name}</div>
                                                                            {subtext && <div className="text-xs text-gray-500 truncate">{subtext}</div>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
                                                        <div className="bg-gray-100 p-4 rounded-full mb-3">
                                                            <TeamOutlined className="text-2xl" />
                                                        </div>
                                                        <p>No Record Available</p>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    },
                                    {
                                        key: 'review',
                                        label: (
                                            <span className="flex items-center gap-2 py-3 px-4 text-base font-semibold">
                                                <div className="bg-[#0b1c2e]/10 text-[#0b1c2e] p-1.5 rounded-lg">
                                                    <FileTextOutlined />
                                                </div>
                                                Review Board
                                            </span>
                                        ),
                                        children: (
                                            <div className="p-6 bg-gradient-to-b from-gray-50/50 to-white min-h-[200px]">
                                                {parsedReviewBoard.length > 0 ? (
                                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {parsedReviewBoard.map((item, i) => {
                                                            const name = typeof item === 'object' ? (item.name || JSON.stringify(item)) : item;
                                                            const subtext = typeof item === 'object' && item.affiliation ? item.affiliation : null;

                                                            return (
                                                                <div key={i} className="group bg-white p-4 rounded-xl border border-gray-100 hover:border-[#204066]/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="h-12 w-12 bg-gradient-to-br from-[#0b1c2e] to-[#204066] text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-md group-hover:scale-110 transition-transform">
                                                                            {name.charAt(0).toUpperCase()}
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="font-bold text-gray-800 truncate">{name}</div>
                                                                            {subtext && <div className="text-xs text-gray-500 truncate">{subtext}</div>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
                                                        <div className="bg-gray-100 p-4 rounded-full mb-3">
                                                            <TeamOutlined className="text-2xl" />
                                                        </div>
                                                        <p>No Record Available</p>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    }
                                ]} />
                        </div>

                        {/* Program Schedule */}
                        {program_schedule && (
                            <ContentSection title="Program Schedule" content={program_schedule} icon={<ScheduleOutlined />} />
                        )}

                    </Col>

                    {/* RIGHT COLUMN */}
                    <Col xs={24} lg={8}>
                        {/* Important Dates Card - Enhanced */}
                        {importantDateKeys.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
                                {/* Header with gradient matching theme */}
                                <div className="bg-gradient-to-r from-[#0b1c2e] via-[#204066] to-[#0b1c2e] p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                            <CalendarOutlined className="text-white text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold m-0 text-lg">Important Dates</h3>
                                            <p className="text-gray-300 text-xs m-0">Mark your calendar</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 space-y-4">
                                    {importantDateKeys.map((key, idx) => {
                                        const dateObj = parsedImportantDates[key];
                                        const title = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                                        if (!dateObj) return null;

                                        // Logic to calculate status and progress
                                        const startDate = new Date(dateObj.startDate);
                                        const endDate = new Date(dateObj.lastDate);
                                        const today = new Date();
                                        let status = 'UPCOMING';
                                        let progress = 0;
                                        let statusColor = 'bg-amber-100 text-amber-700';
                                        let progressColor = 'bg-amber-500';
                                        let iconBg = 'bg-amber-100 text-amber-600';

                                        if (today < startDate) {
                                            status = 'UPCOMING';
                                            progress = 0;
                                            statusColor = 'bg-amber-100 text-amber-700';
                                            progressColor = 'bg-amber-500';
                                            iconBg = 'bg-amber-100 text-amber-600';
                                        } else if (today >= startDate && today <= endDate) {
                                            status = 'OPEN';
                                            const totalDuration = endDate - startDate;
                                            const elapsed = today - startDate;
                                            progress = Math.min((elapsed / totalDuration) * 100, 100);
                                            statusColor = 'bg-green-100 text-green-700';
                                            progressColor = 'bg-green-500';
                                            iconBg = 'bg-green-100 text-green-600';
                                        } else {
                                            status = 'CLOSED';
                                            progress = 100;
                                            statusColor = 'bg-gray-100 text-gray-500';
                                            progressColor = 'bg-gray-400';
                                            iconBg = 'bg-gray-100 text-gray-400';
                                        }

                                        // Handle invalid dates
                                        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                                            progress = 0;
                                            status = 'TBA';
                                            statusColor = 'bg-gray-100 text-gray-400';
                                            progressColor = 'bg-gray-300';
                                            iconBg = 'bg-gray-100 text-gray-400';
                                        }

                                        // Format dates nicely
                                        const formatDate = (dateStr) => {
                                            if (!dateStr) return 'TBA';
                                            const date = new Date(dateStr);
                                            if (isNaN(date.getTime())) return dateStr;
                                            return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                                        };

                                        return (
                                            <div key={idx} className="group bg-gray-50 hover:bg-white rounded-xl p-4 border border-gray-100 hover:border-[#204066]/30 hover:shadow-md transition-all duration-300">
                                                {/* Header Row */}
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${iconBg} transition-colors`}>
                                                            <CalendarOutlined className="text-lg" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-gray-800 text-sm m-0">{title}</h4>
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${statusColor}`}>
                                                                {status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                {status !== 'TBA' && (
                                                    <div className="mb-3">
                                                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full ${progressColor} rounded-full transition-all duration-500`}
                                                                style={{ width: `${progress}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Dates */}
                                                <div className="flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-400 font-medium">Opens:</span>
                                                        <span className="font-semibold text-gray-700">{formatDate(dateObj.startDate)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-400 font-medium">Deadline:</span>
                                                        <span className="font-bold text-[#0b1c2e]">{formatDate(dateObj.lastDate)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Organizers Section - Enhanced */}
                        {(organisers || organizer_logo || organizer_image) && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
                                {/* Header with gradient matching theme */}
                                <div className="bg-gradient-to-r from-[#0b1c2e] via-[#204066] to-[#0b1c2e] p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                            <TeamOutlined className="text-white text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold m-0 text-lg">Organized By</h3>
                                            <p className="text-gray-300 text-xs m-0">Conference organizers</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5">
                                    {/* Organizer Cover Image */}
                                    {organizer_image && (
                                        <div className="mb-5 rounded-xl overflow-hidden shadow-md">
                                            <img
                                                src={`${ImageURl}${organizer_image}`}
                                                alt="Organizer"
                                                className="w-full h-44 object-cover hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    )}

                                    {/* Organizer Logo */}
                                    {organizer_logo && (
                                        <div className="flex justify-center mb-5">
                                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 inline-block">
                                                <img
                                                    src={`${ImageURl}${organizer_logo}`}
                                                    alt="Organizer Logo"
                                                    className="max-h-20 object-contain"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Organizer Details */}
                                    {organisers && (
                                        <div
                                            dangerouslySetInnerHTML={createMarkup(organisers)}
                                            className="text-gray-600 text-sm leading-relaxed text-center
                                            [&>p]:mb-2 [&_strong]:text-gray-800 [&_a]:text-[#204066] [&_a]:hover:underline"
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Partners Section - Enhanced */}
                        {partner_image && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
                                {/* Header with gradient matching theme */}
                                <div className="bg-gradient-to-r from-[#0b1c2e] via-[#204066] to-[#0b1c2e] p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                            <BankOutlined className="text-white text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold m-0 text-lg">Our Partners</h3>
                                            <p className="text-gray-300 text-xs m-0">Supporting organizations</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="flex justify-center items-center">
                                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 inline-block hover:shadow-md hover:border-[#204066]/30 transition-all duration-300">
                                            <img
                                                src={`${ImageURl}${partner_image}`}
                                                alt="Partner"
                                                className="max-h-28 object-contain hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Venue / Location Section - Enhanced */}
                        {parsedVenue && (parsedVenue.name || typeof venue === 'string') && (
                            <div id="venue" className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
                                {/* Header with gradient matching theme */}
                                <div className="bg-gradient-to-r from-[#0b1c2e] via-[#204066] to-[#0b1c2e] p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                            <EnvironmentOutlined className="text-white text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold m-0 text-lg">Venue Location</h3>
                                            <p className="text-gray-300 text-xs m-0">Conference venue</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5">
                                    {/* Map */}
                                    <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden relative shadow-md mb-4">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            frameBorder="0"
                                            style={{ border: 0 }}
                                            src={`https://maps.google.com/maps?q=${encodeURIComponent(parsedVenue.name || venue)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                            allowFullScreen
                                            title="Venue Map"
                                        ></iframe>
                                    </div>

                                    {/* Location Card */}
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-[#204066]/30 hover:shadow-sm transition-all duration-300">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-red-100 text-red-500 p-2 rounded-lg">
                                                <EnvironmentOutlined className="text-lg" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 m-0 uppercase tracking-wider font-medium">Address</p>
                                                <p className="font-semibold text-gray-800 m-0">{parsedVenue.name || venue}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}



                    </Col>
                </Row>
            </div >


            {/* Past Conferences - Premium Dark Section */}
            {
                parsedPastConferences && parsedPastConferences.length > 0 && (
                    <div id="past-conferences" className="w-full bg-[#0b1c2e] py-16 relative overflow-hidden">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#204066] rounded-full mix-blend-screen filter blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-screen filter blur-[80px] opacity-10 translate-y-1/2 -translate-x-1/2"></div>

                        <div className="container mx-auto px-4 relative z-10">
                            {/* Header */}
                            <div className="text-center mb-12">

                                <h3 className="text-3xl font-bold text-white mb-4">Past Conferences</h3>
                                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto"></div>
                            </div>

                            {/* Horizontal Scroll Container */}
                            <div className="relative">
                                {/* Scroll Buttons Hint (optional, can be added if needed) */}

                                <div className="flex overflow-x-auto pb-12 gap-6 snap-x px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                                    {parsedPastConferences.map((conf, idx) => (
                                        <div key={idx} className="flex-shrink-0 w-80 snap-center group">
                                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl h-full hover:bg-white hover:transform hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]">

                                                {/* Hover Gradient Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                                {/* Year Badge */}
                                                <div className="flex justify-between items-start mb-6 relative z-10">
                                                    <div className="text-5xl font-bold text-white/10 group-hover:text-[#0b1c2e]/10 transition-colors duration-300 font-heading">
                                                        {conf.year}
                                                    </div>
                                                    <div className="h-10 w-10 rounded-full bg-white/10 group-hover:bg-[#0b1c2e] flex items-center justify-center text-white transition-colors duration-300">
                                                        <HistoryOutlined />
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="relative z-10">
                                                    <h4 className="text-xl font-bold text-white group-hover:text-[#0b1c2e] mb-3 transition-colors duration-300">
                                                        Conference {conf.year}
                                                    </h4>

                                                    <div className="flex items-start gap-3 text-gray-400 group-hover:text-gray-600 transition-colors duration-300">
                                                        <EnvironmentOutlined className="mt-1 text-blue-400 group-hover:text-[#204066]" />
                                                        <span className="text-sm leading-relaxed font-medium">
                                                            {conf.location}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Bottom Highlight */}
                                                <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#204066] group-hover:w-full transition-all duration-500"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Submission Guidelines - Full Width Section */}
            {
                guidelines && (
                    <div id="submission-guidelines" className="w-full bg-white py-12">
                        <div className="container mx-auto px-4">
                            {/* Header */}
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-[#0b1c2e] mb-3 flex items-center justify-center gap-3">
                                    <SafetyCertificateOutlined className="text-[#204066]" />
                                    Submission Guidelines
                                </h2>
                                <div className="h-1 w-20 bg-[#204066] mx-auto rounded-full mb-4"></div>
                                <p className="text-gray-500 max-w-2xl mx-auto text-center">Requirements and instructions for paper submission</p>
                            </div>

                            {/* Content */}
                            <div className="max-w-7xl mx-auto">
                                <div className="p-4 md:p-0">
                                    <div
                                        dangerouslySetInnerHTML={createMarkup(guidelines)}
                                        className="text-gray-600 leading-relaxed ql-editor
                                    [&>ul]:space-y-4 [&>ul]:pl-0 [&>ul]:m-0 [&>ul]:list-none [&>ul]:columns-1 [&>ul]:md:columns-2 [&>ul]:gap-12
                                    [&>ul>li]:relative [&>ul>li]:pl-8 [&>ul>li]:py-2 [&>ul>li]:text-gray-700 [&>ul>li]:break-inside-avoid
                                    [&>ul>li]:before:content-[''] [&>ul>li]:before:absolute [&>ul>li]:before:left-0 [&>ul>li]:before:top-4
                                    [&>ul>li]:before:w-2.5 [&>ul>li]:before:h-2.5 [&>ul>li]:before:bg-[#204066] [&>ul>li]:before:rounded-full
                                    [&>ol]:space-y-4 [&>ol]:pl-0 [&>ol]:m-0 [&>ol]:list-decimal [&>ol]:list-inside [&>ol]:columns-1 [&>ol]:md:columns-2 [&>ol]:gap-12
                                    [&>ol>li]:py-2 [&>ol>li]:text-gray-700 [&>ol>li]:marker:text-[#204066] [&>ol>li]:marker:font-bold [&>ol>li]:break-inside-avoid
                                    [&_strong]:text-[#0b1c2e] [&_strong]:font-bold
                                    [&>p]:mb-6 [&>p]:text-gray-600"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Conference Objectives - Full Width Section */}
            {
                conference_objectives && (
                    <div id="conference-objectives" className="w-full bg-gray-100 py-16">
                        <div className="container mx-auto px-4">
                            {/* Header */}
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-[#0b1c2e] mb-3 flex items-center justify-center gap-3">
                                    <GlobalOutlined className="text-[#204066]" />
                                    Conference Objectives
                                </h2>
                                <div className="h-1 w-20 bg-[#204066] mx-auto rounded-full mb-4"></div>
                                <p className="text-gray-500 max-w-2xl mx-auto text-center">What we aim to achieve through this conference</p>
                            </div>

                            {/* Objectives Grid - Modern Feature List (No Cards) */}
                            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                                {(() => {
                                    // Parse HTML list items into objectives array
                                    const tempDiv = document.createElement('div');
                                    tempDiv.innerHTML = conference_objectives;
                                    const listItems = tempDiv.querySelectorAll('li');

                                    if (listItems.length === 0) {
                                        // Fallback: render as HTML if no list items
                                        return (
                                            <div className="col-span-full text-gray-600 leading-relaxed ql-editor bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                                                <div dangerouslySetInnerHTML={createMarkup(conference_objectives)} />
                                            </div>
                                        );
                                    }

                                    return Array.from(listItems).map((li, idx) => (
                                        <div
                                            key={idx}
                                            className="flex gap-4 group"
                                        >
                                            <div className="flex-shrink-0 mt-1">
                                                <div className="w-8 h-8 rounded-full bg-[#204066]/10 text-[#204066] flex items-center justify-center transition-colors duration-300 group-hover:bg-[#204066] group-hover:text-white">
                                                    <CheckCircleFilled className="text-lg" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-gray-600 text-lg leading-relaxed m-0 group-hover:text-gray-900 transition-colors duration-300">
                                                    {li.textContent.trim()}
                                                </p>
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Conference Themes - Full Width Section */}
            {
                themes && (
                    <div id="conference-themes" className="w-full bg-white py-16">
                        <div className="container mx-auto px-4">
                            {/* Header */}
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-[#0b1c2e] mb-3 flex items-center justify-center gap-3">
                                    <FileTextOutlined className="text-[#204066]" />
                                    Conference Themes
                                </h2>
                                <div className="h-1 w-20 bg-[#204066] mx-auto rounded-full mb-4"></div>
                                <p className="text-gray-500 max-w-2xl mx-auto text-center">Explore the key research areas and topics covered in this conference</p>
                            </div>

                            {/* Themes Grid - Modern Feature List (No Cards) */}
                            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                                {(() => {
                                    // Extract text content from HTML list items
                                    const tempDiv = document.createElement('div');
                                    tempDiv.innerHTML = themes;
                                    const listItems = tempDiv.querySelectorAll('li');
                                    const themesArray = Array.from(listItems).map(li => li.textContent.trim());

                                    if (themesArray.length === 0) {
                                        // Fallback: render as HTML if no list items found
                                        return (
                                            <div className="col-span-full text-gray-600 leading-relaxed ql-editor bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                                                <div dangerouslySetInnerHTML={createMarkup(themes)} />
                                            </div>
                                        );
                                    }

                                    return themesArray.map((theme, idx) => (
                                        <div
                                            key={idx}
                                            className="flex gap-4 group"
                                        >
                                            <div className="flex-shrink-0 mt-1">
                                                <div className="w-8 h-8 rounded-full bg-[#204066]/10 text-[#204066] flex items-center justify-center transition-colors duration-300 group-hover:bg-[#204066] group-hover:text-white">
                                                    <CheckCircleFilled className="text-lg" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-gray-600 text-lg leading-relaxed m-0 group-hover:text-gray-900 transition-colors duration-300">
                                                    {theme}
                                                </p>
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Key Benefits - Full Width with Background */}
            {
                parsedKeyBenefits && parsedKeyBenefits.length > 0 && (
                    <div id="key-benefits" className="w-full bg-[#0b1c2e]/5 py-12">
                        <div className="container mx-auto px-4">
                            <div className="mb-0">
                                <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center justify-center gap-2">
                                    <TrophyOutlined className="text-[#204066]" /> Key Benefits
                                </h3>
                                <div className="grid md:grid-cols-2 gap-5">
                                    {parsedKeyBenefits.map((benefit, idx) => (
                                        <div key={idx} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 border-l-[5px] border-l-[#204066] flex  justify-start gap-4 transition-all hover:shadow-md hover:-translate-y-0.5 duration-300 h-full">
                                            <div className="text-[#204066] text-2xl flex-shrink-0 flex ">
                                                <TrophyOutlined />
                                            </div>
                                            <span className="text-[#0b1c2e] font-bold text-[15px] leading-snug text-left">
                                                {typeof benefit === 'string' ? benefit : JSON.stringify(benefit)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            <div className="container mx-auto px-4 px-4 pt-12 pb-0">
                {/* Keynote Speakers - Full Width */}
                {parsedKeynoteSpeakers && parsedKeynoteSpeakers.length > 0 && (
                    <div id="keynote-speakers" className="mb-14 relative group">
                        <h3 className="text-xl font-bold text-gray-800 mb-8 text-center">
                            Keynote Speakers
                        </h3>

                        <div className="px-4 md:px-12">
                            <Carousel
                                arrows={true}
                                prevArrow={<SlickArrowLeft />}
                                nextArrow={<SlickArrowRight />}
                                slidesToShow={3}
                                slidesToScroll={1}
                                dots={false}
                                responsive={[
                                    { breakpoint: 1024, settings: { slidesToShow: 2 } },
                                    { breakpoint: 640, settings: { slidesToShow: 1 } }
                                ]}
                                className="pb-8 -mx-4"
                            >
                                {parsedKeynoteSpeakers.map((speaker, idx) => (
                                    <div key={idx} className="px-4 h-full">
                                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-[320px] flex flex-col relative mx-2">
                                            {/* Header */}
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-[#204066]/20 flex-shrink-0">
                                                    {speaker.image ? (
                                                        <img src={`${ImageURl}${speaker.image}`} alt={speaker.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full bg-[#0b1c2e]/10 flex items-center justify-center text-[#204066]">
                                                            <UserOutlined className="text-2xl" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-800 text-lg leading-tight">{speaker.name}</h4>
                                                    <p className="text-[#204066] text-sm font-medium m-0 line-clamp-2">{speaker.designation}</p>
                                                </div>
                                            </div>

                                            <Divider className="my-3" />

                                            {/* Content */}
                                            <div className="flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#204066]/40 transition-[::-webkit-scrollbar-thumb]">
                                                <div className="flex gap-3">
                                                    <div className="flex-shrink-0 mt-1">
                                                        <span className="text-4xl text-[#204066]/30 leading-none font-serif">“</span>
                                                    </div>
                                                    <p className="text-gray-600 text-[13px] leading-relaxed italic">
                                                        {speaker.about}
                                                    </p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                    </div>
                )}




            </div>

            {/* Footer */}
            {/* Footer - Modern Redesign */}
            <footer className="bg-[#0b1c2e] text-white pt-20 pb-10 border-t border-white/5 mt-auto relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#204066] to-transparent opacity-50"></div>

                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-12 lg:gap-20">
                        {/* Brand Column */}
                        <div className="md:col-span-1 flex flex-col justify-between h-full">
                            <div>
                                <h5 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">Organized By</h5>
                                {organizer_logo && (
                                    <div className="bg-white rounded-xl p-4 inline-block w-auto max-w-[200px]">
                                        <img
                                            src={`${ImageURl}${organizer_logo}`}
                                            alt={conference?.name || "Conference Logo"}
                                            className="h-16 w-auto object-contain"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Links Column */}
                        <div className="md:col-span-2">
                            <h5 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">Quick Navigation</h5>
                            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                                {[
                                    { id: 'about-the-conference', label: 'About Conference' },
                                    { id: 'conference-themes', label: 'Conference Themes' },
                                    { id: 'call-for-papers', label: 'Call for Papers' },
                                    { id: 'committee', label: 'Committee' },
                                    { id: 'keynote-speakers', label: 'Keynote Speakers' },
                                    { id: 'venue', label: 'Venue Information' }
                                ].map((item) => (
                                    <li key={item.id}>
                                        <button
                                            onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
                                            className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group text-sm font-medium"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#204066] group-hover:bg-blue-400 transition-colors"></span>
                                            <span className="group-hover:translate-x-1 transition-transform inline-block">{item.label}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Venue Column */}
                        <div className="md:col-span-1">
                            <h5 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">Venue</h5>
                            <div className="space-y-6">
                                {parsedVenue?.name && (
                                    <div className="group">
                                        <div className="flex items-start gap-4 mb-3">
                                            <div className="w-10 h-10 rounded-lg bg-[#204066]/20 flex items-center justify-center flex-shrink-0 text-[#204066] group-hover:bg-[#204066] group-hover:text-white transition-colors duration-300">
                                                <EnvironmentOutlined className="text-lg" />
                                            </div>
                                            <div>
                                                <p className="text-white font-semibold mb-1 leading-tight">{parsedVenue.name}</p>
                                                <p className="text-gray-400 text-sm leading-relaxed">{parsedVenue.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-white/5 mt-16 pt-8 flex justify-center items-center">
                        <p className="text-gray-500 text-sm text-center">
                            © {new Date().getFullYear()} {conference?.name || 'Conference'}. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>

            {/* Registration Modal */}
            <ConferenceRegistrationModal
                open={isRegistrationModalOpen}
                onCancel={() => setIsRegistrationModalOpen(false)}
                conferenceId={id}
                conferenceName={conference?.name}
            />

        </div >
    );
};

export default ConferenceDetailsPage;