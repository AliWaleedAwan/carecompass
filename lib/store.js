"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const KEY = "carecompass_encounters_v1";
const StoreContext = createContext(null);

function load() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function StoreProvider({ children }) {
  const [encounters, setEncounters] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setEncounters(load());
    setReady(true);
  }, []);

  const persist = useCallback((next) => {
    setEncounters(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    }
  }, []);

  const addEncounter = useCallback(
    (enc) => {
      const record = {
        id: "enc_" + Date.now(),
        createdAt: new Date().toISOString(),
        status: "new",
        ...enc,
      };
      persist([record, ...load()]);
      return record;
    },
    [persist]
  );

  const updateStatus = useCallback(
    (id, status) => {
      persist(load().map((e) => (e.id === id ? { ...e, status } : e)));
    },
    [persist]
  );

  const reset = useCallback(() => persist([]), [persist]);

  return (
    <StoreContext.Provider
      value={{ encounters, ready, addEncounter, updateStatus, reset }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
