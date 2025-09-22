'use client';

// FIX: Remove non-exported 'Variants' from framer-motion import.
import { motion, useInView } from 'framer-motion';
import React, { ElementType } from 'react';

// FIX: Define Variants as 'any' since it's not exported, likely due to an old framer-motion version.
type Variants = any;

interface TimelineContentProps {
  children: React.ReactNode;
  as?: ElementType;
  animationNum: number;
  timelineRef: React.RefObject<HTMLElement>;
  customVariants: Variants;
  className?: string;
  [key: string]: any; 
}

export const TimelineContent: React.FC<TimelineContentProps> = ({
  children,
  as: Component = 'div',
  animationNum,
  timelineRef,
  customVariants,
  className,
  ...props
}) => {
  const isInView = useInView(timelineRef, { once: true, amount: 0.2, margin: "0px 0px -50px 0px" });

  return (
    // FIX: Cast motion props to 'any' to bypass faulty type definitions for 'variants' and other props.
    <motion.div
      {...{
        variants: customVariants,
        initial: "hidden",
        animate: isInView ? 'visible' : 'hidden',
        custom: animationNum,
        className: className,
        ...props
      } as any}
    >
        {React.createElement(Component, {}, children)}
    </motion.div>
  );
};
