"use client";
import React from "react";
import { motion } from "framer-motion";

interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      {/* FIX: Cast motion props to 'any' to bypass faulty type definitions for 'animate' and 'transition'. */}
      <motion.div
        {...{
          animate: {
            translateY: "-50%",
          },
          transition: {
            duration: props.duration || 10,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          },
        } as any}
        className="flex flex-col gap-6 pb-6"
      >
        {[...Array(2)].map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div className="p-6 rounded-3xl border border-neutral-800 bg-neutral-900/50 shadow-lg shadow-blue-800/10 max-w-xs w-full" key={i}>
                  <div className="text-gray-300">{text}</div>
                  <div className="flex items-center gap-4 mt-5">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <div className="font-medium tracking-tight leading-5 text-white">{name}</div>
                      <div className="leading-5 text-gray-400 tracking-tight text-sm">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
      </motion.div>
    </div>
  );
};
