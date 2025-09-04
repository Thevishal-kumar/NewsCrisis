import { createContext, useState, useEffect } from "react";

export const ReportsContext = createContext();

export function ReportsProvider({ children }) {
  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem("verificationHistory");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("verificationHistory", JSON.stringify(reports));
  }, [reports]);

  return (
    <ReportsContext.Provider value={{ reports, setReports }}>
      {children}
    </ReportsContext.Provider>
  );
}
