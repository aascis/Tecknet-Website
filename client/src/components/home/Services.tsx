interface ServiceItem {
  icon: string;
  iconColor: string;
  bgColor: string;
  title: string;
  description: string;
}

export function Services() {
  const services: ServiceItem[] = [
    {
      icon: "code",
      iconColor: "text-primary",
      bgColor: "bg-primary bg-opacity-10",
      title: "Custom Software Development",
      description: "We build tailored software solutions that address your specific business challenges and requirements."
    },
    {
      icon: "smartphone",
      iconColor: "text-secondary",
      bgColor: "bg-secondary bg-opacity-10",
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications that provide seamless experiences across devices."
    },
    {
      icon: "settings",
      iconColor: "text-[#107C10]",
      bgColor: "bg-[#107C10] bg-opacity-10",
      title: "IT Consulting",
      description: "Strategic technology consulting to help you make informed decisions for your digital transformation journey."
    },
    {
      icon: "cloud",
      iconColor: "text-primary",
      bgColor: "bg-primary bg-opacity-10",
      title: "Cloud Solutions",
      description: "Secure and scalable cloud infrastructure implementations and migrations for modern businesses."
    },
    {
      icon: "database",
      iconColor: "text-secondary",
      bgColor: "bg-secondary bg-opacity-10",
      title: "Database Management",
      description: "Optimized database solutions for efficient data storage, retrieval, and management."
    },
    {
      icon: "headphones",
      iconColor: "text-[#107C10]",
      bgColor: "bg-[#107C10] bg-opacity-10",
      title: "IT Support",
      description: "Comprehensive technical support and maintenance for your software and IT infrastructure."
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-neutral-800 mb-4">Our Services</h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">We provide end-to-end software development services tailored to your business needs.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="feature-card bg-white rounded-lg shadow-md p-6 transition-all duration-300 border border-neutral-200 hover:border-primary">
              <div className={`w-14 h-14 rounded-full ${service.bgColor} flex items-center justify-center mb-6`}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-6 w-6 ${service.iconColor}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  {service.icon === "code" && <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />}
                  {service.icon === "smartphone" && <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />}
                  {service.icon === "settings" && <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />}
                  {service.icon === "cloud" && <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />}
                  {service.icon === "database" && <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2 1.5 3 3.5 3h9c1.5 0 3.5-1 3.5-3V7c0-2-2-3-3.5-3h-9C6 4 4 5 4 7z" />}
                  {service.icon === "headphones" && <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0118 0v6m-4 0V8a5 5 0 00-10 0v10h10z" />}
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-neutral-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
