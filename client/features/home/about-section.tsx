"use client"

import { FC } from "react";
import Image from "next/image";


interface AboutSectionProps {
}

export const AboutSection: FC<AboutSectionProps> = (props) => {

    return (
        <section id="about" className=" container max-w-5xl mx-auto py-10 flex items-center">
            <div className=" flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="hidden md:grid grid-cols-2 gap-4">
                        <div className="grid gap-4">
                            <div>
                                <Image
                                    height={540}
                                    width={540}
                                    src={"/images/gallery/pic1.png"}
                                    alt="user profile"
                                    className="w-full h-full object-cover rounded-xl object-center cursor-pointer"
                                />
                            </div>
                            <div>
                                <Image
                                    height={540}
                                    width={540}
                                    src={"/images/gallery/pic3.png"}
                                    alt="user profile"
                                    className="w-full h-full object-cover rounded-xl object-center cursor-pointer"
                                />
                            </div>
                        </div>
                        <div className="grid gap-4">
                            <div>
                                <Image
                                    height={540}
                                    width={540}
                                    src={"/images/gallery/pic2.png"}
                                    alt="user profile"
                                    className="w-full h-full object-cover rounded-xl object-center cursor-pointer"
                                />
                            </div>
                            <div>
                                <Image
                                    height={540}
                                    width={540}
                                    src={"/images/gallery/pic4.png"}
                                    alt="user profile"
                                    className="w-full h-full object-cover rounded-xl object-center cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                    <div className=" flex flex-col md:justify-center gap-10 md:p-10 ">
                        <h2 className=" uppercase text-2xl text-center font-semibold">
                            About TemosCo
                        </h2>
                        <div className=" md:hidden min-h-44">
                            <Image
                                height={540}
                                width={540}
                                src={"/images/gallery/temosco-banner.jpg"}
                                alt="user profile"
                                className="w-full h-full object-cover rounded-xl object-center cursor-pointer"
                            />
                        </div>

                        {/* <p className=" text-center">
              Temosco is a small clothing, home decoration and accessories
              family business. With us, every customer is part of the family.
            </p> */}

                        <p className=" text-center">
                            We are a family business with a passion for personalised style and
                            unique fashion. With us you will find a wide range of personalised
                            clothing and accessories that are perfect for you or your loved
                            ones.
                        </p>

                        <div className=" text-center flex flex-col gap-2">
                            <h2 className=" text-center font-semibold text-xl">Our Story</h2>
                            <p className="">
                                Our story began with the vision of giving people the opportunity
                                to express their personality and individuality through their
                                clothing. What started as a humble idea has grown into a
                                thriving business focussed on providing our customers with high
                                quality products made with love and care.
                            </p>
                            <p>
                                Whether you are looking for a unique t-shirt, a stylish polo,
                                jumper or a special accessory, you will find it with us. We
                                believe that every garment should tell a story - your story.
                            </p>
                            <p>
                                We also understand the importance of team spirit and
                                togetherness in organisations. That's why we offer customised
                                corporate clothing solutions so your employees can proudly
                                represent your brand.
                            </p>
                        </div>

                        <div className=" text-center flex flex-col gap-2">
                            <h2 className=" text-center font-semibold text-xl">
                                Our Mission
                            </h2>
                            <p className=" text-center">
                                Our goal is to constantly offer new garments for all occasions
                                that you won't find anywhere else.
                            </p>
                            <p>
                                At TemosCo, quantity doesn't matter - whether you're placing a
                                single item or a large order, we're equally excited about every
                                opportunity to serve you.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
