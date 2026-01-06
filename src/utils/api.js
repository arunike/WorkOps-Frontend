import { getApiDomain } from './getApiDomain';

const defaultHeaders = {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
};

export const api = async (endpoint, options = {}) => {
    const domain = getApiDomain();
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${domain}${path}`;

    // Get user from local storage
    const storedUser = localStorage.getItem("user");
    let initialHeaders = { ...defaultHeaders };

    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            if (user && user.id) {
                initialHeaders['X-User-ID'] = String(user.id);
            }
        } catch (e) {
            console.error("Failed to parse user from local storage", e);
        }
    }

    const config = {
        ...options,
        headers: {
            ...initialHeaders,
            ...options.headers,
        }
    };

    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
        if (!config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json';
        }
        config.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || response.statusText);
    }

    if (response.status === 204) {
        return null;
    }

    try {
        const data = await response.json();
        return data;
    } catch (error) {
        return null;
    }
};
