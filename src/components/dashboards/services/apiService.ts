/* eslint-disable @typescript-eslint/no-empty-object-type */
import { API } from "@/helpers"
import axios from "axios"
import Cookies from "js-cookie"

import { ProfileInfoFormType } from "@/app/[lang]/(dashboard-layout)/pages/account/types"

import { toast } from "@/hooks/use-toast"

const getCurrentDateUTCZero = () => new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';

export async function sendReinviteMail(email: string) {
  const body = {
    email: email,
  }
  try {
    const res = await API.post(`/auth/admin/activation/email/send`, body)

    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Activation failed",
        description: "Unable to send email ",
      })
      return false
    }
    toast({
      title: "Sent",
      description: "Re-Invitation email sent successfully.",
    })
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return false
  }
}

export async function registerAdminOrOwner(
  data: { email: string; name: string; phoneNumber: string },
  pathUrl: string
) {
  let role = pathUrl === "admins" ? "ADMIN" : "OWNER"
  let body = {
    email: data.email,
    name: data.name,
    phone: data.phoneNumber,
    role: role,
  }

  try {
    const res = await API.post(`/auth/admin/register`, body)

    if (res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Unable to process admin registration",
      })
      return false
    }

    toast({
      title: "Registration successful",
      description: "Admin user has been registered successfully",
    })

    return true
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return false
  }
}

export async function activateAdmin(token: string) {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_FORM_URL}/auth/admin/activate`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-api-key": `${process.env.NEXT_PUBLIC_API_FORM_x_API_KEY}` || "",
        },
      }
    )

    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Activation failed",
        description: "Unable to activate admin account",
      })
      return false
    }

    Cookies.set("adminActivationToken", res?.data?.token, {
      expires: 7,
      secure: true,
      sameSite: "strict",
    })
    Cookies.remove("accessToken")
    toast({
      title: "Account activated",
      description: "Admin account has been activated successfully",
    })

    return true
  } catch (error: any) {
    Cookies.remove("accessToken")
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return false
  }
}

export async function getAllAdminsOwners(
  page: number = 1,
  limit: number = 15,
  searchTerm: string = "",
  pathUrl: string = ""
) {
  let role = pathUrl === "admins" ? "ADMIN" : "OWNER"
  try {
    const res = await API.post(
      `admins/all?search=${searchTerm}&page=${page}&limit=${limit}&role=${role}`,
      {}
    )

    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Failed to load admins",
        description: "Unable to fetch admins list",
      })
      return null
    }

    // toast({
    //    title: "Admins loaded",
    //    description: "Admins list fetched successfully",
    // });

    return res.data
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return null
  }
}

export async function getOnlyOwners(
  page: number = 1,
  limit: number = 100,
  searchTerm: string = ""
) {
  try {
    const res = await API.post(
      `admins/all?search=${searchTerm}&page=${page}&limit=${limit}&role=${"OWNER"}`,
      {}
    )

    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Failed to load admins",
        description: "Unable to fetch admins list",
      })
      return null
    }

    // toast({
    //    title: "Admins loaded",
    //    description: "Admins list fetched successfully",
    // });

    return res.data
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return null
  }
}

export async function getOnlyAllowedOwners(
  page: number = 1,
  limit: number = 100,
  searchTerm: string = ""
) {
  try {
    const res = await API.post(
      `admins/all?search=${searchTerm}&page=${page}&limit=${limit}&role=${"OWNER"}&isVerified=true&isBlocked=false&isDeleted=false&isActive=true`,
      {}
    )

    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Failed to load admins",
        description: "Unable to fetch admins list",
      })
      return null
    }

    // toast({
    //    title: "Admins loaded",
    //    description: "Admins list fetched successfully",
    // });

    return res.data
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return null
  }
}

export async function updateAdminStatus(data: {
  adminId: string
  isBlocked: boolean
  isDeleted: boolean
}) {
  const body = {
    adminId: data.adminId,
    isBlocked: data.isBlocked,
    isDeleted: data.isDeleted,
  }

  try {
    const res = await API.post(`/admins/update-status`, body)

    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Unable to update admin status",
      })
      return false
    }

    toast({
      title: "Status updated",
      description: "Admin status has been updated successfully",
    })

    return true
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return false
  }
}

export async function getAllUsers(
  page: number = 1,
  limit: number = 15,
  searchTerm: string = ""
) {
  try {
    const res = await API.post(
      `/users/all?search=${searchTerm}&page=${page}&limit=${limit}`,
      {}
    )

    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Failed to load users",
        description: "Unable to fetch users list",
      })
      return null
    }

    // toast({
    //    title: "Admins loaded",
    //    description: "Admins list fetched successfully",
    // });

    return res.data
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return null
  }
}

export async function getUserDetails(id: string){
  const body = {
    userId : id
  }
  try {
    const res = await API.post(
      `/users/details`,
      body
    )

    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Failed to load users",
        description: "Unable to fetch user details.",
      })
      return null
    }

    // toast({
    //    title: "Admins loaded",
    //    description: "Admins list fetched successfully",
    // });

    return res.data
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return null
  }
}

export async function updateUserStatus(data: {
  userId: string
  isBlocked: boolean
  isDeleted: boolean
}) {
  const body = {
    userId: data.userId,
    isBlocked: data.isBlocked,
    deletedByAdmin: data.isDeleted,
  }

  try {
    const res = await API.post(`/users/update-status`, body)

    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Unable to update user status",
      })
      return false
    }

    toast({
      title: "Status updated",
      description: "User status has been updated successfully",
    })

    return true
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return false
  }
}

// export async function courtCreation(data: any) {

//    

//    let courtSize = `${data.size}${data.unitSize}`
//    const formData = new FormData();

//    formData.append("avatar", data?.titleImage);
//    formData.append("name", "Green Field Football Arena");
//    formData.append("description", "Outdoor 5-a-side football turf with night floodlights and professional artificial grass.");
//    formData.append("sport", "FOOTBALL");
//    formData.append("surface", "CARPET");
//    formData.append("size", "42x20m");
//    formData.append("capacity", "10");
//    formData.append("price", "34");
//    formData.append("owner", "6954bd289862c84fa9597878");
//    formData.append("city", "Lahore");
//    formData.append("area", "Gulberg");
//    formData.append("district", "Lahore Central");
//    formData.append("address", "45 Main Boulevard");
//    formData.append("locationId", "GLB-021");
//    formData.append("mapId", "ChIJR9Y0I8IIGTkRtT7yD6g9mS0");
//    formData.append("latitude", "31.5204");
//    formData.append("longitude", "74.3587");
//    formData.append("bufferMinutes", "15");
//    formData.append("slotDurationMinutes", "60");
//    formData.append("offersTraining", data.training);

//    // 🏷 Amenities (array)
//    data.amenities?.forEach((amenity: any) => {
//       formData.append("amenities", amenity);
//    });
//    for (const [key, value] of formData.entries()) {
//       if (value instanceof File) {
//       } else {
//       }
//    }
//    // 🖼 Avatar (single file)
//    const testFile = new File(["file content"], "test.jpg", { type: "image/jpeg" });

//    // 📎 Attachments (multiple files)
//    data.courtImages?.forEach((file: any) => {
//       formData.append("attachments", file);
//    });

//    try {
//       const res = await API.post(`/courts`, formData);

//       if (res?.status !== 200 && res?.status !== 201) {
//          toast({
//             variant: "destructive",
//             title: "Creation failed",
//             description: "Unable to create court",
//          });
//          return false;
//       }

//       toast({
//          title: "Court created",
//          description: "Court has been created successfully",
//       });

//       return true;
//    } catch (error: any) {
//       // toast({
//       //    variant: "destructive",
//       //    title: "Error",
//       //    description:
//       //       error?.response?.data?.details?.message ||
//       //       error?.message ||
//       //       "Something went wrong. Please try again.",
//       // });
//       return false;
//    }
// }

// export async function courtCreation(data: any) {

//    let courtSize = `${data.size}${data.unitSize}`;
//    const formData = new FormData();

//    formData.append("avatar", data?.titleImage);
//    formData.append("name", "Green Field Football Arena");
//    formData.append("description", "Outdoor 5-a-side football turf with night floodlights and professional artificial grass.");
//    formData.append("sport", "FOOTBALL");
//    formData.append("surface", "CARPET");
//    formData.append("size", "42x20m");
//    formData.append("capacity", "10");
//    formData.append("price", "34");
//    formData.append("owner", "6954bd289862c84fa9597878");
//    formData.append("city", "Lahore");
//    formData.append("area", "Gulberg");
//    formData.append("district", "Lahore Central");
//    formData.append("address", "45 Main Boulevard");
//    formData.append("locationId", "GLB-021");
//    formData.append("mapId", "ChIJR9Y0I8IIGTkRtT7yD6g9mS0");
//    formData.append("latitude", "31.5204");
//    formData.append("longitude", "74.3587");
//    formData.append("bufferMinutes", "15");
//    formData.append("slotDurationMinutes", "60");
//    formData.append("offersTraining", data.training);

//    // 🏷 Amenities (array)
//    data.amenities?.forEach((amenity: any) => {
//       formData.append("amenities", amenity);
//    });

//    // 📎 Attachments (multiple files)
//    data.courtImages?.forEach((file: any) => {
//       formData.append("attachments", file);
//    });

//    // Logging FormData contents for debug
//    for (const [key, value] of formData.entries()) {
//       if (value instanceof File) {
//          console.log(key, value.name, value.size, value.type);
//       } else {
//          console.log(key, value);
//       }
//    }

//    try {
//       const accessToken = Cookies.get("accessToken"); // Or get it however you store it

//       console.log("accessToken", accessToken);

//       const response = await fetch("https://kickoff.narsunprojects.com/api/courts", {
//          method: "POST",
//          headers: {
//             // Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTNiYjZkN2I3ZDU2MDBiNGFmYTcyMjciLCJlbWFpbCI6InN5ZWQubW9iYXNoaXJAbmFyc3Vuc3R1ZGlvcy5jb20iLCJyb2xlIjoiU1VQRVJBRE1JTiIsImlhdCI6MTc2NzM1MDA4NSwiZXhwIjoxNzY3OTU0ODg1fQ.Ymyfj6HL-Atv0SWhS51G6rgzDsHUdtIiPgf919KUjJg"}`,
//             Authorization: `Bearer ${accessToken}`,
//             'x-api-key': `${process.env.NEXT_PUBLIC_API_FORM_x_API_KEY}` || '',
//             // IMPORTANT: Do NOT set Content-Type header for FormData
//          },
//          body: formData,
//       });

//       if (!response.ok) {
//          // You can extract error message if API sends JSON error details
//          const errorData = await response.json().catch(() => null);
//          toast({
//             variant: "destructive",
//             title: "Creation failed",
//             description: errorData?.message || "Unable to create court",
//          });
//          return false;
//       }

//       toast({
//          title: "Court created",
//          description: "Court has been created successfully",
//       });

//       return true;
//    } catch (error: any) {
//       toast({
//          variant: "destructive",
//          title: "Error",
//          description:
//             error?.message || "Something went wrong. Please try again.",
//       });
//       return false;
//    }
// }

// import axios from "axios";

async function urlToFile(
  url: string,
  filename: string,
  mimeType?: string
): Promise<File> {
  const response = await fetch(url)
  const blob = await response.blob()
  return new File([blob], filename, { type: mimeType || blob.type })
}

// export async function courtCreation(
//    data: any,
//    courtImages: any,
//    courtId: string,
//    changedFields: string[],
//    courtImgChangeStatus: string,
//    setCourtImgChangeStatus: any,
//    deletedCimagesIds: string[],
//    hasAmenitiesChanged: boolean
// ) {
//    const courtSize = `${data.size}${data.unitSize}`;
//    const formData = new FormData();

//    console.log("Changed fields:", changedFields, "Training:", data.training);

//    // Helper to append only if field was changed
//    const appendIfChanged = (fieldName: string, value: any) => {
//       if (changedFields.includes(fieldName)) {
//          formData.append(fieldName, value);
//       }
//    };

//    // Append conditionally
//    // Special case: map titleImage form field to 'avatar' for backend
//    if (changedFields.includes("titleImage")) {
//       formData.append("avatar", data?.titleImage);
//    }
//    appendIfChanged("name", data.name);
//    appendIfChanged("description", data.description);
//    appendIfChanged("sport", data.sport);
//    appendIfChanged("surface", data.surfaceType);

//    if (changedFields.includes("size") || changedFields.includes("unitSize")) {
//       formData.append("size", courtSize);
//    }

//    appendIfChanged("capacity", String(data.capacity));
//    appendIfChanged("price", String(data.price));
//    appendIfChanged("owner", data.owner);
//    appendIfChanged("city", data.city);
//    appendIfChanged("area", data.area);
//    appendIfChanged("district", data.district);
//    appendIfChanged("address", data.address);

//    // These are always appended as empty strings, or you can add logic if needed
//    formData.append("locationId", "");
//    formData.append("mapId", "");
//    formData.append("latitude", "");
//    formData.append("longitude", "");

//    appendIfChanged("bufferMinutes", String(data.bufferMinutes));
//    appendIfChanged("slotDurationMinutes", String(data.slotDurationMinutes));
//    appendIfChanged("offersTraining", data.training);

//    if (courtId) {
//       formData.append("courtId", courtId);
//    }

//    // Append amenities if they changed
//    if (hasAmenitiesChanged) {
//       data.amenities?.forEach((amenity: any) => {
//          formData.append("amenities", amenity);
//       });
//    }

//    if (courtId) {
//       if (courtImgChangeStatus === "uploaded" || courtImgChangeStatus === "nothing") {
//          courtImages
//             ?.filter((file: any) => file?.file != null) // Filter out undefined/null files
//             .forEach((file: any) => {
//                formData.append("newAttachments", file.file);
//             });
//       } else if (courtImgChangeStatus === "deleted") {
//          formData.append("deletedAttachmentIds", JSON.stringify(deletedCimagesIds));
//       }
//    } else {
//       courtImages?.forEach((file: any) => {
//          formData.append("attachments", file.file);
//       });
//    }

//    // Optional: log FormData entries for debugging
//    for (const [key, value] of formData.entries()) {
//       if (value instanceof File) {
//          console.log(key, value.name, value.size, value.type);
//       } else {
//          console.log(key, value);
//       }
//    }

//    try {
//       const accessToken = Cookies.get("accessToken");
//       const apiKey = process.env.NEXT_PUBLIC_API_FORM_x_API_KEY || "";
//       const baseURL = process.env.NEXT_PUBLIC_API_FORM_URL;
//       const url = courtId ? "courts/update" : "courts";

//       const response = await axios.post(`${baseURL}/${url}`, formData, {
//          headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "x-api-key": apiKey,
//             // DO NOT set 'Content-Type' manually; axios will set it for FormData
//          },
//       });

//       if (response.status !== 200 && response.status !== 201) {
//          toast({
//             variant: "destructive",
//             title: "Creation failed",
//             description: "Unable to create court",
//          });
//          return false;
//       }

//       toast({
//          title: "Court created",
//          description: "Court has been created successfully",
//       });

//       changedFields.length = 0;
//       setCourtImgChangeStatus("nothing");
//       return true;
//    } catch (error: any) {
//       setCourtImgChangeStatus("nothing");
//       toast({
//          variant: "destructive",
//          title: "Error",
//          description:
//             error?.response?.data?.details?.message ||
//             error?.message ||
//             "Something went wrong. Please try again.",
//       });
//       return false;
//    }
// }

export async function courtCreation(
  data: any,
  courtImages: any,
  courtId: string,
  changedFields: string[],
  courtImgChangeStatus: string,
  setCourtImgChangeStatus: any,
  deletedCimagesIds: string[],
  hasAmenitiesChanged: boolean,
  callback: any
) {
  const courtSize = `${data.size}${data.unitSize}`
  const formData = new FormData()

  // Helper to append only if field was changed (used only when courtId exists)
  const appendIfChanged = (fieldName: string, value: any) => {
    if (changedFields.includes(fieldName)) {
      formData.append(fieldName, value)
    }
  }

  // --- Append fields depending on whether courtId exists ---

  if (courtId) {
    // Update mode - append only if changed
    if (changedFields.includes("titleImage")) {
      formData.append("avatar", data?.titleImage)
    }
    appendIfChanged("name", data.name)
    appendIfChanged("description", data.description)
    appendIfChanged("sport", data.sport)
    appendIfChanged("surface", data.surfaceType)

    if (changedFields.includes("size") || changedFields.includes("unitSize")) {
      formData.append("size", courtSize)
    }

    appendIfChanged("capacity", String(data.capacity))
    appendIfChanged("price", String(data.price))
    appendIfChanged("owner", data.owner)
    appendIfChanged("city", data.city)
    appendIfChanged("area", data.area)
    appendIfChanged("district", data.district)
    appendIfChanged("address", data.address)

    // These empty fields always appended
    appendIfChanged("locationId", "")
    appendIfChanged("mapUrl", data.mapUrl)
    appendIfChanged("latitude", "")
    appendIfChanged("longitude", "")

    appendIfChanged("bufferMinutes", String(data.bufferMinutes))
    appendIfChanged("slotDurationMinutes", String(data.slotDurationMinutes))
    if (changedFields.includes("training")) {
      formData.append("offersTraining", data.training)
    }

    formData.append("courtId", courtId)
  } else {
    // New court creation - append all fields unconditionally
    formData.append("avatar", data?.titleImage)
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("sport", data.sport)
    formData.append("surface", data.surfaceType)
    formData.append("size", courtSize)
    formData.append("capacity", String(data.capacity))
    formData.append("price", String(data.price))
    formData.append("owner", data.owner)
    formData.append("city", data.city)
    formData.append("area", data.area)
    formData.append("district", data.district)
    formData.append("address", data.address)

    formData.append("locationId", "")
    formData.append("mapUrl", data.mapUrl)
    formData.append("latitude", "")
    formData.append("longitude", "")

    formData.append("bufferMinutes", String(data.bufferMinutes))
    formData.append("slotDurationMinutes", String(data.slotDurationMinutes))
    formData.append("offersTraining", data.training)
  }

  // --- Amenities ---
  if (hasAmenitiesChanged) {
    data.amenities?.forEach((amenity: any) => {
      formData.append("amenities", amenity)
    })
  }

  // --- Court Images Handling ---
  if (courtId) {
    if (
      courtImgChangeStatus === "uploaded" ||
      courtImgChangeStatus === "nothing"
    ) {
      courtImages
        ?.filter((file: any) => file?.file != null)
        .forEach((file: any) => {
          formData.append("newAttachments", file.file)
        })
    } else if (courtImgChangeStatus === "deleted") {
      formData.append("deletedAttachmentIds", JSON.stringify(deletedCimagesIds))
    }
  } else {
    courtImages?.forEach((file: any) => {
      formData.append("attachments", file.file)
    })
  }

  try {
    const accessToken = Cookies.get("accessToken")
    const apiKey = process.env.NEXT_PUBLIC_API_FORM_x_API_KEY || ""
    const baseURL = process.env.NEXT_PUBLIC_API_FORM_URL
    const url = courtId ? "courts/update" : "courts"

    const response = await axios.post(`${baseURL}/${url}`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-key": apiKey,
        // Let axios set Content-Type automatically
      },
    })

    if (response.status !== 200 && response.status !== 201) {
      toast({
        variant: "destructive",
        title: "Creation failed",
        description: "Unable to create court",
      })
      return null
    }

    toast({
      title: "Court created",
      description: "Court has been created successfully",
    })

    changedFields.length = 0
    setCourtImgChangeStatus("nothing")
    callback("SLOT")
    return response.data
  } catch (error: any) {
    setCourtImgChangeStatus("nothing")
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return false
  }
}

export async function getAllPendingCourts(page: number = 1, limit: number = 15) {
  try {
    const res = await API.post(
      `/courts/all?status=PENDING&page=${page}&limit=${limit}`,
      {}, { 
      _noLoader: true 
    } as any)

    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Failed to load Courts",
        description: "Unable to fetch Court list",
      })
      return null
    }

    return res.data
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return null
  }
}

export async function getAllCourts(
  page: number = 1,
  limit: number = 15,
  searchTerm: string = "",
  role: string = ""
) {
  try {
    let mine = false
    if (role == "OWNER") {
      mine = true
    }
    const res = await API.post(
      `/courts/all?search=${searchTerm}&page=${page}&limit=${limit}&mine=${mine}`,
      {}
    )

    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Failed to load admins",
        description: "Unable to fetch admins list",
      })
      return null
    }

    // toast({
    //    title: "Admins loaded",
    //    description: "Admins list fetched successfully",
    // });

    return res.data
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return null
  }
}

export async function deleteCourtById(id: string, status: boolean) {
  const body = {
    courtId: id,
    isDeleted: status,
  }

  // console.log("vb122", data.blockId);

  try {
    const res = await API.post(`/courts/delete`, body)

    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Unable to delete block",
      })
      return false
    }

    toast({
      title: "Status updated",
      description: "Court has been deleted successfully",
    })

    return true
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return false
  }
}
export async function getCourtById(id: string) {
  const body = {
    courtId: id,
  }

  try {
    if (!id) return
    const res = await API.post(`/courts/details`, body)

    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Unable to fetch data",
      })
      return null
    }

    // toast({
    //    title: "Status updated",
    //    description: "Court has been deleted successfully",
    // });

    return res.data
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return false
  }
}

export async function getCourtAvailability(id: string) {
  const body = {
    courtId: id,
  }

  try {
    if (!id) return
    const res = await API.post(`/courts/availability/details`, body)

    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Unable to fetch data",
      })
      return null
    }

    // toast({
    //    title: "Status updated",
    //    description: "Court has been deleted successfully",
    // });

    return res.data
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return false
  }
}

export async function getCourtUnavailability(id: string, page: number) {
  const body = {
    courtId: id,
  }
  try {
    if (!id) return

    const res = await API.post(
      `/courts/unavailability/list?startTime=${getCurrentDateUTCZero()}&isActive=true&${page}=1&limit=15`,
      body
    )

    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Unable to fetch data",
      })
      return null
    }

    // toast({
    //    title: "Status updated",
    //    description: "Court has been deleted successfully",
    // });

    return res.data
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return false
  }
}

export async function createCourtAvailability(
  courtResponceId: string,
  dailySlots: { day: string; openTime: string; closeTime: string }[]
) {
  const body = {
    court: courtResponceId,
    dailySlots: dailySlots,
  }

  try {
    const res = await API.post(`/courts/availability/create`, body)

    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Unable to create court availability",
      })
      return null
    }

    toast({
      title: "Status updated",
      description: "Court availability has been created successfully",
    })

    return res.data
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return false
  }
}

export async function createCourtUnvalaibility(
  courtResponceId: string,
  payload: { startDatetime: string; endDatetime: string; scope: string } | null
) {
  const body = {
    court: courtResponceId,
    startDatetime: payload?.startDatetime,
    endDatetime: payload?.endDatetime,
    exceptionType: "MAINTENANCE",
    reason: "other",
    scope: payload?.scope,
  }

  try {
    const res = await API.post(`/courts/unavailability/create`, body)

    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Unable to create court availability",
      })
      return null
    }

    toast({
      title: "Status updated",
      description: "Court availability has been created successfully",
    })

    return res.data
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return false
  }
}

export async function updateCourtUnvalaibility(
  payload: {
    _id?: string
    startDatetime: string
    endDatetime: string
    scope: string
  } | null
) {
  const body = {
    unavailabilityId: payload?._id,
    startDatetime: payload?.startDatetime,
    endDatetime: payload?.endDatetime,
    exceptionType: "MAINTENANCE",
    reason: "other",
    scope: payload?.scope,
  }

  try {
    const res = await API.post(`/courts/unavailability/update`, body)

    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Unable to Update court Unavailability",
      })
      return null
    }

    // toast({
    //   title: "Status updated",
    //   description: "Court Unavailability has been updated successfully",
    // })

    return res.data
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return false
  }
}

export async function deleteCourtUnavailability(id: string) {
  const body = { unavailabilityId: id }

  try {
    const res = await API.post(`/courts/unavailability/delete`, body)

    // Using res?.status check as per your requirement
    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: "The server could not remove the unavailability record.",
      })
      return false // Return false so the UI knows NOT to remove the row
    }

    toast({
      title: "Deleted",
      description: "Court unavailability removed successfully.",
    })

    return true // Success!
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return false // Failure
  }
}

export async function updateCourtStatus(body: {}) {
  try {
    const res = await API.post(`/courts/status/update`, body)

    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Unable to update court status.",
      })
      return null
    }

    toast({
      title: "Status updated",
      description: "Court status has been updated successfully.",
    })

    return res.data
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return false
  }
}

export async function getAllNotifications(
  page: number = 1,
  limit: number = 15
) {
  try {
    const res = await API.post(
      `/notifications/all?page=${page}&limit=${limit}`,
      {}, { 
      _noLoader: true 
    } as any)

    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Failed to load admins",
        description: "Unable to fetch notifications list",
      })
      return null
    }

    // toast({
    //    title: "Admins loaded",
    //    description: "Admins list fetched successfully",
    // });

    return res.data
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return null
  }
}

export async function getAllAnnouncements(
  page: number = 1,
  limit: number = 15
) {
  try {
    const res = await API.post(
      `/notifications/all?page=${page}&limit=${limit}`,
      {}, { 
      _noLoader: true 
    } as any)

    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Failed to load admins",
        description: "Unable to fetch Announcements list",
      })
      return null
    }

    // toast({
    //    title: "Admins loaded",
    //    description: "Admins list fetched successfully",
    // });

    return res.data
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return null
  }
}

export async function getNotificationCount() {
  try {
    const res = await API.post(`/notifications/unread-count`, {}, { 
      _noLoader: true 
    } as any)

    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Failed to load admins",
        description: "Unable to fetch Announcements list",
      })
      return null
    }

    // toast({
    //    title: "Admins loaded",
    //    description: "Admins list fetched successfully",
    // });

    return res.data
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return null
  }
}

export async function readAllNotifications() {
  try {
    const res = await API.post(`/notifications/read-all`, {}, { 
      _noLoader: true 
    } as any)

    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Failed to load admins",
        description: "Unable to read Announcements list",
      })
      return null
    }

    // toast({
    //    title: "Admins loaded",
    //    description: "Admins list fetched successfully",
    // });

    return res.data
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return null
  }
}

export async function sendAnnouncements(body: {}) {
  try {
    const res = await API.post(`/notifications/announcement`, body)

    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Unable to send announcement.",
      })
      return null
    }

    toast({
      title: "Status updated",
      description: "Announcement sent successfully.",
    })

    return res.data
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return false
  }
}
