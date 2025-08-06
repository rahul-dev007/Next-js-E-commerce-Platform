"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';

// Swiper CSS ইম্পোর্ট করা হচ্ছে
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const testimonials = [
  { name: 'Sarah L.', quote: "This shop is amazing! The quality is top-notch and the customer service is the best I've ever experienced.", image: '/testimonials/sarah.jpg' },
  { name: 'Mike D.', quote: "I found exactly what I was looking for. Fast shipping and the product exceeded my expectations. Highly recommended!", image: '/testimonials/mike.jpg' },
  { name: 'Jessica P.', quote: "A fantastic selection of unique products. I'll definitely be a returning customer. The whole process was seamless.", image: '/testimonials/jessica.jpg' },
  { name: 'David C.', quote: "Five stars! The website is easy to navigate and the checkout process is super secure. I'm very impressed.", image: '/testimonials/david.jpg' },
];

export default function TestimonialSlider() {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      loop={true}
      className="max-w-3xl mx-auto"
    >
      {testimonials.map((testimonial, index) => (
        <SwiperSlide key={index}>
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="relative h-20 w-20 mx-auto rounded-full overflow-hidden mb-4 ring-4 ring-indigo-300 dark:ring-indigo-700">
                <Image src={testimonial.image} alt={testimonial.name} fill className="object-cover" />
            </div>
            <p className="text-lg italic text-gray-700 dark:text-gray-300">"{testimonial.quote}"</p>
            <h4 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">- {testimonial.name}</h4>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

// বিশেষ নোট: public ফোল্ডারে testimonials নামে একটি ফোল্ডার তৈরি করে সেখানে কিছু ছবি রাখতে হবে।