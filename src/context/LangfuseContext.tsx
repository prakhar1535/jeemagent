"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { Langfuse } from "@langfuse/web";

const LangfuseContext = createContext<Langfuse | null>(null);

export const useLangfuse = () => {
  const context = useContext(LangfuseContext);
  if (!context) {
    throw new Error("useLangfuse must be used within a LangfuseProvider");
  }
  return context;
};

export const LangfuseProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const langfuse = new Langfuse({
    publicKey: process.env.NEXT_PUBLIC_LANGFUSE_PUBLIC_KEY!,
    baseUrl: process.env.NEXT_PUBLIC_LANGFUSE_BASE_URL,
  });

  return (
    <LangfuseContext.Provider value={langfuse}>
      {children}
    </LangfuseContext.Provider>
  );
};
