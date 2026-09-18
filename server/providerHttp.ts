import axios from 'axios'

// Never propagate a provider request configuration, which contains server credentials.
const providerHttp = axios.create({
    timeout: 10000,
    maxContentLength: 2 * 1024 * 1024,
    maxRedirects: 0,
})
providerHttp.interceptors.response.use(
    response => response,
    () => {
        throw new Error('The movie information provider is unavailable.')
    }
)
export default providerHttp
