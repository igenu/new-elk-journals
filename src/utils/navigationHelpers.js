import { getRole } from './secureStorage';

/**
 * Get the appropriate submit manuscript URL based on user authentication state
 * @returns {string} The URL to redirect to
 */
export const getSubmitManuscriptUrl = () => {
    const token = localStorage.getItem('token');
    const role = getRole();

    // If user is logged in as author, redirect to dashboard
    if (token && role === 'author') {
        return '/dashboard/submit-manuscript';
    }

    // Otherwise, redirect to website page
    return '/submit-manuscript';
};
