import React, { useState, useEffect } from "react";
import { message } from "antd";
import JournalTable from "../components/JournalTable";
import { journalApi } from "../services/api";

const ViewJournal = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJournals = async () => {
    setLoading(true);
    try {
      const response = await journalApi.getAll();
      setJournals(response.data);
    } catch (error) {
      message.error("Failed to fetch journals");
    } finally {
      setLoading(false);
    }
  };

  const handleJournalDelete = (journalId) => {
    setJournals((prev) => prev.filter((journal) => journal.id !== journalId));
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Journals</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden p-4">
        <JournalTable journals={journals} onDelete={handleJournalDelete} />
      </div>
    </div>
  );
};

export default ViewJournal;
