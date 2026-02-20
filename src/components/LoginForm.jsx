import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaArrowLeft, FaKey } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import Swal from 'sweetalert2';
import { message } from 'antd';
import { setRole } from '../utils/secureStorage';

const LoginForm = ({ onSubmit, onCancel }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Details, 2: OTP
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await authApi.sendOTP(formData);
            // Assuming response.data.otp has the OTP as per specs (for dev)
            const sentOtp = response.data.otp;
            if (sentOtp) {
                // Determine user role based on some logic or assume author from context if not specified? 
                // The prompt says "author redirect to dashboard", implying role handling. 
                // For now just storing OTP as requested.
                sessionStorage.setItem('otp', sentOtp);
            }

            setStep(2);
            Swal.fire({
                icon: 'success',
                title: 'OTP Sent',
                text: 'Please check your email for the OTP.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to send OTP'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');

        const storedOtp = sessionStorage.getItem('otp');

        // Client-side verification
        if (storedOtp && String(otp) !== String(storedOtp)) {
            setError('Invalid OTP');
            return;
        }

        setLoading(true);
        try {
            const payload = { ...formData, otp };
            const response = await authApi.verifyOTPLogin(payload);
            const { token, user, role } = response.data;
            localStorage.clear();
            // Removed 'message' from destructuring as it conflicts with antd message

            // Store token and user data
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setRole(role);

            message.success('Login Successful');
            navigate('/dashboard');

        } catch (error) {
            console.error(error);
            // Clear stored OTP on failure if needed, or keep for retry? Usually keep for retry.
            // sessionStorage.removeItem('otp');
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: error.response?.data?.message || 'Verification failed'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-6">
                <button
                    onClick={onCancel}
                    className="mr-4 text-gray-500 hover:text-[#12b48b] transition-colors"
                    title="Back"
                >
                    <FaArrowLeft />
                </button>
                <h2 className="text-2xl font-bold text-[#12b48b] uppercase">Login</h2>
            </div>

            <p className="text-gray-600 mb-6">
                {step === 1
                    ? "Please enter your details to receive an OTP."
                    : `Enter the OTP sent to ${formData.email}`}
            </p>

            {step === 1 ? (
                <form onSubmit={handleSendOTP} className="space-y-4 max-w-md">
                    <div className="relative">
                        <FaUser className="absolute top-3 left-3 text-gray-400" />
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#12b48b]"
                        />
                    </div>
                    <div className="relative">
                        <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#12b48b]"
                        />
                    </div>
                    <div className="relative">
                        <FaPhone className="absolute top-3 left-3 text-gray-400" />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#12b48b]"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#12b48b] text-white px-8 py-2 rounded shadow hover:bg-[#0e9f7a] font-bold transition-colors w-full sm:w-auto disabled:opacity-50"
                        >
                            {loading ? 'SENDING...' : 'SEND OTP'}
                        </button>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4 max-w-md">
                    <div className="relative">
                        <FaKey className="absolute top-3 left-3 text-gray-400" />
                        <input
                            type="text"
                            name="otp"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => {
                                setOtp(e.target.value);
                                setError('');
                            }}
                            required
                            className={`w-full pl-10 pr-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-[#12b48b]`}
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="pt-4 flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#12b48b] text-white px-8 py-2 rounded shadow hover:bg-[#0e9f7a] font-bold transition-colors w-full sm:w-auto disabled:opacity-50"
                        >
                            {loading ? 'VERIFYING...' : 'LOGIN'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-gray-500 hover:text-gray-700 font-medium px-4 py-2"
                        >
                            Change Email
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default LoginForm;
