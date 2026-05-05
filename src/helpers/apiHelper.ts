import { toast } from '@/hooks/use-toast';
import { STATUS_CODE } from '@/lib/enum';
import { devError } from '@/lib/utils';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { loaderManager } from '@/lib/loading-manager'; // 1. Import manager

const API_AXIOS = axios.create({
   baseURL: process.env.NEXT_PUBLIC_API_FORM_URL,
   timeout: 300000, // 5 minutes timeout (300,000ms)
   headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'x-api-key': `${process.env.NEXT_PUBLIC_API_FORM_x_API_KEY}` || '',
   },
});

// Request interceptor (Optional: Attach Authorization Token)

API_AXIOS.interceptors.request.use((config) => {
   const customConfig = config as any;
   
   if (!customConfig._noLoader) {
      loaderManager.setLoading(true);
   }
   
   return config;
}, (error) => {
   loaderManager.setLoading(false);
   return Promise.reject(error);
});

// Response interceptor to handle status codes globally
API_AXIOS.interceptors.response.use(
   (response) => {
      loaderManager.setLoading(false); // ✅ Success: Turn off
      return response;
   },
   (error: AxiosError<any>) => {
      loaderManager.setLoading(false);
      if (error?.response) {
         const { status, data } = error.response;

         const errorMessage = typeof data?.message === 'string' ? data.message.toLowerCase() : '';
         const detailsMessage = typeof data?.details?.message === 'string' ? data.details.message.toLowerCase() : '';
         const detailsError = typeof data?.details?.error === 'string' ? data.details.error.toLowerCase() : '';

         if (
            errorMessage.includes('token invalid') ||
            detailsMessage.includes('token invalid') ||
            detailsError.includes('token invalid')
         ) {
            devError('Token Invalid - Session Expired');
            Object.keys(Cookies.get()).forEach((cookieName) => {
               Cookies.remove(cookieName);
            });
            if (typeof window !== 'undefined') {
               window.location.href = '/sign-in';
            }
            return Promise.reject(error);
         }

         switch (status) {
            case STATUS_CODE.BAD_REQUEST:
               devError(`Bad Request: ${data?.message || ''}`);
               break;

            case STATUS_CODE.UNAUTHORIZED_USER:

               if (data?.details?.error === "UnauthorizedException") {
                  devError('Session Expired');
                  // toast.error('Unauthorized User');
                  Object.keys(Cookies.get()).forEach((cookieName) => {
                     Cookies.remove(cookieName);
                  });
                  if (typeof window !== 'undefined') {
                     window.location.href = '/sign-in'; // ✅ SSR safe
                  }
               }
               else {
                  devError('Session Expired');
                  // toast.error('Unauthorized User');
                  if (typeof window !== 'undefined') {
                     window.location.href = '/sign-in'; // ✅ SSR safe
                  }
               }
               break;

            case STATUS_CODE.FORBIDDEN:
               devError(`Forbidden: ${data?.message || ''}`);
               break;

            case STATUS_CODE.NOT_FOUND:
               devError(`Not Found: ${data?.message || ''}`);
               break;

            case STATUS_CODE.INTERNAL_SERVER_ERROR:
               devError('Internal Server Error!');
               break;

            default:
               devError(
                  `Error ${status}: ${data?.message || 'Something went wrong!'}`,
               );
         }
      } else {
         devError(`Network error: ${error.message}`);
      }

      return Promise.reject(error);
   },
);

export default API_AXIOS;
