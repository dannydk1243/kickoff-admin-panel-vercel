"use client";

import React, { useEffect, useState, useRef } from "react";
import { getOnlyOwners } from "@/components/dashboards/services/apiService";
import {
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

type Owner = {
   _id: string;
   name: string;
};

type ProfileInfoFormType = {
   address: string;
};

export default function OwnerSearchDropdown() {
   const form = useForm<ProfileInfoFormType>({
      defaultValues: {
         address: "",
      },
   });

   const { control, watch } = form;

   const searchText = watch("address");
   const [owners, setOwners] = useState<Owner[]>([]);
   const [loading, setLoading] = useState(false);
   const debounceRef = useRef<NodeJS.Timeout | null>(null);



   // useEffect(() => {
   //    if (!searchText || searchText.trim().length < 2) {
   //       setOwners([]);
   //       return;
   //    }

   //    if (debounceRef.current) {
   //       clearTimeout(debounceRef.current);
   //    }

   //    debounceRef.current = setTimeout(async () => {
   //       setLoading(true);
   //       const res = await getOnlyOwners(1, 15, searchText);
   //       setOwners(res?.admins || []);
   //       setLoading(false);
   //    }, 3000); // 3 seconds debounce

   //    return () => {
   //       if (debounceRef.current) clearTimeout(debounceRef.current);
   //    };
   // }, [searchText]);

   return (
      <div className="relative h-[8.5vh]">
         <FormField
            control={control}
            name="address"
            render={({ field }) => (
               <FormItem>
                  <FormLabel>Full Address</FormLabel>
                  <FormControl>
                     <Input {...field} placeholder="Search owner..." />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />

         {/* Dropdown Results */}
         {loading && <p className="text-sm mt-1">Loading...</p>}

         {owners.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow">
               {owners.map((owner) => (
                  <div
                     key={owner._id}
                     className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  >
                     {owner.name}
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}
