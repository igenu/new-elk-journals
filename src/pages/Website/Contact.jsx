import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBuilding, FaLongArrowAltRight } from 'react-icons/fa';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { contactUsApi } from '../../services/api';
import CodeEntryInput from '../../components/CodeEntryInput';
import NewsWidget from "../../components/Website/NewsWidget";
import SEO from '../../components/SEO';

// Reusable Components matching other forms
const IconInput = ({ icon: Icon, ...props }) => (
    <div className={`flex bg-white border rounded-lg overflow-hidden mb-1 h-12 shadow-sm hover:shadow-md transition-shadow ${props.error ? 'border-red-400' : 'border-gray-300'}`}>
        <div className="w-12 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-[#204066] border-r border-gray-300">
            <Icon className="text-base" />
        </div>
        <input
            {...props}
            className="flex-1 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#12b48b]/30 text-sm text-gray-700 placeholder-gray-500"
        />
    </div>
);

const SelectInput = ({ icon: Icon, options, ...props }) => (
    <div className={`flex bg-white border rounded-lg overflow-hidden mb-1 h-12 shadow-sm hover:shadow-md transition-shadow ${props.error ? 'border-red-400' : 'border-gray-300'}`}>
        <div className="w-12 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-[#204066] border-r border-gray-300">
            <Icon className="text-base" />
        </div>
        <select
            {...props}
            className="flex-1 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#12b48b]/30 text-sm text-gray-700 appearance-none cursor-pointer"
        >
            {props.children}
        </select>
    </div>
);

const ContactSchema = Yup.object().shape({
    fullName: Yup.string().required('Full Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone Number is required'),
    city: Yup.string().required('City is required'),
    department: Yup.string(),
    message: Yup.string().required('Message is required'),
    captchaInput: Yup.string().required('Code is required')
});

const Contact = () => {
    const [captchaCode, setCaptchaCode] = useState('');

    useEffect(() => {
        generateCaptcha();
    }, []);

    const generateCaptcha = () => {
        setCaptchaCode(Math.floor(1000 + Math.random() * 9000).toString());
    };

    const formik = useFormik({
        initialValues: {
            fullName: '',
            email: '',
            phone: '',
            city: '',
            department: '',
            message: '',
            captchaInput: ''
        },
        validationSchema: ContactSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            if (values.captchaInput !== captchaCode) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Code',
                    text: 'The code you entered does not match. Please try again.',
                    confirmButtonColor: '#12b48b'
                });
                setSubmitting(false);
                return;
            }

            try {
                await contactUsApi.create(values);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Contact inquiry submitted successfully',
                    confirmButtonColor: '#12b48b'
                });
                resetForm();
                generateCaptcha();
            } catch (error) {
                console.error(error);
                const errorMessage = error.response?.data?.message || 'Submission failed. Please try again.';
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
        <>
            <SEO 
                title="Get contact details of ELK Asia Pacific Journals"
                description=""
            />
            <div className="py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen font-sans">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-2xl text-[#12b48b] font-normal relative inline-block">
                                ELK's <span className="text-[#12b48b]">Contact Us</span>
                            </h1>
                        </div>

                        {/* Form Section */}
                        <div className="w-full bg-white rounded-xl shadow-xl border border-gray-200 p-8">
                            {/* Form Header with Green Left Border */}
                            <div className="bg-[#204066] py-1 px-4 mb-6 border-l-[5px] border-[#12b48b]">
                                <h2 className="text-white text-[16px] font-normal uppercase tracking-wide">GENERAL ENQUIRY</h2>
                            </div>

                            <form onSubmit={formik.handleSubmit} className="space-y-4">
                                <div>
                                    <IconInput
                                        icon={FaUser}
                                        name="fullName"
                                        type="text"
                                        placeholder="Full Name *"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.fullName}
                                        error={formik.touched.fullName && formik.errors.fullName}
                                    />
                                    {formik.touched.fullName && formik.errors.fullName && <div className="text-red-500 text-xs mb-2">{formik.errors.fullName}</div>}
                                </div>

                                <div>
                                    <IconInput
                                        icon={FaEnvelope}
                                        name="email"
                                        type="email"
                                        placeholder="Email ID *"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.email}
                                        error={formik.touched.email && formik.errors.email}
                                    />
                                    {formik.touched.email && formik.errors.email && <div className="text-red-500 text-xs mb-2">{formik.errors.email}</div>}
                                </div>

                                <div>
                                    <IconInput
                                        icon={FaPhone}
                                        name="phone"
                                        type="text"
                                        placeholder="Phone No *"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.phone}
                                        error={formik.touched.phone && formik.errors.phone}
                                    />
                                    {formik.touched.phone && formik.errors.phone && <div className="text-red-500 text-xs mb-2">{formik.errors.phone}</div>}
                                </div>

                                <div>
                                    <IconInput
                                        icon={FaMapMarkerAlt}
                                        name="city"
                                        type="text"
                                        placeholder="City *"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.city}
                                        error={formik.touched.city && formik.errors.city}
                                    />
                                    {formik.touched.city && formik.errors.city && <div className="text-red-500 text-xs mb-2">{formik.errors.city}</div>}
                                </div>

                                <SelectInput
                                    icon={FaBuilding}
                                    name="department"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.department}
                                    error={formik.touched.department && formik.errors.department}
                                >
                                    <option value="">Choose Department</option>
                                    <option value="Publications">Publications</option>
                                    <option value="Editorial">Editorial</option>
                                    <option value="Conference">Conference</option>
                                    <option value="Technical">Technical</option>
                                    <option value="Others">Others</option>
                                </SelectInput>

                                <div className="mb-6">
                                    <div className={`bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${formik.touched.message && formik.errors.message ? 'border-red-400' : 'border-gray-300'}`}>
                                        <textarea
                                            name="message"
                                            rows="6"
                                            className="w-full bg-transparent focus:outline-none focus:ring-2 focus:ring-[#12b48b]/30 text-sm text-gray-700 placeholder-gray-500 resize-y rounded-lg"
                                            placeholder="Message *"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.message}
                                        ></textarea>
                                    </div>
                                    {formik.touched.message && formik.errors.message && <div className="text-red-500 text-xs mt-1">{formik.errors.message}</div>}
                                </div>

                                {/* Captcha Section */}
                                <div className="mt-8">
                                    <div className="flex flex-wrap items-center gap-3 mb-4">
                                        <div className="flex gap-2">
                                            <CodeEntryInput
                                                length={4}
                                                onChange={(code) => formik.setFieldValue('captchaInput', code)}
                                            />
                                        </div>
                                        <div className="bg-gradient-to-br from-[#48637c] to-[#3a4d5f] text-white h-12 flex items-center px-6 text-xl font-bold tracking-widest min-w-[90px] justify-center shadow-lg rounded-lg">
                                            {captchaCode}
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={formik.isSubmitting}
                                            className="ml-auto inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#12b48b] to-[#0e9673] hover:from-[#0e9673] hover:to-[#0a7857] text-white text-sm font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 uppercase gap-2 disabled:opacity-50 disabled:cursor-not-allowed h-12"
                                        >
                                            {formik.isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
                                            <FaLongArrowAltRight className="text-base" />
                                        </button>
                                    </div>
                                    {formik.touched.captchaInput && formik.errors.captchaInput && <div className="text-red-500 text-xs mb-2">{formik.errors.captchaInput}</div>}
                                    <p className="text-red-600 text-sm font-medium">(*) represents mandatory fields</p>
                                </div>

                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <NewsWidget />
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default Contact;