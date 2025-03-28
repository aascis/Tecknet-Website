import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { 
  ArrowRight, 
  Code, 
  Smartphone, 
  Cloud, 
  Database, 
  Settings, 
  Shield,
  Globe,
  Server,
  Users
} from 'lucide-react';

const Services = () => {
  const mainServices = [
    {
      icon: 'code',
      title: 'Custom Software Development',
      description: 'We build custom software solutions tailored to your specific business requirements, from enterprise applications to specialized tools that drive efficiency and growth.'
    },
    {
      icon: 'smartphone',
      title: 'Mobile App Development',
      description: 'Create powerful, intuitive mobile applications for iOS and Android platforms that engage your customers and streamline business operations.'
    },
    {
      icon: 'cloud',
      title: 'Cloud Solutions',
      description: 'Migrate to the cloud or optimize your existing cloud infrastructure for better performance, reliability, and scalability while reducing costs.'
    },
    {
      icon: 'database',
      title: 'Database Management',
      description: 'Design, implement, and maintain efficient database systems to secure your valuable data with solutions optimized for performance and security.'
    },
    {
      icon: 'settings',
      title: 'DevOps Services',
      description: 'Implement DevOps practices to streamline development, testing, and deployment processes, improving your delivery speed and software quality.'
    },
    {
      icon: 'shield',
      title: 'Cybersecurity Solutions',
      description: 'Protect your business with comprehensive security solutions and best practices, including penetration testing, security audits, and compliance.'
    }
  ];

  const additionalServices = [
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Web Application Development',
      description: 'Build responsive, modern web applications that work seamlessly across all devices and platforms.'
    },
    {
      icon: <Server className="h-6 w-6" />,
      title: 'API Development & Integration',
      description: 'Create robust APIs and seamlessly integrate with third-party services and systems.'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'IT Consulting',
      description: 'Strategic guidance on technology solutions to solve business challenges and drive innovation.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-primary py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              Our Services
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100">
              End-to-end software development services to transform your business
            </p>
          </div>
        </div>

        {/* Main Services Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Comprehensive Software Solutions
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                We provide a wide range of software development services to help businesses succeed in the digital era
              </p>
            </div>

            <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {mainServices.map((service, index) => (
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

        {/* Additional Services */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Additional Services
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                Beyond our core offerings, we provide specialized services to meet unique business needs
              </p>
            </div>

            <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
              {additionalServices.map((service, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                    <div className="text-white">{service.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                  <p className="mt-2 text-gray-600">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Development Process */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Our Development Process
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                We follow a proven methodology to deliver high-quality software solutions
              </p>
            </div>

            <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <div className="relative">
                <div className="absolute top-0 left-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">1</div>
                <div className="pl-16">
                  <h3 className="text-xl font-bold text-gray-900">Discovery</h3>
                  <p className="mt-2 text-gray-600">We analyze your business needs and define project requirements</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute top-0 left-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">2</div>
                <div className="pl-16">
                  <h3 className="text-xl font-bold text-gray-900">Design</h3>
                  <p className="mt-2 text-gray-600">Our team creates architecture and user experience designs</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute top-0 left-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">3</div>
                <div className="pl-16">
                  <h3 className="text-xl font-bold text-gray-900">Development</h3>
                  <p className="mt-2 text-gray-600">We build your solution using agile development methodologies</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute top-0 left-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">4</div>
                <div className="pl-16">
                  <h3 className="text-xl font-bold text-gray-900">Delivery</h3>
                  <p className="mt-2 text-gray-600">Launch, support, and continuous improvement of your solution</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="block text-blue-100">Let's discuss your project today.</span>
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
                <Link href="/about">
                  <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white">
                    Learn About Us
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

export default Services;
