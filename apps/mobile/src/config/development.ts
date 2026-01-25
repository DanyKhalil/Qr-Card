// this file will now save the ip of my pc to use it on other ifles
export const DEVELOPMENT_CONFIG = {
    baseUrl: 'http://192.168.0.104:8081', // the url of the expo app
    backendBaseUrl: 'http://192.168.0.104:5050', // the url of the backend server
};

// this will get me the url used for qr code profile
export const getExpoDeepLink = (path: string) => {
    return `exp://${DEVELOPMENT_CONFIG.baseUrl.replace('http://', '')}/--${path}`;
};


export const getWebUrl = (path: string) => {
    return `${DEVELOPMENT_CONFIG.baseUrl}${path}`;
};