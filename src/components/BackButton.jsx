import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { Button } from 'antd';

const BackButton = ({ className = '' }) => {
    const navigate = useNavigate();

    return (
        <Button
            type="text"
            icon={<FaArrowLeft />}
            onClick={() => navigate(-1)}
            className={`cursor-pointer hover:text-blue-500 flex items-center ${className}`}
        >
            Back
        </Button>
    );
};

export default BackButton;
