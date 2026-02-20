import React, { useState, useEffect } from "react";
import { FaLongArrowAltRight, FaUserSecret, FaPhone } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdMap, MdPinDrop, MdSchool, MdAttachFile } from "react-icons/md";
import { BiUser } from "react-icons/bi";

const ScholarshipForm = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        gender: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
        institute: "",
        file: null,
        captchaInput: ""
    });

    const [captcha, setCaptcha] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Generate random 4-digit captcha
        setCaptcha(Math.floor(1000 + Math.random() * 9000).toString());
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.firstName) newErrors.firstName = "First Name is required";
        if (!formData.lastName) newErrors.lastName = "Last Name is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.city) newErrors.city = "City is required";
        if (!formData.state) newErrors.state = "State is required";
        if (!formData.zip) newErrors.zip = "Zipcode is required";
        if (!formData.phone) newErrors.phone = "Phone No is required";
        // Simple captcha check
        if (formData.captchaInput !== captcha) newErrors.captcha = "Invalid Captcha";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            alert("Form submitted successfully!");
            // Proceed with submission logic (API call)
        }
    };

    return (
        <form className="common-form max-w-4xl mx-auto" onSubmit={handleSubmit}>
            <div className="space-y-6">
                {/* Personal Details */}
                <fieldset className="border border-gray-300">
                    <legend className="text-[#17a2b8] text-base font-normal px-4 ml-4">Personal Details:</legend>
                    <div className="px-6 pb-6 pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-group">
                                <div className="flex">
                                    <span className="inline-flex items-center justify-center w-12 bg-[#d1d5db] border border-r-0 border-gray-300 text-gray-600">
                                        <BiUser size={18} />
                                    </span>
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First Name *"
                                        className={`flex-1 px-3 py-2 border border-gray-300 bg-[#e9ecef] text-gray-700 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-gray-400 ${errors.firstName ? 'border-red-400' : ''}`}
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                </div>
                                {errors.firstName && <span className="text-xs text-red-500 block mt-1">{errors.firstName}</span>}
                            </div>

                            <div className="form-group">
                                <div className="flex">
                                    <span className="inline-flex items-center justify-center w-12 bg-[#d1d5db] border border-r-0 border-gray-300 text-gray-600">
                                        <BiUser size={18} />
                                    </span>
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name *"
                                        className={`flex-1 px-3 py-2 border border-gray-300 bg-[#e9ecef] text-gray-700 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-gray-400 ${errors.lastName ? 'border-red-400' : ''}`}
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                </div>
                                {errors.lastName && <span className="text-xs text-red-500 block mt-1">{errors.lastName}</span>}
                            </div>

                            <div className="form-group">
                                <div className="flex">
                                    <span className="inline-flex items-center justify-center w-12 bg-[#d1d5db] border border-r-0 border-gray-300 text-gray-600">
                                        <FaUserSecret size={18} />
                                    </span>
                                    <input
                                        type="text"
                                        name="gender"
                                        placeholder="Gender *"
                                        className="flex-1 px-3 py-2 border border-gray-300 bg-[#e9ecef] text-gray-700 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-gray-400"
                                        value={formData.gender}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="flex">
                                    <span className="inline-flex items-center justify-center w-12 bg-[#d1d5db] border border-r-0 border-gray-300 text-gray-600">
                                        <MdEmail size={18} />
                                    </span>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email ID *"
                                        className={`flex-1 px-3 py-2 border border-gray-300 bg-[#e9ecef] text-gray-700 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-gray-400 ${errors.email ? 'border-red-400' : ''}`}
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                {errors.email && <span className="text-xs text-red-500 block mt-1">{errors.email}</span>}
                            </div>
                        </div>
                    </div>
                </fieldset>

                {/* Contact Details */}
                <fieldset className="border border-gray-300">
                    <legend className="text-[#17a2b8] text-base font-normal px-4 ml-4">Contact Details:</legend>
                    <div className="px-6 pb-6 pt-2">
                        <div className="space-y-4">
                            <div className="form-group">
                                <div className="flex">
                                    <span className="inline-flex items-start justify-center w-12 pt-2 bg-[#d1d5db] border border-r-0 border-gray-300 text-gray-600">
                                        <MdLocationOn size={18} />
                                    </span>
                                    <textarea
                                        name="address"
                                        placeholder="Address *"
                                        className="flex-1 px-3 py-2 border border-gray-300 bg-[#e9ecef] text-gray-700 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-gray-400 h-20 resize-none"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-group">
                                    <div className="flex">
                                        <span className="inline-flex items-center justify-center w-12 bg-[#d1d5db] border border-r-0 border-gray-300 text-gray-600">
                                            <MdLocationOn size={18} />
                                        </span>
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="City *"
                                            className={`flex-1 px-3 py-2 border border-gray-300 bg-[#e9ecef] text-gray-700 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-gray-400 ${errors.city ? 'border-red-400' : ''}`}
                                            value={formData.city}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {errors.city && <span className="text-xs text-red-500 block mt-1">{errors.city}</span>}
                                </div>

                                <div className="form-group">
                                    <div className="flex">
                                        <span className="inline-flex items-center justify-center w-12 bg-[#d1d5db] border border-r-0 border-gray-300 text-gray-600">
                                            <MdLocationOn size={18} />
                                        </span>
                                        <input
                                            type="text"
                                            name="state"
                                            placeholder="State *"
                                            className={`flex-1 px-3 py-2 border border-gray-300 bg-[#e9ecef] text-gray-700 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-gray-400 ${errors.state ? 'border-red-400' : ''}`}
                                            value={formData.state}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {errors.state && <span className="text-xs text-red-500 block mt-1">{errors.state}</span>}
                                </div>

                                <div className="form-group">
                                    <div className="flex">
                                        <span className="inline-flex items-center justify-center w-12 bg-[#d1d5db] border border-r-0 border-gray-300 text-gray-600">
                                            <MdPinDrop size={18} />
                                        </span>
                                        <input
                                            type="text"
                                            name="zip"
                                            placeholder="Pincode *"
                                            className={`flex-1 px-3 py-2 border border-gray-300 bg-[#e9ecef] text-gray-700 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-gray-400 ${errors.zip ? 'border-red-400' : ''}`}
                                            value={formData.zip}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {errors.zip && <span className="text-xs text-red-500 block mt-1">{errors.zip}</span>}
                                </div>

                                <div className="form-group">
                                    <div className="flex">
                                        <span className="inline-flex items-center justify-center w-12 bg-[#d1d5db] border border-r-0 border-gray-300 text-gray-600">
                                            <FaPhone size={16} />
                                        </span>
                                        <input
                                            type="text"
                                            name="phone"
                                            placeholder="Contact Number *"
                                            className={`flex-1 px-3 py-2 border border-gray-300 bg-[#e9ecef] text-gray-700 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-gray-400 ${errors.phone ? 'border-red-400' : ''}`}
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {errors.phone && <span className="text-xs text-red-500 block mt-1">{errors.phone}</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>

                {/* Organization & Documentation */}
                <fieldset className="border border-gray-300">
                    <legend className="text-[#17a2b8] text-base font-normal px-4 ml-4">Organization & Documentation Details:</legend>
                    <div className="px-6 pb-6 pt-2">
                        <div className="space-y-4">
                            <div className="form-group">
                                <div className="flex">
                                    <span className="inline-flex items-center justify-center w-12 bg-[#d1d5db] border border-r-0 border-gray-300 text-gray-600">
                                        <MdSchool size={18} />
                                    </span>
                                    <input
                                        type="text"
                                        name="institute"
                                        placeholder="Institute/ University *"
                                        className="flex-1 px-3 py-2 border border-gray-300 bg-[#e9ecef] text-gray-700 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-gray-400"
                                        value={formData.institute}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="flex">
                                    <span className="inline-flex items-center justify-center w-12 bg-[#d1d5db] border border-r-0 border-gray-300 text-gray-600">
                                        <MdAttachFile size={18} />
                                    </span>
                                    <input
                                        type="file"
                                        name="file"
                                        className="flex-1 px-3 py-2 border border-gray-300 bg-[#e9ecef] text-gray-700 focus:outline-none focus:bg-white focus:border-gray-400 text-sm"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>

                {/* Captcha & Submit */}
                <div className="mt-6">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        {[0, 1, 2, 3].map((index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                className="w-12 h-12 flex items-center justify-center border-2 border-gray-300 bg-white text-2xl font-bold text-gray-700 text-center focus:outline-none focus:border-gray-400"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const newCaptcha = formData.captchaInput.split('');
                                    newCaptcha[index] = value;
                                    const updatedCaptcha = newCaptcha.join('');
                                    setFormData(prev => ({ ...prev, captchaInput: updatedCaptcha }));
                                    
                                    // Move to next input if value entered
                                    if (value && index < 3) {
                                        const nextInput = e.target.parentElement.children[index + 1];
                                        if (nextInput) nextInput.focus();
                                    }
                                }}
                                onKeyDown={(e) => {
                                    // Move to previous input on backspace if empty
                                    if (e.key === 'Backspace' && !e.target.value && index > 0) {
                                        const prevInput = e.target.parentElement.children[index - 1];
                                        if (prevInput) prevInput.focus();
                                    }
                                }}
                                value={formData.captchaInput[index] || ''}
                            />
                        ))}

                        <div className="bg-[#5a7a99] text-white px-8 h-12 flex items-center justify-center rounded text-2xl font-bold tracking-wider select-none">
                            {captcha}
                        </div>

                        <button
                            type="submit"
                            className="bg-gradient-to-r from-[#20c997] to-[#17a589] hover:from-[#1ab386] hover:to-[#138f73] text-white px-10 h-12 font-bold flex items-center gap-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 uppercase ml-auto"
                        >
                            Submit <FaLongArrowAltRight />
                        </button>
                    </div>

                    {errors.captcha && <p className="text-xs text-red-500 mb-2">{errors.captcha}</p>}

                    <p className="text-sm text-red-500">(*) represents mandatory fields</p>
                </div>
            </div>
        </form>
    );
};

export default ScholarshipForm;
