
import { cn } from "../../lib/utils";
import React, { useState, useEffect, Suspense } from "react";
// @ts-ignore - Assuming unicornstudio-react is available in the environment
import UnicornScene from "unicornstudio-react";

const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    const debouncedHandleResize = debounce(handleResize, 200);

    window.addEventListener('resize', debouncedHandleResize);
    
    handleResize();

    return () => window.removeEventListener('resize', debouncedHandleResize);
  }, []);

  return windowSize;
};

export const RaycastAnimatedBackground = () => {
  const { width, height } = useWindowSize();

  return (
    <div className={cn("flex flex-col items-center absolute inset-0")}>
        <Suspense fallback={<div className="w-full h-full bg-black" />}>
          <UnicornScene 
          production={true} projectId="cbmTT38A0CcuYxeiyj5H" width={width} height={height} />
        </Suspense>
    </div>
  );
};
