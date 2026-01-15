import Cookies from "js-cookie";
import { API } from "@/helpers"; // Adjust the import path to your API helper
import { toast } from "@/hooks/use-toast" // adjust if needed
import { ForgotPasswordPayload, ResetPasswordPayload, SignInFormType } from "@/types";
import axios from "axios";

export async function signInAdmin(data: SignInFormType, redirectPathname: string, router: any) {
   try {
      // 1️⃣ Login API
      const loginRes = await API.post(`/auth/admin/login`, data);

      if (loginRes?.status !== 201) {
         toast({
            variant: "destructive",
            title: "Login failed",
            description: "Invalid credentials",
         });
         return false;
      }

      const accessToken = loginRes?.data?.accessToken;

      // 2️⃣ Save token in cookie
      Cookies.set("accessToken", accessToken, {
         expires: 7,
         secure: true,
         sameSite: "strict",
      });

      // 3️⃣ Call profile API
      const profileRes = await API.post(`/admins/me`, {});

      if (!profileRes?.data) {
         throw new Error("Failed to fetch user profile");
      }

      // 4️⃣ Save profile in cookie (stringify if needed)
      Cookies.set("adminProfile", JSON.stringify(profileRes.data), {
         expires: 7,
         secure: true,
         sameSite: "strict",
      });

      // 5️⃣ Redirect after everything succeeds
      await router.push(redirectPathname);

      toast({
         title: "Login Successful",
         description: "Login Successful",
      });

      return true;
   } catch (error: any) {
      toast({
         variant: "destructive",
         title: "Error",
         description: error?.response?.data?.details?.message || error?.message || "Something went wrong. Please try again.",
      })
      return false
   }
}

export async function forgotPasswordAdmin(data: ForgotPasswordPayload) {

   try {
      const res = await API.post(`/auth/admin/forgot-password`, data)

      if (res?.status !== 201) {
         toast({
            variant: "destructive",
            title: "Request failed",
            description: "Unable to process forgot password request",
         })
         return false
      }

      toast({
         title: "Email sent",
         description: "Password reset link has been sent to your email",
      })

      return true
   } catch (error: any) {
      toast({
         variant: "destructive",
         title: "Error",
         description: error?.response?.data?.details?.message || error?.message || "Something went wrong. Please try again.",
      })
      return false
   }
}


export async function resetPasswordAdmin(data: ResetPasswordPayload, router: any, token: string | null) {
   try {
      // const res = await API.post(`/auth/admin/reset-password`, data)
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_FORM_URL}/auth/admin/reset-password`, data,
         {
            headers: {
               Authorization: `Bearer ${token}`,
               'x-api-key': `${process.env.NEXT_PUBLIC_API_FORM_x_API_KEY}` || '',
            },
         }
      )

      if (res?.status !== 201) {
         toast({
            variant: "destructive",
            title: "Reset failed",
            description: "Unable to reset password",
         })
         return false
      }
      Cookies.remove("accessToken")
      await router.push("/sign-in");
      toast({
         title: "Password updated",
         description: "Your password has been reset successfully",
      })

      return true
   } catch (error: any) {

      toast({
         variant: "destructive",
         title: "Error",
         description: error?.response?.data?.details?.message || error?.message || "Something went wrong. Please try again.",
      })
      return false
   }
}


export async function logoutAdmin() {
   try {
      const res = await API.post(`/auth/admin/logout`)

      if (res?.status !== 200 && res?.status !== 201) {
         toast({
            variant: "destructive",
            title: "Logout failed",
            description: "Unable to logout. Please try again.",
         })
         return false
      }

      // Clear stored auth data
      // Cookies.remove("accessToken")
      // Cookies.remove("adminProfile")
      Object.keys(Cookies.get()).forEach((cookieName) => {
         Cookies.remove(cookieName)
      })
      window.location.reload()
      toast({
         title: "Logged out",
         description: "You have been logged out successfully",
      })

      return true
   } catch (error: any) {
      toast({
         variant: "destructive",
         title: "Error",
         description: error?.response?.data?.details?.message || error?.message || "Something went wrong. Please try again.",
      })
      return false
   }
}

