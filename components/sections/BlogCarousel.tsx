"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  cvss?: number;
  locked: boolean;
  affectedCompanies: string[];
  description: string;
  image?: string;
  imageAlt?: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Account Takeover in Azerbaijan's Most Visited Platforms",
    slug: "open-redirect-to-ato",
    cvss: 9.6,
    locked: false,
    affectedCompanies: ["tap.az", "turbo.az"],
    description:
      "How an OAuth token leakage through Open Redirect enabled complete account takeover on tap.az and turbo.az.",
    image: "/images/tapaz-preview.png",
    imageAlt: "Open Redirect to Full Account Takeover"
  },
  {
    id: "2",
    title: "On-site and Off-site Search Algorithm Manipulation on LinkedIn",
    slug: "linkedin-search-poisoning",
    locked: true,
    affectedCompanies: ["LinkedIn"],
    description:
      "How I discovered and responsibly reported an on-site and off-site search poisoning vulnerability that leads to indistinguishable user deception attacks on LinkedIn.",
  },
  {
    id: "3",
    title: "Unauthenticated Infrastructure Abuse in Google Image Proxy",
    slug: "google-image-proxy-abuse",
    locked: true,
    affectedCompanies: ["Google"],
    description:
      "How a logic flaw in Google's internal proxy service allowed for unauthenticated, attribution-free DDoS amplification and infrastructure resource exhaustion.",
  },
  {
    id: "4",
    title: "Persistent State Corruption in Linear.app",
    slug: "linear-permanent-state-corruption",
    cvss: 6.5,
    locked: false,
    affectedCompanies: ["Linear.app"],
    description:
      "Analyzing a logic vulnerability in Linear's optimistic UI architecture that allowed authenticated users to permanently 'brick' other accounts via ID collision.",
    image: "/images/linear-preview.png",
    imageAlt: "Linear Permanent State Corruption"
  },
];

export function BlogCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Refs for animation state to prevent re-renders breaking the loop
  const progressRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isPausedRef = useRef(isPaused);
  
  const DURATION = 3000; // 3 seconds per slide
  
  // Sync ref with state
  useEffect(() => {
      isPausedRef.current = isPaused;
      if (isPaused) {
          startTimeRef.current = null;
      }
  }, [isPaused]);

  // Swipe/Drag State
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % blogPosts.length);
    setProgress(0);
    progressRef.current = 0;
    startTimeRef.current = null;
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + blogPosts.length) % blogPosts.length);
    setProgress(0);
    progressRef.current = 0;
    startTimeRef.current = null;
  }, []);

  // Minimum swipe distance
  const minSwipeDistance = 50;

  const onTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    setIsPaused(true);
    touchEndRef.current = null; // Reset
    if ('touches' in e) {
       touchStartRef.current = e.targetTouches[0].clientX;
    } else {
       touchStartRef.current = (e as React.MouseEvent).clientX;
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if ('touches' in e) {
        touchEndRef.current = e.targetTouches[0].clientX;
    } else {
        touchEndRef.current = (e as React.MouseEvent).clientX;
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    setIsPaused(false);
    if (!touchStartRef.current || !touchEndRef.current) return;
    
    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
        prevSlide();
    }
    
    // Reset refs to be safe
    touchStartRef.current = null;
    touchEndRef.current = null;
  }, [nextSlide, prevSlide]);


  const animate = useCallback((timestamp: number) => {
    if (isPausedRef.current) {
      startTimeRef.current = null;
      // Even if paused, we keep the loop alive to check for unpause, 
      // OR we rely on useEffect to restart it. 
      // Better to stop loop when paused to save resources.
      return; 
    }

    if (!startTimeRef.current) {
      // Resume from current progress
      startTimeRef.current = timestamp - (progressRef.current / 100) * DURATION;
    }

    const elapsed = timestamp - startTimeRef.current;
    // Calculate progress based on time
    const newProgress = Math.min((elapsed / DURATION) * 100, 100);

    progressRef.current = newProgress;
    setProgress(newProgress);

    if (newProgress >= 100) {
      nextSlide();
      // nextSlide resets progressRef.current to 0 and startTimeRef to null
      // The next frame will pick this up.
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [nextSlide]); // Only depends on nextSlide which is stable

  useEffect(() => {
    if (!isPaused) {
        animationFrameRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [animate, isPaused]);

  const getCardStyle = (index: number) => {
    const total = blogPosts.length;
    
    let offset = (index - activeIndex) % total;
    if (offset < 0) offset += total; 
    if (offset > total / 2) offset -= total;
    
    const isActive = offset === 0;
    const isPrev = offset === -1;
    const isNext = offset === 1;
    const isVisible = isActive || isPrev || isNext;

    let transform = "";
    let opacity = 0;
    let zIndex = 0;
    let filter = "";

    if (isActive) {
      transform = "translateX(-50%) scale(1) translateZ(0)";
      opacity = 1;
      zIndex = 20;
      filter = "blur(0px)";
    } else if (isPrev) {
      // Move further left to avoid overlap and ensure centering perception
      transform = "translateX(-155%) scale(0.8) translateZ(-80px) rotateY(12deg)";
      opacity = 0.6;
      zIndex = 10;
      filter = "blur(1px)";
    } else if (isNext) {
      // Move further right
      transform = "translateX(55%) scale(0.8) translateZ(-80px) rotateY(-12deg)";
      opacity = 0.6;
      zIndex = 10;
      filter = "blur(1px)";
    } else {
      transform = "translateX(-50%) scale(0.5) translateZ(-200px)";
      opacity = 0;
      zIndex = 0;
    }

    return {
      transform,
      opacity,
      zIndex,
      filter,
      transition: "all 0.6s cubic-bezier(0.25, 1, 0.5, 1)", 
      display: isVisible ? 'block' : 'none',
      left: "50%", // Explicitly force left 50% here as well
    };
  };

  return (
    <section className="relative z-10 py-12 md:py-24 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto w-full max-w-[1700px] px-6">
        {/* Section Header */}
        <div className="mb-12 md:mb-20 text-center">
           <h2 className="font-brachial-wide text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-4 text-white tracking-widest flex items-center justify-center gap-4">
             <span className="hidden md:block opacity-30 tracking-tighter text-indigo-500">==</span>
             BLOGS & RESEARCH
             <span className="hidden md:block opacity-30 tracking-tighter text-indigo-500">==</span>
           </h2>
          <p className="text-base md:text-lg text-zinc-400 font-light max-w-2xl mx-auto">
            Detailed write-ups on security research, vulnerabilities, and engineering challenges.
          </p>
        </div>

        {/* 3D Carousel Container */}
        {/* Removed max-w-5xl constraint to allow full width usage for centering logic */}
        <div 
          className="relative mx-auto h-[450px] md:h-[500px] w-full perspective-container cursor-grab active:cursor-grabbing touch-pan-y"
          style={{ perspective: "1500px" }} // Increased perspective for less distortion
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onTouchStart}
          onMouseMove={(e) => {
              // Only treat as drag if mouse button is down (buttons === 1)
              if (e.buttons === 1) onTouchMove(e);
          }}
          onMouseUp={onTouchEnd}
        >
            {/* Navigation Buttons Removed */}

          <div className="relative w-full h-full [transform-style:preserve-3d]">
            {blogPosts.map((post, index) => {
              const style = getCardStyle(index);
              
              return (
                <article
                  key={post.id}
                  className={cn(
                    "absolute top-0 w-[300px] md:w-[400px] h-[420px] md:h-[480px]",
                    "rounded-2xl bg-[#0a0a0a] border border-white/10 overflow-hidden",
                    "shadow-2xl shadow-black/80", // Removed left-1/2 from class, handled in style
                    "hover:border-indigo-500/30 transition-colors" 
                  )}
                  style={{
                    ...style,
                    // We handle visibility in getCardStyle via display
                  }}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className="h-full flex flex-col relative bg-[#0a0a0a]">
                    {/* Background Grid Pattern for Card */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                    {/* Content Container */}
                    <div className="relative z-10 flex flex-col h-full p-6">
                        {/* Tags / Status */}
                        <div className="flex items-center justify-between mb-4">
                            {post.locked ? (
                                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-red-500 bg-red-500/10 px-2.5 py-1 rounded-md border border-red-500/20">
                                    <Lock className="w-3 h-3" /> Locked
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-md border border-emerald-400/20">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Public
                                </span>
                            )}
                            
                            {post.cvss && (
                                <span className="text-[10px] font-mono font-bold text-zinc-500 border border-zinc-800 px-2 py-1 rounded">
                                    CVSS {post.cvss}
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl md:text-2xl font-bold leading-tight text-white mb-4 line-clamp-3">
                            {post.title}
                        </h3>

                        {/* Image Preview Area */}
                        <div className="flex-1 w-full bg-black/40 rounded-xl border border-white/5 overflow-hidden relative mb-4 group/image">
                            {post.image ? (
                                <div className="w-full h-full relative"> 
                                    {/* Placeholder for actual image if Next.js Image was used, using div bg for now */}
                                    <div className="absolute inset-0 flex items-center justify-center text-zinc-700 bg-zinc-900/50">
                                        <span className="text-xs font-mono uppercase tracking-widest">{post.imageAlt}</span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                </div>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 gap-2">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                        {post.locked ? <Lock className="w-4 h-4" /> : <ArrowRight className="w-4 h-4 -rotate-45" />}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="mt-auto">
                            <p className="text-sm text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                                {post.description}
                            </p>
                            
                            <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                <span className="text-xs text-zinc-500 font-mono">
                                    {post.affectedCompanies.join(", ")}
                                </span>
                                
                                <Link
                                    href={post.locked ? "#" : `/blog/${post.slug}`}
                                    className={cn(
                                    "flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors",
                                    post.locked 
                                        ? "text-zinc-600 cursor-not-allowed" 
                                        : "text-white hover:text-indigo-400"
                                    )}
                                    onClick={(e) => post.locked && e.preventDefault()}
                                >
                                    Read Article <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Progress Bar & Indicators */}
        <div className="mt-6 flex flex-col items-center justify-center gap-4">
             {/* Dots */}
             <div className="flex items-center gap-2 mb-2">
                {blogPosts.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => { setActiveIndex(idx); setProgress(0); }}
                        className={cn(
                            "w-1.5 h-1.5 rounded-full transition-all duration-300",
                            activeIndex === idx ? "w-4 bg-white" : "bg-white/20 hover:bg-white/40"
                        )}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>

             {/* Progress Line */}
             <div className="relative h-px w-24 bg-white/10 overflow-hidden">
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-indigo-500 h-full transition-transform duration-100 ease-linear"
                  style={{ 
                      width: '100%',
                      transform: `translateX(-${100 - progress}%)` 
                    }}
                />
             </div>
        </div>
      </div>
    </section>
  );
}
