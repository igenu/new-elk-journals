import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { journalApi } from "../../services/api";
import { Spin } from "antd";
import moment from "moment";
import { generateConferenceUrl } from "../../utils/idEncryption";
import axios from "axios";
import { scriptUrl } from "../../services/serviceApi";

const ConferenceList = ({ type }) => {
  const [templates, setTemplates] = useState([]);
  const [upcomingTemplates, setUpcomingTemplates] = useState([]);
  const [previousTemplates, setPreviousTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [journals, setJournals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Conferences
        const response = await axios.get(
          `${scriptUrl}api/conferences/template`,
        );

        let data = [];
        if (response.data && response.data.success) {
          if (Array.isArray(response.data.success)) {
            data = response.data.success;
          } else {
            data = [response.data.success];
          }
        }

        const today = moment().startOf("day");

        const upcoming = [];
        const previous = [];

        data.forEach((item) => {
          const startDateStr = item.conference?.start_date;
          if (!startDateStr) return;

          const startDate = moment(startDateStr);
          if (startDate.isSameOrAfter(today)) {
            upcoming.push(item);
          } else {
            previous.push(item);
          }
        });

        upcoming.sort((a, b) => {
          const dateA = moment(a.conference?.start_date || 0);
          const dateB = moment(b.conference?.start_date || 0);
          return dateA - dateB;
        });

        previous.sort((a, b) => {
          const dateA = moment(a.conference?.start_date || 0);
          const dateB = moment(b.conference?.start_date || 0);
          return dateB - dateA;
        });

        setUpcomingTemplates(upcoming);
        setPreviousTemplates(previous);

        if (type === "upcoming") {
          setTemplates(upcoming);
        } else if (type === "previous") {
          setTemplates(previous);
        } else {
          setTemplates([...upcoming, ...previous]);
        }

        // Fetch Journals
        const journalResponse = await journalApi.getAll({
          skipAuthRedirect: true,
        });
        if (journalResponse.data && journalResponse.data.success) {
          setJournals(journalResponse.data.success);
        } else if (Array.isArray(journalResponse.data)) {
          // Fallback if structure is different
          setJournals(journalResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  // Parse helper just in case some fields are JSON strings or objects
  //   const parseField = (field) => {
  //     if (!field) return null;
  //     if (typeof field === "string") {
  //       try {
  //         return JSON.parse(field);
  //       } catch (e) {
  //         return null;
  //       }
  //     }
  //     return field;
  //   };

  const getDateDisplay = (item, specificType) => {
    const startDateStr = item.conference?.start_date;
    const currentType = specificType || type;
    const labelText = currentType === "upcoming" ? "UPCOMING" : "PREVIOUS";

    if (!startDateStr) return { dateStr: "Date TBA", label: labelText };

    const start = moment(startDateStr);
    const dateStr = start.format("DD MMM YYYY").toUpperCase();

    return {
      dateStr: dateStr,
      label: labelText,
    };
  };

  // const getVenueName = (item) => {
  //     const venue = parseField(item.venue);
  //     return venue?.name || item.conference?.organized_by || "Venue To Be Announced";
  // };

  const renderConferenceList = (
    items,
    listType,
    title,
    forceShowEmpty = false,
  ) => {
    if (items.length === 0) {
      if (type !== "all" || forceShowEmpty) {
        return (
          <div className="text-center py-20 px-6 bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl shadow-xl border-2 border-gray-200 hover:shadow-2xl transition-all duration-300">
            <div className="flex justify-center mb-6">
              <div className="text-6xl mb-4 animate-bounce">📭</div>
            </div>
            <h2 className="text-2xl font-bold text-[#204066] mb-3">
              No {title} Available
            </h2>
            <p className="text-gray-600 text-lg max-w-md mx-auto mb-2">
              We don't have any {title.toLowerCase()} listed at the moment.
            </p>
            <p className="text-[#12b48b] font-semibold mb-8">
              ⏰ Check back later for exciting updates!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-block bg-gradient-to-r from-[#12b48b] to-[#0e9673] hover:from-[#0e9673] hover:to-[#0a7857] text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                ← Back to Home
              </Link>
              <a
                href="mailto:info@elkjournals.com"
                className="inline-block bg-gradient-to-r from-[#204066] to-[#1a3352] hover:from-[#1a3352] hover:to-[#12304a] text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                📧 Notify Me
              </a>
            </div>
          </div>
        );
      } else {
        return null;
      }
    }

    return (
      <div className="grid grid-cols-1 gap-6 mb-12">
        {items.map((item) => {
          const { dateStr, label } = getDateDisplay(item, listType);
          const venueName = item?.conference?.organized_by;
          const name = item.conference?.name || "Conference";

          return (
            <Link
              to={generateConferenceUrl(name, item?.conference_id)}
              key={item.id}
              className="block bg-white shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden flex flex-col md:flex-row min-h-[120px] rounded-xl border border-gray-200 hover:border-[#12b48b]/50 transform hover:scale-105"
            >
              {/* Left Date Box */}
              <div className="bg-gradient-to-br from-[#5c6e91] to-[#3d4f6f] text-white flex flex-col justify-center items-center text-center w-full md:w-64 flex-shrink-0 group-hover:from-[#12b48b] group-hover:to-[#0e9673] transition-all duration-300 relative p-6 rounded-xl md:rounded-none">
                <div className="text-sm font-bold mb-2 opacity-90 tracking-wide">
                  {dateStr}
                </div>
                <div className="text-2xl font-bold tracking-widest uppercase border-t border-white/30 pt-2 mt-2">
                  {label}
                </div>
              </div>

              {/* Right Content */}
              <div className="p-6 flex-grow flex flex-col justify-center bg-gradient-to-r from-white to-gray-50 group-hover:from-gray-50 group-hover:to-white transition-colors duration-300">
                <h2 className="text-xl font-bold text-[#202020] mb-2 leading-tight group-hover:text-[#12b48b] transition-colors font-sans capitalize">
                  {name}
                </h2>
                <div className="flex items-center gap-2 text-sm text-[#0097a7] font-medium">
                  <span className="text-lg">📍</span>
                  {venueName}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    );
  };

  const renderJournalList = () => {
    if (!journals || journals.length === 0) return null;

    return (
      <div className="mt-16">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-8 w-1.5 bg-[#12b48b] rounded-full"></div>
          <h1 className="text-2xl text-[#204066] font-bold tracking-tight">
            Our Journals
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {journals.map((journal) => (
            <div
              key={journal.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col h-full transform hover:-translate-y-1"
            >
              <div className="p-1 bg-gradient-to-r from-[#12b48b] to-[#204066] opacity-80 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-lg font-bold text-[#204066] mb-4 line-clamp-3 group-hover:text-[#12b48b] transition-colors min-h-[3.5rem]">
                  {journal.title}
                </h3>

                <div className="mt-auto space-y-3">
                  <div className="flex items-center justify-between text-sm bg-gray-50 p-2.5 rounded-lg group-hover:bg-[#12b48b]/5 transition-colors">
                    <span className="text-gray-500 font-medium">
                      Print ISSN
                    </span>
                    <span className="text-[#204066] font-mono font-semibold">
                      {journal.print_issn || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-gray-50 p-2.5 rounded-lg group-hover:bg-[#12b48b]/5 transition-colors">
                    <span className="text-gray-500 font-medium">E-ISSN</span>
                    <span className="text-[#204066] font-mono font-semibold">
                      {journal.e_issn || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Spin size="large" tip="Loading Content..." />
      </div>
    );
  }

  return (
    <div className="py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen font-sans">
      <div className="container mx-auto px-4">
        {type === "all" ? (
          <>
            <div className="mb-8">
              <h1 className="text-2xl text-[#12b48b] font-normal relative inline-block">
                Conferences
              </h1>
            </div>
            {upcomingTemplates.length === 0 &&
            previousTemplates.length === 0 ? (
              renderConferenceList([], "all", "Conferences", true)
            ) : (
              <>
                {renderConferenceList(
                  upcomingTemplates,
                  "upcoming",
                  "Upcoming Conferences",
                )}
                {upcomingTemplates.length > 0 &&
                  previousTemplates.length > 0 && <div className="mt-8"></div>}
                {renderConferenceList(
                  previousTemplates,
                  "previous",
                  "Previous Conferences",
                )}
              </>
            )}

            {/* Journals Section */}
            {renderJournalList()}
          </>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl text-[#12b48b] font-normal relative inline-block">
                {type === "upcoming"
                  ? "Upcoming Conferences"
                  : "Previous Conferences"}
              </h1>
            </div>
            {renderConferenceList(
              templates,
              type,
              type === "upcoming"
                ? "Upcoming Conferences"
                : "Previous Conferences",
            )}

            {/* Journals Display only if type is all? existing layout logic suggests separated pages. 
                            However user said "On the conference listing page". 
                            I'll add it here too if they navigate to specific types, but usually specific types are filter pages. 
                            Let's keep it in all for now as it makes the most sense as a "Landing" for conferences/journals.
                            Or maybe append it to the bottom of all views? 
                            I'll append it to all views logic if strictly requested, but standard UX suggests separating.
                            Limit to 'all' view for now based on code structure.
                        */}
          </>
        )}
      </div>
    </div>
  );
};

export default ConferenceList;
