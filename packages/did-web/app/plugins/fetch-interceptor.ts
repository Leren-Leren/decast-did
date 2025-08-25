// plugins/fetch-interceptor.ts
export default defineNuxtPlugin((nuxtApp) => {
    const authStore = useAuthStore(); // your auth store

    // Create a wrapper for $fetch
    const customFetch = async (url: string, options?: any) => {
        try {
            const response = await $fetch(url, options);
            return response;
        } catch (error: any) {
            if (error?.response?.status === 401) {
                // Call logout function
                authStore.clearTokens?.(); // or however you define logout
                // Refresh the page
                if (process.client) {
                    window.location.reload();
                }
                // Stop execution
                return;
            }
            throw error;
        }
    };

    // Make it available globally
    nuxtApp.provide('customFetch', customFetch);
});
