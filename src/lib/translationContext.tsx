"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { DictionaryType } from "./get-dictionary";

/**
 * Use the SAME type everywhere
 */
const TranslationContext = createContext<DictionaryType | undefined>(
   undefined
);

export function TranslationProvider({
   dictionary,
   children,
}: {
   dictionary: DictionaryType;
   children: ReactNode;
}) {
   return (
      <TranslationContext.Provider value={dictionary}>
         {children}
      </TranslationContext.Provider>
   );
}

export function useTranslation() {
   const context = useContext(TranslationContext);

   if (!context) {
      throw new Error("useTranslation must be used within TranslationProvider");
   }

   return context;
}
