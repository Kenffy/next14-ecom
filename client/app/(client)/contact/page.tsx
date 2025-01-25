
import { ContactSection } from "@/features/home/contact-section";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="py-12">
      <ContactSection />
    </div>
  );
}
