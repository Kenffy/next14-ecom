"use client"

import { FC } from "react";
import Link from "next/link";
import { FaEnvelope } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
//import { BiLogoEtsy } from "react-icons/bi";
//import { FaShopify } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import ContactForm from "@/components/ContactForm";


interface ContactSectionProps {
}

export const ContactSection: FC<ContactSectionProps> = (props) => {

    return (
        <section id="contact" className=" container max-w-5xl mx-auto py-20 flex items-center">
            <div className=" flex flex-col gap-4">
                <h2 className=" my-10 uppercase text-2xl text-center font-semibold">
                    Contact
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div
                        className={`flex flex-col gap-6 p-6 bg-foreground text-background`}
                    >
                        <h2 className=" text-2xl lg:text-3xl">Get in Touch</h2>
                        <p className=" mt-[2rem] text-md">
                            We're excited to hear from you and understand how we can help your
                            business. Get in touch to share your needs and let's work together
                            to achieve your goals!
                        </p>
                        <div className=" flex items-center gap-4 text-md">
                            <FaLocationDot size={22} />
                            <span>Sample street 20, 75321 Sample City</span>
                        </div>
                        <div className=" flex items-center gap-4 text-md">
                            <FaEnvelope size={22} />
                            <span>johndoe@example.com</span>
                        </div>
                        <div className=" flex items-center gap-4 text-md">
                            <FaPhoneAlt size={22} />
                            <span>{"+49 123 456789"}</span>
                        </div>
                        <div className=" flex flex-col gap-4 mt-4">
                            <h2>Other Links</h2>
                            <div className=" flex items-center gap-6">
                                <Link href={`#socials`}>
                                    <FaInstagram size={24} />
                                </Link>
                                <Link href={`#socials`}>
                                    <FaYoutube size={24} />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div>
                        <ContactForm />
                    </div>
                </div>
            </div>
        </section>
    );
}
