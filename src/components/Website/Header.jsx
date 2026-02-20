import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { journalCategoryApi } from "../../services/api";
import {
  FaChevronCircleRight,
  FaLongArrowAltRight,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaChartLine,
  FaMoneyBillWave,
  FaUsers,
  FaSitemap,
  FaLaptopCode,
  FaLightbulb,
  FaBuilding,
  FaCogs,
  FaThermometerHalf,
  FaMicrochip,
  FaBook,
  FaProjectDiagram,
  FaIndustry,
  FaUserCircle,
} from "react-icons/fa";
import Logo from "../../assets/images/elk-logo.png";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const timeoutRef = useRef(null);
  const location = useLocation();

  // Check if user is logged in - reactive state that updates on route changes
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userName, setUserName] = useState("");

  // Re-check login status whenever route changes or localStorage updates
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);

      // Get user name if logged in
      if (token) {
        try {
          const userStr = localStorage.getItem("user");
          if (userStr) {
            const user = JSON.parse(userStr);
            setUserName(user?.firstName || "");
          }
        } catch (e) {
          console.log("Error parsing user from localStorage", e);
          setUserName("");
        }
      } else {
        setUserName("");
      }
    };

    // Check on route change
    checkLoginStatus();

    // Listen for storage changes (in case of logout from another tab)
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, [location.pathname]);

  const toggleDropdown = (dropdownName) => {
    if (activeDropdown === dropdownName) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdownName);
    }
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const handleLinkClick = () => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const [headerJournals, setHeaderJournals] = useState([]);

  useEffect(() => {
    const fetchHeaderJournals = async () => {
      try {
        const response = await journalCategoryApi.getWithJournals();
        if (response.data && Array.isArray(response.data)) {
          const journals = [];
          response.data.forEach((cat) => {
            if (cat.journals && Array.isArray(cat.journals)) {
              cat.journals.forEach((journal) => {
                const route =
                  cat.route ||
                  journal.title
                    .toLowerCase()
                    .replace(/ /g, "-")
                    .replace(/[^\w-]+/g, "");
                journals.push({
                  title: cat.title,
                  issn: journal.print_issn || journal.e_issn || "N/A",
                  impactFactor: "N/A",
                  link: `/journals/${route}`,
                  icon: <FaBook />,
                });
              });
            }
          });
          setHeaderJournals(journals);
        }
      } catch (error) {
        console.error("Failed to fetch header journals", error);
      }
    };
    fetchHeaderJournals();
  }, []);

  const menuItems = [
    {
      id: "home",
      label: "HOME",
      link: "/",
      type: "link",
    },
    {
      id: "about",
      label: "ABOUT ELK",
      type: "dropdown",
      layout: "about",
      data: {
        main: [
          {
            title: "PUBLISHING POLICIES",
            links: [
              {
                label: "Open Access & Licencing",
                to: "/open-access-and-licencing",
              },
              { label: "Ethical Guidelines", to: "/ethical-guidelines" },
            ],
          },
          {
            title: "IMPACT FACTOR SCORE",
            links: [
              { label: "Impact Factor", to: "/impact-factor" },
              { label: "Journal Indexing", to: "/journal-indexing" },
            ],
          },
        ],
        side: [
          { label: "MEET OUR TEAM", to: "/meet-our-team" },
          { label: "WHY PUBLISH WITH US?", to: "/why-publish-with-us" },
        ],
      },
    },
    {
      id: "journals",
      label: "JOURNALS WE PUBLISH",
      type: "dropdown",
      layout: "journals",
      data: headerJournals,
    },
    {
      id: "authors",
      label: "AUTHORS AREA",
      type: "dropdown",
      layout: "simple",
      data: [
        { label: "Browse Journals", to: "/browse-journals" },
        { label: "Author's Guidelines", to: "/authors-guidelines" },
        { label: "Resources", to: "/resources" },
        { label: "View Call for Papers", to: "/view-call-for-papers" },
        {
          label: "Article Processing Charges",
          to: "/article-processing-charges",
        },
      ],
    },
    {
      id: "conference",
      label: "CONFERENCE SOLUTIONS",
      link: "/conferences",
      type: "link",
    },
    {
      id: "editor",
      label: "Become An Editor",
      link: "/become-an-editor",
      type: "link",
      mobileOnly: true,
    },
  ];

  return (
    <header className="shadow-lg z-50 border-b border-[#1e3550]">
      <div className="">
        <nav>
          <div  className="flex items-center justify-between py-2 w-full px-[15px] mx-auto min-h-full max-w-6xl relative">
            <div className="flex-shrink-0">
              <Link to="/" className="block transition-opacity hover:opacity-90 ">
                <img src={Logo} alt="Logo" className="h-auto w-[150px]  bg-[#2c4a6e] p-3 rounded" />
              </Link>
            </div>
            
            
            <button
              className="lg:hidden text-white hover:text-gray-200 focus:outline-none transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
            <div className="hidden lg:block">
              <div className="flex justify-end">
                <ul className="flex space-x-3 text-[13px]">
                  {!isLoggedIn && (
                    <li>
                      <Link
                        to="/become-an-editor"
                        className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md flex items-center gap-1.5 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                      >
                        Become An Editor{" "}
                        <FaChevronCircleRight className="text-[11px]" />
                      </Link>
                    </li>
                  )}
                  <li>
                    {isLoggedIn ? (
                      <Link
                        to="/dashboard"
                        className="bg-[#1e3550] hover:bg-[#152943] border border-white/20 text-white px-5 py-2 rounded-md flex items-center gap-2 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                      >
                        <FaUserCircle className="text-[16px]" />
                        {userName ? `Welcome ${userName}` : "Dashboard"}
                      </Link>
                    ) : (
                      <Link
                        to="/login"
                        className="bg-[#1e3550] hover:bg-[#152943] border border-white/20 text-white px-6 py-2 rounded-md flex items-center gap-1 transition-all duration-200 uppercase font-medium shadow-sm hover:shadow-md"
                      >
                        Login
                      </Link>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="hidden lg:block bg-[#2c4a6e]  py-4">
            <ul className="flex items-center space-x-7 w-full px-[15px] mx-auto min-h-full max-w-6xl relative">
              {menuItems
                .filter((item) => !item.mobileOnly)
                .map((item) => (
                  <li
                    key={item.id}
                    className={item.type === "dropdown" ? "group " : ""}
                    onMouseEnter={
                      item.type === "dropdown" ? handleMouseEnter : undefined
                    }
                    onMouseLeave={
                      item.type === "dropdown" ? handleMouseLeave : undefined
                    }
                  >
                    {item.type === "link" ? (
                      <Link
                        to={item.link}
                        className="text-white hover:text-gray-200 font-medium uppercase text-[13px] tracking-wide transition-colors duration-200"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <>
                        <button
                          onClick={() => toggleDropdown(item.id)}
                          className={`font-medium flex items-center gap-1.5 uppercase text-[13px] tracking-wide focus:outline-none transition-colors duration-200 ${
                            activeDropdown === item.id
                              ? item.id === "about"
                                ? "text-[#45cbb2]"
                                : "text-[#45cbb2]"
                              : "text-white hover:text-gray-200"
                          }`}
                        >
                          {item.label} <FaChevronDown className="text-[10px]" />
                        </button>

                        
                        <div
                          style={{ marginTop: "20px" }}
                          className={`absolute left-0 top-full w-full bg-white shadow-2xl transition-all duration-300 z-50 max-h-[80vh] overflow-y-auto  mx-[15px] ${
                            item.id === "about"
                              ? "border-[#45cbb2]"
                              : "border-[#2c4a6e]"
                          } ${
                            activeDropdown === item.id
                              ? "opacity-100 visible translate-y-0"
                              : "opacity-0 invisible -translate-y-2"
                          }`}
                        >
                          
                          {item.layout === "about" && (
                            <div className="flex">
                              <div className="w-2/3 p-6 grid grid-cols-2 gap-10 bg-gray-50">
                                {item.data.main.map((section, idx) => (
                                  <div key={idx}>
                                    <h3 className="font-bold text-[#1e3a5f]  uppercase text-[13px] tracking-wider border-b-2 border-[#45cbb2] pb-2 inline-block">
                                      {section.title}
                                    </h3>
                                    <div className="space-y-2 mt-4">
                                      {section.links.map((link, lIdx) => (
                                        <Link
                                          key={lIdx}
                                          to={link.to}
                                          onClick={handleLinkClick}
                                          className="block bg-gray-200 hover:bg-[#2c4a6e] hover:text-white px-5 py-3 transition-all duration-200 text-[13px] text-[#1e3a5f] rounded-md shadow-sm hover:shadow-md hover:translate-x-1"
                                        >
                                          {link.label}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="w-1/3 bg-gradient-to-br from-[#45cbb2] to-[#34a892] p-6 flex flex-col justify-center space-y-4">
                                {item.data.side.map((link, idx) => (
                                  <Link
                                    key={idx}
                                    to={link.to}
                                    onClick={handleLinkClick}
                                    className="block bg-[#1e3a5f] hover:bg-[#152943] text-white px-5 py-4 transition-all duration-200 shadow-lg hover:shadow-xl group/btn rounded-md"
                                  >
                                    <div className="flex items-center justify-between uppercase text-[13px] font-semibold tracking-wide">
                                      <span>{link.label}</span>
                                      <FaLongArrowAltRight className="text-[16px] group-hover/btn:translate-x-2 transition-transform duration-200" />
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                          
                          {item.layout === "journals" && (
                            <div className="p-6 bg-gray-50">
                              <div className="grid grid-cols-3 gap-6">
                                {item.data.map((journal, index) => (
                                  <div
                                    key={index}
                                    className="bg-white p-5 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 group/journal hover:bg-[#2c4a6e] border border-gray-200 hover:border-[#2c4a6e]"
                                  >
                                    <Link
                                      to={journal.link}
                                      onClick={handleLinkClick}
                                      className="block"
                                    >
                                      <div className="flex items-start gap-3">
                                        <span className="text-[22px] text-[#2c4a6e] mt-1 group-hover/journal:text-white transition-colors duration-200">
                                          {journal.icon}
                                        </span>
                                        <div className="flex-1">
                                          <strong className="text-[#204066] text-[13px] block mb-2 group-hover/journal:text-white transition-colors duration-200 leading-relaxed">
                                            {journal.title}
                                          </strong>
                                          <div className="text-[12px] text-gray-600 group-hover/journal:text-gray-200 transition-colors duration-200 mb-1">
                                            ISSN No: {journal.issn}
                                          </div>
                                          <div className="text-[12px] text-gray-600 group-hover/journal:text-gray-200 transition-colors duration-200">
                                            JD Impact factor:{" "}
                                            {journal.impactFactor}
                                          </div>
                                        </div>
                                      </div>
                                    </Link>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          
                          {item.layout === "simple" && (
                            <div className="p-6 bg-gray-50">
                              <div className="grid grid-cols-3 gap-5">
                                {item.data.map((link, idx) => (
                                  <Link
                                    key={idx}
                                    to={link.to}
                                    onClick={handleLinkClick}
                                    className="block bg-white hover:bg-[#2c4a6e] px-4 py-3 rounded-lg transition-all duration-200 text-center group/author shadow-md hover:shadow-xl border border-gray-200 hover:border-[#2c4a6e]"
                                  >
                                    <span className="text-[#2c4a6e] text-[13px] font-semibold group-hover/author:text-white transition-colors duration-200">
                                      {link.label}
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                          
                          {item.layout === "conference" && (
                            <div className="flex w-full">
                              <div className="w-2/3 p-10 bg-gray-50">
                                <h3 className="font-bold text-[#1e3a5f] mb-5 uppercase text-[13px] tracking-wider border-b-2 border-[#2c4a6e] pb-2 inline-block">
                                  CONFERENCES
                                </h3>
                                <div className="grid grid-cols-2 gap-5 mt-5">
                                  {item.data.links.map((link, idx) => (
                                    <Link
                                      key={idx}
                                      to={link.to}
                                      onClick={handleLinkClick}
                                      className="block bg-white hover:bg-[#2c4a6e] hover:text-white px-5 py-4 transition-all duration-200 text-[13px] text-[#1e3a5f] text-center font-medium rounded-md shadow-sm hover:shadow-md"
                                    >
                                      {link.label}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                              <div className="w-1/3 bg-gradient-to-br from-[#45cbb2] to-[#34a892] p-10 flex flex-col justify-center items-center">
                                <Link
                                  to={item.data.cta.to}
                                  onClick={handleLinkClick}
                                  className="w-full bg-[#1e3a5f] hover:bg-[#152943] text-white px-6 py-5 transition-all duration-200 shadow-lg hover:shadow-xl group/btn flex items-center justify-between uppercase text-[13px] font-bold tracking-wider rounded-md"
                                >
                                  {item.data.cta.label}
                                  <FaLongArrowAltRight className="text-[20px] group-hover/btn:translate-x-2 transition-transform duration-200" />
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        </nav>

        
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#2c4a6e] border-t border-[#1e3550] pb-4">
            <ul className="space-y-2 mt-4">
              {menuItems.map((item) => (
                <li key={item.id}>
                  {item.type === "link" ? (
                    <Link
                      to={item.link}
                      onClick={handleLinkClick}
                      className="block px-4 py-3 text-white hover:bg-[#3a5a8e] transition-colors duration-200 text-[13px] font-medium rounded-md mx-2"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleDropdown(item.id)}
                        className="w-full text-left px-4 py-3 text-white hover:bg-[#3a5a8e] flex items-center justify-between transition-colors duration-200 text-[13px] font-medium rounded-md mx-2"
                      >
                        {item.label}
                        <FaChevronDown
                          className={`text-[10px] transition-transform duration-200 ${
                            activeDropdown === item.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {activeDropdown === item.id && (
                        <div className="bg-[#3a5a8e] px-6 py-3 space-y-2 max-h-64 overflow-y-auto mx-2 rounded-md mt-1 shadow-inner">
                          
                          {item.layout === "about" && (
                            <>
                              {item.data.side.map((link, idx) => (
                                <Link
                                  key={`side-${idx}`}
                                  to={link.to}
                                  onClick={handleLinkClick}
                                  className="block py-2 text-gray-200 hover:text-white transition-colors duration-200 text-[13px]"
                                >
                                  {link.label}
                                </Link>
                              ))}
                              {item.data.main.map((section, idx) => (
                                <React.Fragment key={`main-${idx}`}>
                                  {section.links.map((link, lIdx) => (
                                    <Link
                                      key={lIdx}
                                      to={link.to}
                                      onClick={handleLinkClick}
                                      className="block py-2 text-gray-200 hover:text-white transition-colors duration-200 text-[13px]"
                                    >
                                      {link.label}
                                    </Link>
                                  ))}
                                </React.Fragment>
                              ))}
                            </>
                          )}
                          
                          {item.layout === "journals" &&
                            item.data.map((journal, idx) => (
                              <Link
                                key={idx}
                                to={journal.link}
                                onClick={handleLinkClick}
                                className="block py-2 text-gray-200 hover:text-white text-[13px] transition-colors duration-200"
                              >
                                {journal.title}
                              </Link>
                            ))}
                          
                          {item.layout === "simple" &&
                            item.data.map((link, idx) => (
                              <Link
                                key={idx}
                                to={link.to}
                                onClick={handleLinkClick}
                                className="block py-2 text-gray-200 hover:text-white transition-colors duration-200 text-[13px]"
                              >
                                {link.label}
                              </Link>
                            ))}
                          
                          {item.layout === "conference" && (
                            <div className="space-y-2">
                              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pt-2">
                                Conferences
                              </div>
                              {item.data.links.map((link, idx) => (
                                <Link
                                  key={idx}
                                  to={link.to}
                                  onClick={handleLinkClick}
                                  className="block py-2 text-gray-200 hover:text-white pl-3 border-l-2 border-transparent hover:border-[#45cbb2] transition-all duration-200 text-[13px]"
                                >
                                  {link.label}
                                </Link>
                              ))}
                              <div className="pt-3">
                                <Link
                                  to={item.data.cta.to}
                                  onClick={handleLinkClick}
                                  className="block bg-[#45cbb2] text-[#1e3a5f] py-3 px-4 text-center font-bold uppercase text-[13px] hover:bg-[#34a892] transition-all duration-200 rounded-md shadow-md"
                                >
                                  {item.data.cta.label}
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </li>
              ))}
              
              <li className="px-4 pt-4 border-t border-[#1e3550] mt-3">
                {isLoggedIn ? (
                  <Link
                    to="/dashboard"
                    onClick={handleLinkClick}
                    className="block bg-[#1e3550] hover:bg-[#152943] text-white py-3 px-4 rounded-md text-center font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-md text-[13px]"
                  >
                    <FaUserCircle className="text-[16px]" />
                    {userName ? `Welcome ${userName}` : "Dashboard"}
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={handleLinkClick}
                    className="block bg-[#1e3550] hover:bg-[#152943] text-white py-3 px-4 rounded-md text-center uppercase font-medium transition-all duration-200 shadow-md text-[13px]"
                  >
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;