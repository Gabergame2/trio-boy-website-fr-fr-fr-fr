import React from "react";
import Navbar from "@/components/trio/Navbar";
import HeroSection from "@/components/trio/HeroSection";
import VideoFeed from "@/components/trio/VideoFeed";
import MerchSection from "@/components/trio/MerchSection";
import CommunitySection from "@/components/trio/CommunitySection";
import ProjectSummerSection from "@/components/trio/ProjectSummerSection";
import Footer from "@/components/trio/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <VideoFeed />
      <MerchSection />
      <ProjectSummerSection />
      <CommunitySection />
      <Footer />
    </div>
  );
}