import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageDirectionWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  return (
    <div dir={language === "ar" ? "rtl" : "ltr"} lang={language} className="min-h-screen w-full">
      {children}
    </div>
  );
};

export default LanguageDirectionWrapper;
