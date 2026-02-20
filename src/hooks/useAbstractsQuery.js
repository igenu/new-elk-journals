import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { abstractSubmissionApi, editorApi } from '../services/api';

const POLLING_INTERVAL = 5000; // 5 seconds

/**
 * Custom hook for fetching abstracts with automatic polling
 * Provides real-time updates by refetching at regular intervals
 */
export const useAbstractsQuery = (conferenceId, enabled = true) => {
    return useQuery({
        queryKey: ['abstracts', conferenceId],
        queryFn: async () => {
            const response = await abstractSubmissionApi.getByConference(conferenceId);
            if (response.data && response.data.success) {
                return response.data.data;
            }
            return [];
        },
        enabled: enabled && !!conferenceId,
        refetchInterval: enabled ? POLLING_INTERVAL : false,
        refetchIntervalInBackground: false,
        staleTime: 0,
    });
};

/**
 * Custom hook for fetching editors list (Legacy - all approved editors)
 */
export const useEditorsQuery = (enabled = true) => {
    return useQuery({
        queryKey: ['editors'],
        queryFn: async () => {
            const response = await editorApi.getEditors();
            if (response.data && response.data.success) {
                return response.data.data;
            }
            return [];
        },
        enabled,
        staleTime: 5 * 60 * 1000, // Editors list is stable, cache for 5 minutes
    });
};

/**
 * Custom hook for fetching general editors (Stage 1 abstract assignment)
 * These are approved, active editors NOT linked to any conference
 */
export const useGeneralEditorsQuery = (enabled = true) => {
    return useQuery({
        queryKey: ['generalEditors'],
        queryFn: async () => {
            const response = await editorApi.getGeneralEditors();
            if (response.data && response.data.success) {
                return response.data.data;
            }
            return [];
        },
        enabled,
        staleTime: 5 * 60 * 1000,
    });
};

/**
 * Custom hook for fetching conference-specific editors (Stage 2 abstract assignment)
 * These are approved, active editors linked to the specific conference
 */
export const useConferenceEditorsQuery = (conferenceId, enabled = true) => {
    return useQuery({
        queryKey: ['conferenceEditors', conferenceId],
        queryFn: async () => {
            const response = await editorApi.getConferenceEditors(conferenceId);
            if (response.data && response.data.success) {
                return response.data.data;
            }
            return [];
        },
        enabled: enabled && !!conferenceId,
        staleTime: 5 * 60 * 1000,
    });
};

/**
 * Mutation hook for assigning editor to abstract
 */
export const useAssignEditorMutation = (conferenceId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ abstractId, editorId }) => {
            const response = await abstractSubmissionApi.assignEditor(abstractId, editorId);
            return response.data;
        },
        onSuccess: (data) => {
            if (data && data.success) {
                queryClient.setQueryData(['abstracts', conferenceId], (oldData) => {
                    if (!oldData) return oldData;
                    return oldData.map((a) => (a.id === data.data.id ? data.data : a));
                });
            }
        },
    });
};

/**
 * Mutation hook for assigning conference editor to abstract
 */
export const useAssignConferenceEditorMutation = (conferenceId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ abstractId, editorId }) => {
            const response = await abstractSubmissionApi.assignConferenceEditor(abstractId, editorId);
            return response.data;
        },
        onSuccess: (data) => {
            if (data && data.success) {
                queryClient.setQueryData(['abstracts', conferenceId], (oldData) => {
                    if (!oldData) return oldData;
                    return oldData.map((a) => (a.id === data.data.id ? data.data : a));
                });
            }
        },
    });
};

/**
 * Mutation hook for admin final decision (accept/reject)
 */
export const useAdminDecisionMutation = (conferenceId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ abstractId, action, comment }) => {
            const response = await abstractSubmissionApi.adminDecision(abstractId, action, comment);
            return response.data;
        },
        onSuccess: (data) => {
            if (data && data.success) {
                queryClient.setQueryData(['abstracts', conferenceId], (oldData) => {
                    if (!oldData) return oldData;
                    return oldData.map((a) => (a.id === data.data.id ? data.data : a));
                });
            }
        },
    });
};

// ============================================
// Editor-specific hooks
// ============================================

/**
 * Custom hook for fetching abstracts assigned to editor with automatic polling
 * Provides real-time updates for the editor's review page
 */
export const useEditorAssignedAbstractsQuery = (enabled = true) => {
    return useQuery({
        queryKey: ['editorAssignedAbstracts'],
        queryFn: async () => {
            const response = await abstractSubmissionApi.getEditorAssigned();
            if (response.data && response.data.success) {
                return response.data.data;
            }
            return [];
        },
        enabled,
        refetchInterval: enabled ? POLLING_INTERVAL : false,
        refetchIntervalInBackground: false,
        staleTime: 0,
    });
};

/**
 * Mutation hook for editor review (accept/reject)
 */
export const useEditorReviewMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ abstractId, action, comment }) => {
            const response = await abstractSubmissionApi.editorReview(abstractId, action, comment);
            return response.data;
        },
        onSuccess: (data) => {
            if (data && data.success) {
                queryClient.setQueryData(['editorAssignedAbstracts'], (oldData) => {
                    if (!oldData) return oldData;
                    return oldData.map((a) => (a.id === data.data.id ? data.data : a));
                });
            }
        },
    });
};
