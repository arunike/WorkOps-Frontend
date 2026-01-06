import { getApiDomain } from './getApiDomain';

const defaultHeaders = {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
};

export const api = async (endpoint, options = {}) => {
    const domain = getApiDomain();
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${domain}${path}`;

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
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
        // If response is not JSON (e.g. empty body 200 OK), return null or text
        return null;
    }
};
