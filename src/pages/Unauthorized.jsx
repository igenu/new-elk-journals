import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <Result
                    icon={<FaLock className="text-6xl text-red-500 mx-auto mb-4" />}
                    status="403" // Ant Design uses 403 for forbidden/unauthorized usually, or we can use "error"
                    title="401 - Unauthorized"
                    subTitle="Sorry, you are not authorized to access this page. Please log in to continue."
                    extra={
                        <Button type="primary" onClick={() => navigate('/admin/login')} size="large">
                            Go to Login
                        </Button>
                    }
                />
            </div>
        </div>
    );
};

export default Unauthorized;
