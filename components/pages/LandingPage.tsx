import React, { useLayoutEffect } from 'react';
import { BookOpen, User, Briefcase, Users, Flame } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { RaycastAnimatedBackground } from '../ui/raycast-animated-background';
import { ShaderAnimationSection } from '../ui/shader-animation';
import PricingSection from '../ui/pricing-section-4';
import TestimonialsSection from '../ui/testimonials-section';
import BlurText from '../ui/blur-text';
import { InteractiveHoverButton } from '../ui/interactive-hover-button';
import { User as UserType } from '../../App';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

interface LandingPageProps {
  onGetStartedClick: () => void;
  onProfileClick: () => void;
  onCareerClick: () => void;
  onCommunityClick: () => void;
  isLoggedIn: boolean;
  user: UserType | null;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStartedClick, onProfileClick, onCareerClick, onCommunityClick, isLoggedIn, user }) => {

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1,
        effects: true,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">Khalari</h1>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
              <a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</a>
              <a href="#testimonials" className="hover:text-blue-400 transition-colors">Testimonials</a>
            </div>
            {isLoggedIn && user ? (
               <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 text-orange-400 font-bold bg-neutral-800/50 px-3 py-1.5 rounded-full">
                    <Flame size={16} />
                    <span className="text-sm">{user.currentStreak}</span>
                 </div>
                 <button onClick={onCommunityClick} className="hidden sm:flex items-center gap-2 text-sm font-medium text-neutral-200 hover:text-blue-400 transition-colors">
                    <Users size={16} />
                    <span>Community</span>
                 </button>
                 <button onClick={onCareerClick} className="hidden sm:flex items-center gap-2 text-sm font-medium text-neutral-200 hover:text-blue-400 transition-colors">
                    <Briefcase size={16} />
                    <span>Career</span>
                 </button>
                 <button onClick={onProfileClick} className="w-10 h-10 bg-neutral-800 border border-neutral-700 rounded-full flex items-center justify-center hover:border-blue-500 transition-colors">
                   <User size={20} />
                 </button>
               </div>
            ) : (
              <InteractiveHoverButton onClick={onGetStartedClick} text="Get Started" className="w-32 bg-neutral-900 border-neutral-700 text-white" />
            )}
          </div>
        </nav>
      </header>

      <main>
        <section id="hero" className="relative h-screen w-full overflow-hidden">
          <RaycastAnimatedBackground />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/30">
            <BlurText
              as="h1"
              text="Study Smarter with Khalari"
              className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white"
              animateBy="words"
              delay={50}
            />
            <BlurText
              as="p"
              text="Your personal AI-powered study buddy. Master any subject with interactive lessons, instant feedback, and personalized learning paths."
              className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl"
              animateBy="words"
              delay={15}
            />
            <InteractiveHoverButton onClick={onGetStartedClick} text="Start for Free" className="mt-8 w-56 h-14 text-lg bg-neutral-900 border-neutral-700 text-white" />
          </div>
        </section>

        <section id="features" className="flex items-center justify-center h-screen">
          <ShaderAnimationSection />
        </section>

        <section id="pricing">
          <PricingSection />
        </section>

        <section id="testimonials">
          <TestimonialsSection />
        </section>

        <footer className="bg-neutral-900 border-t border-neutral-800 py-8">
          <div className="container mx-auto px-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Khalari. All rights reserved.</p>
            <p className="text-sm mt-2">The ultimate AI study companion.</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;