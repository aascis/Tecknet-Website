import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import TestimonialCard from '@/components/TestimonialCard';

const services = [
  {
    icon: 'code',
    title: 'Custom Software Development',
    description: 'We build custom software solutions tailored to your specific business requirements.'
  },
  {
    icon: 'smartphone',
    title: 'Mobile App Development',
    description: 'Create powerful, intuitive mobile applications for iOS and Android platforms.'
  },
  {
    icon: 'cloud',
    title: 'Cloud Solutions',
    description: 'Migrate to the cloud or optimize your existing cloud infrastructure for better performance.'
  },
  {
    icon: 'database',
    title: 'Database Management',
    description: 'Design, implement, and maintain efficient database systems to secure your valuable data.'
  },
  {
    icon: 'settings',
    title: 'DevOps Services',
    description: 'Implement DevOps practices to streamline development, testing, and deployment processes.'
  },
  {
    icon: 'shield',
    title: 'Cybersecurity Solutions',
    description: 'Protect your business with comprehensive security solutions and best practices.'
  }
];

const testimonials = [
  {
    content: "TeckNet delivered a custom CRM solution that transformed our customer management process. Their team was professional and responsive throughout the project.",
    author: "Jane Doe",
    title: "CEO, Acme Corp",
    rating: 5
  },
  {
    content: "The mobile app TeckNet developed for our retail business has increased our customer engagement by 45%. They truly understood our business needs.",
    author: "Michael Smith",
    title: "Marketing Director, RetailPlus",
    rating: 5
  },
  {
    content: "Working with TeckNet on our cloud migration was seamless. Their expertise saved us thousands in infrastructure costs while improving system reliability.",
    author: "Alex Thompson",
    title: "CTO, TechInnovate",
    rating: 4.5
  }
];

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-primary">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                Custom Software Solutions for Your Business
              </h1>
              <p className="mt-6 max-w-2xl text-xl text-blue-100">
                We develop tailored software solutions to help your business grow and succeed in the digital world.
              </p>
              <div className="mt-10 flex space-x-4">
                <Link href="/services">
                  <Button size="lg" variant="default" className="bg-white text-primary hover:bg-gray-100">
                    Our Services
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="default" className="bg-primary text-white border border-white hover:bg-primary/90">
                    Schedule a Demo
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 mt-10 lg:mt-0">
              <img 
                src="https://images.unsplash.com/photo-1573164574511-73c773193279?auto=format&fit=crop&w=800&q=80" 
                alt="Software development team working" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Our Services
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                Comprehensive software development services to meet your business needs
              </p>
            </div>

            <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <ServiceCard 
                  key={index}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                What Our Clients Say
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                Hear from businesses that have transformed with our solutions
              </p>
            </div>

            <div className="mt-12 grid gap-6 grid-cols-1 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard 
                  key={index}
                  content={testimonial.content}
                  author={testimonial.author}
                  title={testimonial.title}
                  rating={testimonial.rating}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to start your project?</span>
              <span className="block text-blue-100">Get in touch with our team today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link href="/contact">
                  <Button size="lg" className="bg-white text-primary hover:bg-blue-50">
                    Contact Us
                  </Button>
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Link href="/services">
                  <Button size="lg" variant="default" className="bg-primary text-white border border-white hover:bg-primary/90">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
