/**
 * Mock Proposal API
 * Simulates API behavior for proposal request form submissions.
 * Stores data in localStorage for demonstration purposes.
 */

const STORAGE_KEY = 'elk_proposal_requests';

// Helper to simulate async delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get all proposals from localStorage
const getStoredProposals = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading proposals from localStorage:', error);
        return [];
    }
};

// Save proposals to localStorage
const saveProposals = (proposals) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals));
    } catch (error) {
        console.error('Error saving proposals to localStorage:', error);
    }
};

// Generate a unique ID
const generateId = () => {
    return `PROP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const proposalApi = {
    /**
     * Submit a new proposal request
     * @param {Object} data - Form data
     * @returns {Promise<Object>} - Created proposal with ID
     */
    create: async (data) => {
        await delay(800); // Simulate network delay

        const proposals = getStoredProposals();
        const newProposal = {
            id: generateId(),
            ...data,
            status: 'Pending',
            submittedAt: new Date().toISOString(),
        };

        proposals.push(newProposal);
        saveProposals(proposals);

        return {
            success: true,
            data: newProposal,
            message: 'Proposal request submitted successfully!',
        };
    },

    /**
     * Get all proposal requests
     * @returns {Promise<Array>} - All proposals
     */
    getAll: async () => {
        await delay(300);
        const proposals = getStoredProposals();
        return {
            success: true,
            data: proposals,
        };
    },

    /**
     * Get proposal by ID
     * @param {string} id - Proposal ID
     * @returns {Promise<Object>} - Proposal data
     */
    getById: async (id) => {
        await delay(300);
        const proposals = getStoredProposals();
        const proposal = proposals.find(p => p.id === id);

        if (!proposal) {
            throw new Error('Proposal not found');
        }

        return {
            success: true,
            data: proposal,
        };
    },

    /**
     * Delete a proposal
     * @param {string} id - Proposal ID
     * @returns {Promise<Object>} - Success response
     */
    delete: async (id) => {
        await delay(300);
        const proposals = getStoredProposals();
        const filteredProposals = proposals.filter(p => p.id !== id);
        saveProposals(filteredProposals);

        return {
            success: true,
            message: 'Proposal deleted successfully',
        };
    },
};

export default proposalApi;
