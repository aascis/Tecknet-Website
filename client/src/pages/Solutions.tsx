import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { 
  ChevronRight, 
  Building, 
  ShoppingBag, 
  Truck, 
  Activity, 
  Briefcase, 
  School 
} from 'lucide-react';

const Solutions = () => {
  const industrySolutions = [
    {
      icon: <Building className="h-10 w-10 text-white" />,
      title: "Enterprise Solutions",
      description: "Scalable software solutions for large corporations that streamline operations, improve productivity, and drive digital transformation.",
      features: [
        "Enterprise Resource Planning (ERP)",
        "Business Intelligence & Analytics",
        "Digital Workplace Solutions",
        "Cloud Migration & Infrastructure"
      ]
    },
    {
      icon: <ShoppingBag className="h-10 w-10 text-white" />,
      title: "Retail & E-Commerce",
      description: "End-to-end digital solutions for retail businesses looking to enhance customer experience and optimize sales processes.",
      features: [
        "E-Commerce Platforms",
        "Inventory Management Systems",
        "Customer Loyalty Solutions",
        "POS Integration"
      ]
    },
    {
      icon: <Truck className="h-10 w-10 text-white" />,
      title: "Logistics & Supply Chain",
      description: "Technology solutions that optimize logistics operations, providing visibility and efficiency throughout the supply chain.",
      features: [
        "Supply Chain Management",
        "Route Optimization",
        "Warehouse Management",
        "IoT Fleet Tracking"
      ]
    },
    {
      icon: <Activity className="h-10 w-10 text-white" />,
      title: "Healthcare",
      description: "Innovative software solutions for healthcare providers that improve patient care while enhancing operational efficiency.",
      features: [
        "Electronic Health Records",
        "Telehealth Platforms",
        "Medical Practice Management",
        "Healthcare Analytics"
      ]
    },
    {
      icon: <Briefcase className="h-10 w-10 text-white" />,
      title: "Financial Services",
      description: "Secure, compliant software solutions for banks, insurance companies, and financial institutions.",
      features: [
        "Banking & Payment Solutions",
        "Risk Management Systems",
        "Regulatory Compliance Software",
        "Financial Analytics"
      ]
    },
    {
      icon: <School className="h-10 w-10 text-white" />,
      title: "Education",
      description: "Digital learning platforms and administrative systems for educational institutions of all sizes.",
      features: [
        "Learning Management Systems",
        "Student Information Systems",
        "Virtual Classroom Solutions",
        "Educational Analytics"
      ]
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
              Industry-Specific Solutions
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100">
              Tailored software solutions designed for the unique challenges of your industry
            </p>
          </div>
        </div>

        {/* Industry Solutions Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Solutions by Industry
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                We understand the specific challenges and requirements of different industries
              </p>
            </div>

            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {industrySolutions.map((solution, index) => (
                <div key={index} className="bg-gray-50 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <div className="p-6">
                    <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-4">
                      {solution.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{solution.title}</h3>
                    <p className="text-gray-600 mb-4">
                      {solution.description}
                    </p>
                    <ul className="space-y-2">
                      {solution.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mr-1.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Case Studies Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Success Stories
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                See how our solutions have helped businesses overcome challenges and achieve their goals
              </p>
            </div>

            <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-300">
                  <img 
                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80" 
                    alt="Enterprise case study" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block bg-primary-light text-white text-xs font-semibold px-2.5 py-1 rounded-full mb-2">Enterprise</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Global Manufacturer Digital Transformation</h3>
                  <p className="text-gray-600 mb-4">
                    How we helped a global manufacturer streamline operations and reduce costs by 32% through digital transformation.
                  </p>
                  <Link href="/contact">
                    <a className="text-primary font-medium hover:text-primary-dark flex items-center">
                      Read Case Study
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </a>
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-300">
                  <img 
                    src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=800&q=80" 
                    alt="Healthcare case study" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block bg-primary-light text-white text-xs font-semibold px-2.5 py-1 rounded-full mb-2">Healthcare</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Telehealth Platform for Regional Hospital</h3>
                  <p className="text-gray-600 mb-4">
                    Developing a secure telehealth solution that increased patient access by 200% during the pandemic.
                  </p>
                  <Link href="/contact">
                    <a className="text-primary font-medium hover:text-primary-dark flex items-center">
                      Read Case Study
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </a>
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-300">
                  <img 
                    src="https://images.unsplash.com/photo-1556740772-1635662a74e0?auto=format&fit=crop&w=800&q=80" 
                    alt="Retail case study" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block bg-primary-light text-white text-xs font-semibold px-2.5 py-1 rounded-full mb-2">Retail</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">E-Commerce Transformation for National Retailer</h3>
                  <p className="text-gray-600 mb-4">
                    How we helped a brick-and-mortar retailer build an omnichannel experience that boosted online sales by 156%.
                  </p>
                  <Link href="/contact">
                    <a className="text-primary font-medium hover:text-primary-dark flex items-center">
                      Read Case Study
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Partnerships Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Our Technology Partners
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                We partner with industry-leading technology providers to deliver the best solutions
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
              {/* These would be actual partner logos in a real implementation */}
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex justify-center">
                  <div className="h-16 w-32 bg-gray-200 rounded flex items-center justify-center text-gray-500 font-semibold">
                    Partner {i+1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Need a custom solution?</span>
              <span className="block text-blue-100">Let's discuss your specific requirements.</span>
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
                  <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white">
                    Our Services
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

export default Solutions;
