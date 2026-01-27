"use client"

import Cookies from "js-cookie"

import { io } from "socket.io-client"

// Get the token from cookies
const token = Cookies.get("accessToken")

export const socketInstance = io(`${process.env.NEXT_PUBLIC_SOCKET_FORM_URL}`, {
  autoConnect: true,
  extraHeaders: {
    Authorization: `Bearer ${token}`,
    "x-api-key": `${process.env.NEXT_PUBLIC_API_FORM_x_API_KEY}`,
  },
  secure: true,
})
socketInstance.on("connect", () => {
  console.log("Connected to /realtime. Socket ID:", socketInstance.id)
})
