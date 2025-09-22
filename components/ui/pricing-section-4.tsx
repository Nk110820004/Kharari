
"use client";
import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "./card";
import { Sparkles as SparklesComp } from "./sparkles";
import { TimelineContent } from "./timeline-animation";
import { cn } from "../../lib/utils";
// @ts-ignore - Assuming @number-flow/react is available in the environment
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import BlurText from "./blur-text";
import { InteractiveHoverButton } from "./interactive-hover-button";

const plans = [
  {
    name: "Starter",
    description:
      "Great for individuals and small teams starting their learning journey.",
    price: 0,
    yearlyPrice: 0,
    buttonText: "Start for Free",
    buttonVariant: "outline" as const,
    includes: [
      "Free includes:",
      "Unlimited Study Sets",
      "Custom background & stickers",
      "2-factor authentication",
      "Basic AI Assistance",
      "Community Access",
      "Progress Tracking",
      "Standard Support",
    ],
  },
  {
    name: "Pro",
    description:
      "Best value for dedicated learners who need more advanced features.",
    price: 48,
    yearlyPrice: 399,
    buttonText: "Go Pro",
    buttonVariant: "default" as const,
    popular: true,
    includes: [
      "Everything in Starter, plus:",
      "Advanced AI Tutors",
      "Personalized Learning Paths",
      "Offline Access",
      "Plagiarism Checker",
      "Advanced Checklists",
      "Custom fields",
      "Priority Support",
    ],
  },
  {
    name: "Enterprise",
    description:
      "For schools and organizations that require robust management and security.",
    price: 96,
    yearlyPrice: 899,
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const,
    includes: [
      "Everything in Pro, plus:",
      "Team Management Dashboard",
      "Multi-user licenses",
      "Custom Integrations",
      "Dedicated Account Manager",
      "SSO & Enhanced Security",
      "Custom Onboarding",
      "24/7 Premium Support",
    ],
  },
];

const PricingSwitch = ({ onSwitch }: { onSwitch: (value: string) => void }) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="relative z-10 mx-auto flex w-fit rounded-full bg-neutral-900 border border-gray-700 p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={cn(
            "relative z-10 w-fit h-10  rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
            selected === "0" ? "text-white" : "text-gray-200",
          )}
        >
          {selected === "0" && (
            // FIX: Cast motion props to 'any' to bypass faulty type definitions for 'layoutId'.
            <motion.span
              {...{
                layoutId: "switch",
                className: "absolute top-0 left-0 h-10 w-full rounded-full border-4 shadow-sm shadow-blue-600 border-blue-600 bg-gradient-to-t from-blue-500 to-blue-600",
                transition: { type: "spring", stiffness: 500, damping: 30 },
              } as any}
            />
          )}
          <span className="relative">Monthly</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={cn(
            "relative z-10 w-fit h-10 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
            selected === "1" ? "text-white" : "text-gray-200",
          )}
        >
          {selected === "1" && (
            // FIX: Cast motion props to 'any' to bypass faulty type definitions for 'layoutId'.
            <motion.span
              {...{
                layoutId: "switch",
                className: "absolute top-0 left-0 h-10 w-full  rounded-full border-4 shadow-sm shadow-blue-600 border-blue-600 bg-gradient-to-t from-blue-500 to-blue-600",
                transition: { type: "spring", stiffness: 500, damping: 30 },
              } as any}
            />
          )}
          <span className="relative flex items-center gap-2">Yearly</span>
        </button>
      </div>
    </div>
  );
};

export default function PricingSection4() {
  const [isYearly, setIsYearly] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 20
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: 20,
      opacity: 0,
    },
  };

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

  return (
    <div
      className="min-h-screen mx-auto relative bg-black overflow-x-hidden py-20"
      ref={pricingRef}
    >
      <TimelineContent
        animationNum={4}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="absolute top-0 h-96 w-screen overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)]"
      >
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff2c_1px,transparent_1px),linear-gradient(to_bottom,#3a3a3a01_1px,transparent_1px)] bg-[size:70px_80px]"></div>
        <SparklesComp
          density={1800}
          direction="bottom"
          speed={1}
          color="#FFFFFF"
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
        />
      </TimelineContent>

      <article className="text-center mb-6 pt-12 max-w-3xl mx-auto space-y-4 relative z-50">
        <BlurText
          as="h2"
          text="Plans that work best for you"
          className="text-4xl md:text-5xl font-medium text-white justify-center"
          animateBy="words"
          delay={50}
        />

        <BlurText
          text="Explore which option is right for you. All plans include a 7-day free trial."
          className="text-gray-300"
          animateBy="words"
          delay={15}
        />

        <TimelineContent
          as="div"
          animationNum={1}
          timelineRef={pricingRef}
          customVariants={revealVariants}
        >
          <PricingSwitch onSwitch={togglePricingPeriod} />
        </TimelineContent>
      </article>

      <div
        className="absolute top-0 left-[10%] right-[10%] w-[80%] h-full z-0"
        style={{
          backgroundImage: `radial-gradient(circle at center, #206ce8 0%, transparent 70%)`,
          opacity: 0.2,
          mixBlendMode: "plus-lighter",
        }}
      />

      <div className="grid md:grid-cols-3 max-w-6xl gap-8 py-6 mx-auto px-4 md:px-0">
        {plans.map((plan, index) => (
          <TimelineContent
            key={plan.name}
            as="div"
            animationNum={2 + index}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <Card
              className={`relative text-white border-neutral-800 h-full flex flex-col ${
                plan.popular
                  ? "border-blue-500 shadow-[0px_-13px_300px_0px_#0900ff] z-20"
                  : "z-10"
              } bg-neutral-900/50 backdrop-blur-md`}
            >
              <CardHeader className="text-left">
                <div className="flex justify-between items-center">
                  <h3 className="text-3xl mb-2 font-semibold">{plan.name}</h3>
                  {plan.popular && <div className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-bold">POPULAR</div>}
                </div>
                <div className="flex items-baseline h-[44px]">
                  {(isYearly ? plan.yearlyPrice : plan.price) === 0 ? (
                    <span className="text-4xl font-semibold">Free</span>
                  ) : (
                    <>
                      <span className="text-4xl font-semibold">
                        $
                        <NumberFlow
                          value={isYearly ? plan.yearlyPrice : plan.price}
                          className="text-4xl font-semibold"
                        />
                      </span>
                      <span className="text-gray-300 ml-1">
                        /{isYearly ? "year" : "month"}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-300 mb-4 h-12">{plan.description}</p>
              </CardHeader>

              <CardContent className="pt-0 flex-grow flex flex-col">
                 <div className="flex-grow flex flex-col justify-between">
                    <InteractiveHoverButton
                      text={plan.buttonText}
                      className={cn(
                          "w-full h-14 mb-6 text-xl rounded-xl font-semibold bg-neutral-800 text-white",
                          plan.popular
                          ? "border-blue-500"
                          : "border-neutral-700"
                      )}
                    />

                    <div className="space-y-3 pt-4 border-t border-neutral-700">
                      <h4 className="font-medium text-base mb-3 text-gray-200">
                        {plan.includes[0]}
                      </h4>
                      <ul className="space-y-2">
                        {plan.includes.slice(1, 5).map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-center gap-3"
                          >
                            <span className="h-2.5 w-2.5 bg-blue-500 rounded-full"></span>
                            <span className="text-sm text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <h4 className="font-medium text-base mb-3 pt-3 text-gray-200">
                        {plan.includes[5]}
                      </h4>
                       <ul className="space-y-2">
                        {plan.includes.slice(5).map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-center gap-3"
                          >
                            <span className="h-2.5 w-2.5 bg-blue-500 rounded-full"></span>
                            <span className="text-sm text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                </div>
              </CardContent>
            </Card>
          </TimelineContent>
        ))}
      </div>
    </div>
  );
}