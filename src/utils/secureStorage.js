import CryptoJS from 'crypto-js';

const SECRET_KEY = 'client-secret-key-123'; // In production, use env variable

export const setRole = (role) => {
    const ciphertext = CryptoJS.AES.encrypt(role, SECRET_KEY).toString();
    localStorage.setItem('role', ciphertext);
};

export const getRole = () => {
    const ciphertext = localStorage.getItem('role');
    if (!ciphertext) return 'guest';
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText || 'guest';
    } catch (e) {
        return 'guest';
    }
};

export const clearRole = () => {
    localStorage.removeItem('role');
};

// Permissions management
export const setPermissions = (permissions) => {
    if (!permissions || !Array.isArray(permissions)) {
        localStorage.setItem('permissions', JSON.stringify([]));
        return;
    }
    const permString = JSON.stringify(permissions);
    const ciphertext = CryptoJS.AES.encrypt(permString, SECRET_KEY).toString();
    localStorage.setItem('permissions', ciphertext);
};

export const getPermissions = () => {
    const ciphertext = localStorage.getItem('permissions');
    if (!ciphertext) return [];
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedText) || [];
    } catch (e) {
        return [];
    }
};

export const clearPermissions = () => {
    localStorage.removeItem('permissions');
};

// Check if user has a specific permission
export const hasPermission = (permissionId) => {
    const role = getRole();

    // Admin and super_admin have all permissions
    if (role === 'admin' || role === 'super_admin') {
        return true;
    }

    const permissions = getPermissions();
    return permissions.includes(permissionId) ||
        permissions.some(perm => {
            if (typeof perm === 'object') {
                return perm.id === permissionId;
            }
            return perm === permissionId;
        });
};

// Check if user has any of the specified permissions
export const hasAnyPermission = (permissionIds) => {
    const role = getRole();

    // Admin and super_admin have all permissions
    if (role === 'admin' || role === 'super_admin') {
        return true;
    }

    const permissions = getPermissions();
    return permissionIds.some(permId =>
        permissions.includes(permId) ||
        permissions.some(perm => {
            if (typeof perm === 'object') {
                return perm.id === permId;
            }
            return perm === permId;
        })
    );
};

// Check if user is an admin-level user (admin, super_admin, subadmin)
export const isAdminLevel = () => {
    const role = getRole();
    return ['admin', 'super_admin', 'subadmin'].includes(role);
};

// Check if user is a full admin (admin or super_admin, not subadmin)
export const isFullAdmin = () => {
    const role = getRole();
    return ['admin', 'super_admin'].includes(role);
};

// Clear all auth data
export const clearAuthData = () => {
    clearRole();
    clearPermissions();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('email_trigger');
};
