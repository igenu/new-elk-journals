import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaLongArrowAltRight, FaUser, FaPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { authApi } from '../../services/api';
import NewsWidget from "../../components/Website/NewsWidget";

const ForgetPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Verify Email, 2: Reset Password
    const [userData, setUserData] = useState(null);

    const validationSchemaStep1 = Yup.object({
        email: Yup.string().email('Invalid email address').required('Email is required'),
    });

    const validationSchemaStep2 = Yup.object({
        newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
            .required('Confirm Password is required'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: step === 1 ? validationSchemaStep1 : validationSchemaStep2,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                if (step === 1) {
                    const response = await authApi.verifyUser({ email: values.email });
                    if (response.data && response.data.success) {
                        setUserData(response.data);
                        setStep(2);
                        Swal.fire({
                            icon: 'success',
                            title: 'User Verified',
                            text: response.data.message || 'User found! Please enter your new password.',
                            confirmButtonColor: '#12b48b',
                            timer: 2000
                        });
                    }
                } else {
                    const payload = {
                        email: values.email,
                        role: userData.role, // Use the role returned from verification
                        newPassword: values.newPassword
                    };
                    const response = await authApi.resetPassword(payload);
                    if (response.data && response.data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Password Reset',
                            text: 'Your password has been reset successfully. Please login with your new password.',
                            confirmButtonColor: '#12b48b'
                        }).then(() => {
                            navigate('/become-an-editor'); // Or redirect to login page directly if separate
                        });
                    }
                }
            } catch (error) {
                console.error("Error:", error);
                const errorMessage = error.response?.data?.message || (error.response?.data?.error && error.response.data.error.message) || 'An error occurred. Please try again.';
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorMessage,
                    confirmButtonColor: '#12b48b'
                });
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="pt-8 bg-white min-h-screen">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* LEFT COLUMN - Main Content */}
                    <div className="lg:col-span-3">
                        <div className="mb-6">
                            <h1 className="text-2xl text-[#12b48b] font-normal mb-2 relative inline-block">
                                ELK's Forgot Password
                                {/* <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-[#12b48b] transform translate-y-1"></span> */}
                            </h1>
                            <p className="text-sm text-gray-600 mt-2">Please enter your email id and send to recover your password.</p>
                        </div>

                        <div className="bg-white border border-gray-200 mt-8 max-w-2xl">
                            <h2 className="bg-[#204066] text-white text-lg font-medium py-3 px-4 text-center uppercase">
                                {step === 1 ? 'RECOVER PASSWORD' : 'RESET PASSWORD'}
                            </h2>
                            <div className="p-6">
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="space-y-4">
                                        {/* Email Input - Always visible but readOnly in Step 2 */}
                                        <div className="flex flex-col w-full">
                                            <div className={`flex bg-gray-100 border ${formik.errors.email && formik.touched.email ? 'border-red-500' : 'border-gray-300'} rounded overflow-hidden`}>
                                                <div className="w-12 flex items-center justify-center bg-[#444] text-white">
                                                    <FaEnvelope className="text-sm" />
                                                </div>
                                                <input
                                                    type="email"
                                                    placeholder="Email ID"
                                                    {...formik.getFieldProps('email')}
                                                    readOnly={step === 2}
                                                    className={`flex-1 px-3 py-3 bg-white focus:outline-none text-sm text-gray-700 placeholder-gray-500 ${step === 2 ? 'bg-gray-100 text-gray-500' : ''}`}
                                                />
                                            </div>
                                            {formik.errors.email && formik.touched.email && <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>}
                                        </div>

                                        {step === 2 && (
                                            <>
                                                <div className="flex flex-col w-full">
                                                    <div className={`flex bg-gray-100 border ${formik.errors.newPassword && formik.touched.newPassword ? 'border-red-500' : 'border-gray-300'} rounded overflow-hidden`}>
                                                        <div className="w-12 flex items-center justify-center bg-[#444] text-white">
                                                            <FaLock className="text-sm" />
                                                        </div>
                                                        <input
                                                            type="password"
                                                            placeholder="New Password"
                                                            {...formik.getFieldProps('newPassword')}
                                                            className="flex-1 px-3 py-3 bg-white focus:outline-none text-sm text-gray-700 placeholder-gray-500"
                                                        />
                                                    </div>
                                                    {formik.errors.newPassword && formik.touched.newPassword && <div className="text-red-500 text-xs mt-1">{formik.errors.newPassword}</div>}
                                                </div>
                                                <div className="flex flex-col w-full">
                                                    <div className={`flex bg-gray-100 border ${formik.errors.confirmPassword && formik.touched.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded overflow-hidden`}>
                                                        <div className="w-12 flex items-center justify-center bg-[#444] text-white">
                                                            <FaLock className="text-sm" />
                                                        </div>
                                                        <input
                                                            type="password"
                                                            placeholder="Confirm Password"
                                                            {...formik.getFieldProps('confirmPassword')}
                                                            className="flex-1 px-3 py-3 bg-white focus:outline-none text-sm text-gray-700 placeholder-gray-500"
                                                        />
                                                    </div>
                                                    {formik.errors.confirmPassword && formik.touched.confirmPassword && <div className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</div>}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center mt-6">
                                        <div className="flex gap-4 text-sm text-[#204066]">
                                            <Link to="/login" className="flex items-center gap-1 hover:underline font-medium">
                                                <FaLock className="text-xs" /> Login
                                            </Link>
                                            <span className="text-gray-400">|</span>
                                            <Link to="/become-an-editor" className="flex items-center gap-1 hover:underline font-medium">
                                                <FaPlus className="text-xs" /> Create Account
                                            </Link>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={formik.isSubmitting}
                                            className="bg-[#009e75] text-white px-6 py-2 shadow hover:bg-[#008c68] flex items-center gap-2 font-bold transition-colors disabled:opacity-70 uppercase text-sm"
                                        >
                                            {formik.isSubmitting ? 'PROCESSING...' : (step === 1 ? 'SUBMIT' : 'RESET PASSWORD')} <FaLongArrowAltRight />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - Sidebar */}
                    <div className="lg:col-span-1 space-y-8">
                        <NewsWidget />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;
