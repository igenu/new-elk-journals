// Mock API for Editor Application Status Management
// Uses localStorage to persist data for demo purposes

const STORAGE_KEY = "editor_application_status";

// Get all status overrides from localStorage
const getStatusOverrides = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

// Save status overrides to localStorage
const saveStatusOverrides = (overrides) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
};

// Get status for a specific editor application
export const getEditorStatus = (editorId) => {
  const overrides = getStatusOverrides();
  return overrides[editorId] || null;
};

// Apply status overrides to editor data
export const applyStatusOverrides = (editor) => {
  const overrides = getStatusOverrides();
  if (overrides[editor.id]) {
    return { ...editor, ...overrides[editor.id] };
  }
  return editor;
};

// Apply status overrides to array of editors
export const applyStatusOverridesToList = (editors) => {
  return editors.map((editor) => applyStatusOverrides(editor));
};

// Mock API functions
export const mockEditorApi = {
  // Approve an editor application
  approve: (editorId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const overrides = getStatusOverrides();
        overrides[editorId] = {
          ...overrides[editorId],
          status: "approved",
          approvalStatus: "approved",
          updatedAt: new Date().toISOString(),
        };
        saveStatusOverrides(overrides);
        resolve({
          success: true,
          message: "Editor application approved successfully",
          data: overrides[editorId],
        });
      }, 500);
    });
  },

  // Reject an editor application
  reject: (editorId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const overrides = getStatusOverrides();
        overrides[editorId] = {
          ...overrides[editorId],
          status: "rejected",
          approvalStatus: "rejected",
          updatedAt: new Date().toISOString(),
        };
        saveStatusOverrides(overrides);
        resolve({
          success: true,
          message: "Editor application rejected successfully",
          data: overrides[editorId],
        });
      }, 500);
    });
  },

  // Activate an editor
  activate: (editorId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const overrides = getStatusOverrides();
        overrides[editorId] = {
          ...overrides[editorId],
          status: "active",
          isActive: true,
          updatedAt: new Date().toISOString(),
        };
        saveStatusOverrides(overrides);
        resolve({
          success: true,
          message: "Editor activated successfully",
          data: overrides[editorId],
        });
      }, 500);
    });
  },

  // Deactivate an editor
  deactivate: (editorId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const overrides = getStatusOverrides();
        overrides[editorId] = {
          ...overrides[editorId],
          status: "inactive",
          isActive: false,
          updatedAt: new Date().toISOString(),
        };
        saveStatusOverrides(overrides);
        resolve({
          success: true,
          message: "Editor deactivated successfully",
          data: overrides[editorId],
        });
      }, 500);
    });
  },

  // Clear all status overrides (for testing)
  clearAll: () => {
    localStorage.removeItem(STORAGE_KEY);
    return Promise.resolve({ success: true, message: "All status overrides cleared" });
  },
};

export default mockEditorApi;
