
import { AboutSection } from "@/features/home/about-section";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "About TemosCo",
};

export default function AboutPage() {
  return (
    <div className=" py-20">
      <AboutSection />
    </div>
  );
}
