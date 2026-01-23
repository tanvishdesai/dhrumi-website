"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { BackgroundGrid } from "@/components/effects/BackgroundGrid";
import { HeroSection } from "@/components/hero/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { BlogCarousel } from "@/components/sections/BlogCarousel";
import { PhilosophyCards } from "@/components/sections/PhilosophyCards";
import { ProjectsAccordion } from "@/components/sections/ProjectsAccordion";
import { SkillsMarquee } from "@/components/sections/SkillsMarquee";
import { CodingStats } from "@/components/sections/CodingStats";

export default function Home() {
  return (
    <>
      {/* Background Grid Effect */}
      <BackgroundGrid />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10 flex flex-col gap-24 md:gap-32 pb-24">
        {/* Hero Section */}
        <HeroSection />

        {/* About Section */}
        <AboutSection />

        {/* Blog Carousel */}
        <BlogCarousel />

        {/* Philosophy Cards */}
        <PhilosophyCards />

        {/* Projects Accordion */}
        <ProjectsAccordion />

        {/* Skills Marquee */}
        <SkillsMarquee />

        {/* Coding Stats */}
        <CodingStats />
      </main>

      {/* Footer */}
      <Footer />

      {/* Back to Top Button */}
      <BackToTop />
    </>
  );
}
