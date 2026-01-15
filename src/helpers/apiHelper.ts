import { toast } from '@/hooks/use-toast';
import { STATUS_CODE } from '@/lib/enum';
import { devError } from '@/lib/utils';
import axios, { AxiosError } from 'axios';


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

// Response interceptor to handle status codes globally
API_AXIOS.interceptors.response.use(
   (response) => response,
   (error: AxiosError<any>) => {
      if (error?.response) {
         const { status, data } = error.response;

         switch (status) {
            case STATUS_CODE.BAD_REQUEST:
               devError(`Bad Request: ${data?.message || ''}`);
               break;

            case STATUS_CODE.UNAUTHORIZED_USER:

               if (data?.details?.error === "UnauthorizedException") {
                  devError('Session Expired');
                  // toast.error('Unauthorized User');
               }
               else {
                  devError('Session Expired');
                  // toast.error('Unauthorized User');
                  if (typeof window !== 'undefined') {
                     window.location.href = '/login'; // ✅ SSR safe
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
