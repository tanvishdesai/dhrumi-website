"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedNameProps {
  firstName: string;
  lastName: string;
  className?: string;
}

export function AnimatedName({ firstName, lastName, className }: AnimatedNameProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <h1 className={cn("flex flex-col gap-0 leading-[0.85] select-none", className)}>
      {/* First Name - Filled Style */}
      <span className="hero-name-filled overflow-hidden text-[12vw] xl:text-[9rem] tracking-tighter" aria-label={firstName}>
        {firstName.split("").map((letter, index) => (
          <span
            key={`first-${index}`}
            className={cn(
              "inline-block",
              isVisible ? "animate-letter-reveal" : "opacity-0 translate-y-full"
            )}
            style={{
              animationDelay: `${index * 40}ms`,
              animationFillMode: "forwards",
            }}
          >
            {letter}
          </span>
        ))}
      </span>

      {/* Last Name - Outline Style */}
      <span className="hero-name-outline overflow-hidden text-[12vw] xl:text-[9rem] tracking-tighter -mt-[1vw] xl:-mt-4" aria-label={lastName}>
        {lastName.split("").map((letter, index) => (
          <span
            key={`last-${index}`}
            className={cn(
              "inline-block",
              isVisible ? "animate-letter-reveal" : "opacity-0 translate-y-full"
            )}
            style={{
              animationDelay: `${(firstName.length + index) * 40}ms`,
              animationFillMode: "forwards",
            }}
          >
            {letter}
          </span>
        ))}
      </span>
    </h1>
  );
}
