"use client";
import React from 'react';
import { TestimonialsColumn } from "./testimonials-columns";
import BlurText from './blur-text';
import DotGrid from './dot-grid';

const testimonials = [
  {
    text: "Kalari revolutionized my study habits. The AI tutor is incredibly helpful for complex subjects like calculus.",
    image: "https://picsum.photos/id/1005/40/40",
    name: "Briana Patton",
    role: "University Student",
  },
  {
    text: "As a visual learner, the interactive diagrams are a game-changer. I can finally grasp difficult organic chemistry concepts.",
    image: "https://picsum.photos/id/1011/40/40",
    name: "Bilal Ahmed",
    role: "Pre-Med Student",
  },
  {
    text: "The support team is exceptional. They helped me set up my classroom account and were super responsive.",
    image: "https://picsum.photos/id/1027/40/40",
    name: "Saman Malik",
    role: "High School Teacher",
  },
  {
    text: "This app's seamless integration across devices keeps me productive whether I'm on my laptop or phone. Highly recommended!",
    image: "https://picsum.photos/id/1012/40/40",
    name: "Omar Raza",
    role: "PhD Candidate",
  },
  {
    text: "Its robust features and quick AI feedback have transformed our group study sessions, making us significantly more efficient.",
    image: "https://picsum.photos/id/1025/40/40",
    name: "Zainab Hussain",
    role: "Engineering Student",
  },
  {
    text: "The personalized learning paths helped me focus on my weak areas for the MCAT. I saw a huge improvement in my scores.",
    image: "https://picsum.photos/id/20/40/40",
    name: "Aliza Khan",
    role: "Aspiring Doctor",
  },
  {
    text: "User-friendly design and genuinely useful features. It's clear this was built with students' needs in mind.",
    image: "https://picsum.photos/id/22/40/40",
    name: "Farhan Siddiqui",
    role: "Law Student",
  },
  {
    text: "Kalari delivered a solution that exceeded my expectations. It's more than an app; it's a true study partner.",
    image: "https://picsum.photos/id/40/40/40",
    name: "Sana Sheikh",
    role: "Economics Major",
  },
  {
    text: "Using this app, my grades have significantly improved. It makes learning engaging and fun!",
    image: "https://picsum.photos/id/42/40/40",
    name: "Hassan Ali",
    role: "High School Student",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialsSection = () => {
  return (
    <section className="bg-black my-20 relative overflow-hidden py-20">
      <div className="absolute inset-0 z-0 opacity-50">
          <DotGrid
            dotSize={2}
            gap={25}
            baseColor="#5227FF"
            activeColor="#FFFFFF"
            proximity={120}
            shockRadius={250}
            shockStrength={0.5}
            resistance={750}
            returnDuration={1.5}
          />
      </div>
      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col items-center justify-center max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="border border-blue-500 py-1 px-4 rounded-full text-blue-400 text-sm">Testimonials</div>
          </div>
          <BlurText
            as="h2"
            text="Loved by learners worldwide"
            className="text-4xl md:text-5xl font-bold tracking-tighter mt-2 text-white justify-center"
            animateBy="words"
            delay={50}
          />
          <BlurText
            as="p"
            text="See what our customers have to say about their experience with Kalari."
            className="text-center mt-5 text-lg text-gray-300"
            animateBy="words"
            delay={15}
          />
        </div>
        <div className="relative flex justify-center gap-6 mt-16 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;