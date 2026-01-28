import { createContext, useState, useEffect } from "react";

export const ReportsContext = createContext();

export function ReportsProvider({ children }) {
  const [reports, setReports] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
     
  // --- CHANGE: Fetch initial reports from Backend ---
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/reports');
        if (res.ok) {
          const data = await res.json();
          setReports(data.items || []);
        }
      } catch (error) {
        console.error("Failed to load reports into context:", error);
      }
    };
    fetchInitialData();
  }, []);

  return (
    <ReportsContext.Provider value={{ reports, setReports, isAnalyzing, setIsAnalyzing }}>
      {children}
    </ReportsContext.Provider>
  );
}