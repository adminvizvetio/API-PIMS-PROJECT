import { useEffect, useState } from "react";

const useLocalStorageChange = (key: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentValue = localStorage.getItem(key);
      if (currentValue !== storedValue) {
        setStoredValue(currentValue);
        // console.log("LocalStorage value changed:", currentValue);
      }
    }, 500); // Check every 1 second, adjust as needed

    return () => clearInterval(intervalId);
  }, [key, storedValue]);

  return storedValue;
};

export default useLocalStorageChange;
