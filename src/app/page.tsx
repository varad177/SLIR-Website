import React from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Problem } from '@/components/Problem';
import { Features } from '@/components/Features';
import { ProfilerSim } from '@/components/ProfilerSim';
import { CodeExamples } from '@/components/CodeExamples';
import { Install } from '@/components/Install';
import { Architecture } from '@/components/Architecture';
import { ApiReference } from '@/components/ApiReference';
import { FAQ } from '@/components/FAQ';
import { FinalCTA } from '@/components/FinalCTA';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-night"
      >
        Skip to content
      </a>

      <Header />

      <main id="main">
        <Hero />
        <Problem />
        <Features />
        <ProfilerSim />
        <CodeExamples />
        <Install />
        <Architecture />
        <ApiReference />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer />
    </>
  );
}
