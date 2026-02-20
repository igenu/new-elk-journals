import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import api, { conferenceApi } from "../../services/api";
import { setRole } from "../../utils/secureStorage";
import { FaTwitter } from "react-icons/fa"; // Assuming react-icons is available, or fallback to text
import "./AuthorLogin.css"; // specialized styles
import NewsWidget from "../../components/Website/NewsWidget";
import { generateConferenceUrl } from "../../utils/idEncryption";
import { getSubmitManuscriptUrl } from "../../utils/navigationHelpers";

const AuthorLogin = () => {
  const [loginRole, setLoginRole] = useState("author"); // 'author' or 'editor'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [upcomingConferences, setUpcomingConferences] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch upcoming conferences for the sidebar
    const fetchConferences = async () => {
      try {
        const response = await conferenceApi.getAll();
        if (
          response.data &&
          response.data.success &&
          Array.isArray(response.data.success)
        ) {
          // Filter for upcoming (future dates) and take top 5
          const upcoming = response.data.success
            .filter((c) => new Date(c.start_date) > new Date())
            .slice(0, 5);
          setUpcomingConferences(upcoming);
        }
      } catch (error) {
        console.error("Failed to fetch conferences", error);
      }
    };
    fetchConferences();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        const { token, user, role, email_trigger } = response.data.success; // Accessing nested success object as per prompt
        // Fallback if success object is not nested
        const tokenToStore = token || response.data.token;
        const userToStore = {
          ...(user || response.data.user || {}),
          email_trigger: email_trigger ?? response.data.email_trigger,
        };
        const roleToStore = role || response.data.role;
        const emailTriggerValue = email_trigger ?? response.data.email_trigger;

        localStorage.setItem("token", tokenToStore);
        localStorage.setItem("user", JSON.stringify(userToStore));
        if (emailTriggerValue !== undefined) {
          localStorage.setItem(
            "email_trigger",
            JSON.stringify(!!emailTriggerValue),
          );
        }
        setRole(roleToStore);

        Swal.fire({
          title: "Login Successful",
          text: "Redirecting to dashboard...",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        }).then(() => {
          navigate("/dashboard");
        });
      } else {
        Swal.fire({
          title: "Login Failed",
          text: response.data.error?.message || "Invalid credentials",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Login Error:", error);
      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Left Column: Login Form */}
      <div className="w-full md:w-3/4">
        <h1 className="text-3xl font-normal text-[#12b48b] mb-2 font-['Roboto',sans-serif]">
          ELK's Login
        </h1>
        {/* <div className="h-1 w-20 bg-[#12b48b] mb-6"></div> */}

        <p className="text-gray-600 mb-6 text-sm leading-relaxed text-justify">
          Login to your author or editor account, if you have already registered
          on the website. Registered authors can login for submitting their
          manuscripts or for tracking the status of their submitted articles. If
          you want to submit your manuscript, kindly register for an author
          profile and make your paper submission to the suitable journal.
        </p>
        <p className="text-gray-600 mb-8 text-sm leading-relaxed text-justify">
          Existing editorial board members can check in to their account for
          enhancing their public profile, contributing to the review process and
          participating in general discussions. For you wish to be amongst our
          member's board, click here to join and share your credentials.
        </p>

        <div className="bg-[#1f3f65] text-white p-3 mb-8">
          <h2 className="text-xl font-normal uppercase pl-2">Login</h2>
        </div>

        <div className="flex justify-center mb-6 items-center">
          <span className="mr-4 text-gray-500">I want to login as:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setLoginRole("author")}
              className={`px-6 py-2 rounded flex items-center ${loginRole === "author" ? "bg-[#7c7c7c] text-white" : "bg-gray-200 text-gray-500"}`}
            >
              <span
                className={`mr-2 ${loginRole === "author" ? "opacity-100" : "opacity-0"}`}
              >
                ✔
              </span>{" "}
              Author
            </button>
            <button
              type="button"
              onClick={() => setLoginRole("editor")}
              className={`px-6 py-2 rounded flex items-center ${loginRole === "editor" ? "bg-[#7c7c7c] text-white" : "bg-gray-200 text-gray-500"}`}
            >
              <span
                className={`mr-2 ${loginRole === "editor" ? "opacity-100" : "opacity-0"}`}
              >
                ✔
              </span>{" "}
              Editor
            </button>
          </div>
        </div>

        <div className="border border-gray-200 p-8 rounded-sm relative mt-4">
          <h3 className="absolute -top-3 left-4 bg-white px-2 text-[#12b48b] font-medium">
            Login Panel:
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center bg-gray-100 border border-gray-200 h-10">
                  <div className="w-10 flex items-center justify-center text-gray-500 border-r border-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="Email ID"
                    className="bg-transparent w-full px-3 outline-none text-gray-600 text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center bg-gray-100 border border-gray-200 h-10">
                  <div className="w-10 flex items-center justify-center text-gray-500 border-r border-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    placeholder="Password"
                    className="bg-transparent w-full px-3 outline-none text-gray-600 text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="flex justify-between items-center mt-6 border-t border-gray-200 pt-4">
          <div className="flex gap-4 text-sm text-[#204066] font-semibold">
            <Link
              to="/forget-password"
              className="flex items-center hover:underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.85.54-4.135v.001"
                />
              </svg>
              Find My Account
            </Link>
            <span>|</span>
            <Link
              to={getSubmitManuscriptUrl()}
              className="flex items-center hover:underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              Create Account
            </Link>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`bg-[#009b7c] hover:bg-[#007f65] text-white px-6 py-2 rounded flex items-center font-bold uppercase text-sm transition-colors ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Logging in..." : "LOGIN"}{" "}
            <span className="ml-2">→</span>
          </button>
        </div>
      </div>

      {/* Right Column: Sidebar */}
      <div className="w-full md:w-1/4">
        <NewsWidget />

        {/* <div className="mb-6">
                    <div className="bg-[#12b48b] text-white p-3 font-semibold uppercase text-sm tracking-wide">
                        UPCOMING <span className="font-light">CONFERENCES</span>
                    </div>
                    <div className="bg-white  shadow-sm border border-gray-100 p-2">
                        {upcomingConferences.length > 0 ? (
                            <ul className="space-y-3 mt-2">
                                {upcomingConferences.map((conf, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600 border-b border-gray-100 last:border-0 pb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                        </svg>
                                        <Link to={generateConferenceUrl(conf.name, conf.id)} className="hover:text-[#12b48b] transition-colors line-clamp-2">
                                            {conf.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-sm mt-2 p-2">No upcoming conferences.</p>
                        )}
                    </div>
                </div> */}
      </div>
    </div>
  );
};

export default AuthorLogin;
