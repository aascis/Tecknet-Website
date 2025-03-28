import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { 
  Award, 
  CheckCircle, 
  Users, 
  Zap, 
  Globe,
  Star,
  ThumbsUp,
  Heart
} from 'lucide-react';

const About = () => {
  const teamMembers = [
    {
      name: "Jane Doe",
      position: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      bio: "15+ years of experience in software development and technology leadership."
    },
    {
      name: "John Smith",
      position: "CTO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Expert in cloud architecture and emerging technologies."
    },
    {
      name: "Emily Johnson",
      position: "Lead Developer",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
      bio: "Specializes in building scalable enterprise applications."
    },
    {
      name: "Michael Wilson",
      position: "UX/UI Director",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
      bio: "Passionate about creating exceptional user experiences."
    }
  ];

  const values = [
    {
      icon: <ThumbsUp className="h-8 w-8 text-primary" />,
      title: "Excellence",
      description: "We strive for excellence in every project, delivering solutions that exceed expectations."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Collaboration",
      description: "We believe in working closely with our clients to create solutions that truly address their needs."
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Innovation",
      description: "We constantly explore new technologies and methodologies to deliver cutting-edge solutions."
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Integrity",
      description: "We conduct business with honesty, transparency, and a strong ethical foundation."
    }
  ];

  const milestones = [
    {
      year: "2010",
      title: "Company Founded",
      description: "TeckNet was established with a mission to deliver innovative software solutions."
    },
    {
      year: "2013",
      title: "50th Client",
      description: "Reached milestone of 50 satisfied clients across diverse industries."
    },
    {
      year: "2015",
      title: "Global Expansion",
      description: "Opened new offices to better serve international clients."
    },
    {
      year: "2018",
      title: "Industry Recognition",
      description: "Received multiple awards for innovation and excellence in software development."
    },
    {
      year: "2021",
      title: "100+ Team Members",
      description: "Expanded our talented team to over 100 professionals."
    },
    {
      year: "Today",
      title: "Continuing to Innovate",
      description: "Constantly evolving to meet the changing needs of our clients in the digital landscape."
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
              About TeckNet
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100">
              A leading software development company committed to delivering innovative solutions since 2010
            </p>
          </div>
        </div>

        {/* Our Story Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Our Story
                </h2>
                <p className="mt-3 max-w-3xl text-lg text-gray-500">
                  Founded in 2010, TeckNet began with a simple mission: to help businesses leverage technology to solve complex problems and drive growth. What started as a small team of passionate developers has grown into a comprehensive software development company serving clients around the world.
                </p>
                <p className="mt-3 max-w-3xl text-lg text-gray-500">
                  Over the years, we've built a reputation for delivering high-quality, innovative solutions across various industries, from enterprise business applications to cutting-edge mobile experiences. Our team combines technical expertise with business acumen to create software that not only meets technical requirements but also drives tangible business results.
                </p>
                <p className="mt-3 max-w-3xl text-lg text-gray-500">
                  Today, we continue to evolve and adapt to the changing technology landscape, staying at the forefront of innovation while maintaining our commitment to excellence and customer satisfaction.
                </p>
              </div>
              <div className="mt-10 lg:mt-0">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
                  alt="TeckNet team" 
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Our Values
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                The core principles that guide everything we do
              </p>
            </div>

            <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-center">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leadership Team Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Our Leadership Team
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                Meet the experienced professionals who guide our company
              </p>
            </div>

            <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg">
                  <img src={member.image} alt={member.name} className="w-full h-64 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                    <p className="text-primary font-medium">{member.position}</p>
                    <p className="mt-2 text-gray-600">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Milestones Timeline */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Our Journey
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                Key milestones that have shaped our company
              </p>
            </div>

            <div className="mt-12 relative">
              {/* Timeline Line */}
              <div className="hidden md:block absolute left-1/2 h-full w-0.5 bg-gray-300 transform -translate-x-1/2"></div>
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`relative md:flex ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                    {/* Year Bubble */}
                    <div className="hidden md:block absolute left-1/2 w-12 h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center transform -translate-x-1/2">
                      {milestone.year.substring(0, 2)}
                    </div>
                    
                    {/* Content */}
                    <div className={`md:w-5/12 bg-white p-6 rounded-lg shadow-md ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                      <div className="md:hidden w-12 h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center mb-4">
                        {milestone.year.substring(0, 2)}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{milestone.year} - {milestone.title}</h3>
                      <p className="mt-2 text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to work with us?</span>
              <span className="block text-blue-100">Get in touch today to discuss your project.</span>
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

export default About;
