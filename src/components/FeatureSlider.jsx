"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import Link from 'next/link';
import { ArrowRight, Users, TrendingUp, Zap } from 'lucide-react';

// Swiper CSS এবং EffectFade CSS ইম্পোর্ট করা হচ্ছে
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const features = [
  { 
    icon: Users,
    title: "Reach Thousands of Customers",
    description: "Join our marketplace and showcase your products to a vast and engaged audience ready to buy.",
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1184&q=80',
    buttonText: "Start Selling Today",
    buttonLink: "/register"
  },
  { 
    icon: TrendingUp,
    title: "Grow Your Business Effortlessly",
    description: "We provide you with the tools and analytics to understand your customers and scale your sales.",
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    buttonText: "See Your Dashboard",
    buttonLink: "/admin/dashboard"
  },
  { 
    icon: Zap,
    title: "Powerful & Simple Tools",
    description: "From product listing to payment processing, our platform makes managing your online store a breeze.",
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    buttonText: "Explore Features",
    buttonLink: "#features"
  },
];

export default function FeatureSlider() {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay, EffectFade]}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      spaceBetween={30}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 6000, disableOnInteraction: false }}
      loop={true}
      className="relative aspect-video lg:aspect-[2.4/1] w-full rounded-2xl overflow-hidden shadow-2xl shadow-sky-900/20 dark:shadow-sky-400/10"
    >
      {features.map((feature, index) => (
        // ★★★ group ক্লাস যোগ করা হয়েছে অ্যানিমেশন নিয়ন্ত্রণের জন্য ★★★
        <SwiperSlide key={index} className="group">
          <div className="relative h-full w-full">
            {/* ★★★ Ken Burns Effect সহ Background Image ★★★ */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] ease-in-out group-[.swiper-slide-active]:scale-110"
              style={{ backgroundImage: `url(${feature.image})` }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-transparent" />
            
            {/* ★★★ Staggered Animation সহ Content ★★★ */}
            <div className="relative h-full flex flex-col justify-center items-start text-white p-8 sm:p-16 lg:p-24">
              <div className="bg-white/10 p-3 rounded-full mb-4 backdrop-blur-sm transition-all duration-500 opacity-0 translate-y-5 group-[.swiper-slide-active]:opacity-100 group-[.swiper-slide-active]:translate-y-0 delay-200">
                <feature.icon className="h-8 w-8 text-sky-300" />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-xl text-shadow-lg transition-all duration-500 opacity-0 translate-y-5 group-[.swiper-slide-active]:opacity-100 group-[.swiper-slide-active]:translate-y-0 delay-300">
                {feature.title}
              </h2>
              <p className="mt-4 text-lg text-sky-100 max-w-xl text-shadow transition-all duration-500 opacity-0 translate-y-5 group-[.swiper-slide-active]:opacity-100 group-[.swiper-slide-active]:translate-y-0 delay-[450ms]">
                {feature.description}
              </p>
              <div className="transition-all duration-500 opacity-0 translate-y-5 group-[.swiper-slide-active]:opacity-100 group-[.swiper-slide-active]:translate-y-0 delay-[600ms]">
                <Link href={feature.buttonLink} className="mt-8 inline-flex items-center gap-2 rounded-full bg-white text-gray-900 px-6 py-3 text-base font-bold shadow-lg transition-transform hover:scale-105">
                  {feature.buttonText} <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}