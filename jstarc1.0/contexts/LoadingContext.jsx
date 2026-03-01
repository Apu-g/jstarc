"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const LoadingContext = createContext(undefined);

export const LoadingProvider = ({ children }) => {
    const [introShown, setIntroShown] = useState(false);
    const [loaderDone, setLoaderDone] = useState(false);
    const [showNavbar, setShowNavbar] = useState(false);

    // Called by Loader when its animation finishes
    const markLoaderDone = useCallback(() => {
        setLoaderDone(true);
    }, []);

    // Called by HeroClipMask when the entrance animation finishes (shows navbar)
    const markIntroComplete = useCallback(() => {
        setIntroShown(true);
        setShowNavbar(true);
    }, []);

    const resetIntro = useCallback(() => {
        setIntroShown(false);
        setLoaderDone(false);
        setShowNavbar(false);
    }, []);

    return (
        <LoadingContext.Provider value={{
            introShown,
            loaderDone,
            showNavbar,
            markLoaderDone,
            markIntroComplete,
            resetIntro
        }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (context === undefined) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};
