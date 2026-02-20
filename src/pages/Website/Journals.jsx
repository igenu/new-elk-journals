import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { journalApi } from '../../services/api';
import JournalSlider from '../../components/Website/JournalSlider';
import JournalInner from '../../components/Website/JournalInner';
import JournalCover from '../../assets/images/jm-eapjmrm.jpg';
import Img from "../../assets/images/mrm.png";

const Journals = () => {

    const { route } = useParams();
    const [journalData, setJournalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJournalData = async () => {
            try {
                const response = await journalApi.getDetailsByCategory(route);
                console.log("Received journal data:", response.data);
                console.log("Areas Covered:", response.data.areasCovered);
                console.log("Is areasCovered an array?", Array.isArray(response.data.areasCovered));
                setJournalData(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch journal details", err);
                setError("Failed to load journal details.");
                setLoading(false);
            }
        };

        if (route) {
            fetchJournalData();
        }
    }, [route]);

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
    if (!journalData) return <div className="p-8 text-center">Journal not found</div>;
    return (
        <>
            <JournalSlider journalData={journalData} />
            <JournalInner journalData={journalData} />
        </>
    )
}

export default Journals