interface Project {
  image: string;
  alt: string;
  category: {
    name: string;
    color: string;
  };
  title: string;
  description: string;
}

export function Portfolio() {
  const projects: Project[] = [
    {
      image: "https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=340&q=80",
      alt: "E-Commerce Platform",
      category: {
        name: "E-Commerce",
        color: "bg-primary bg-opacity-10 text-primary"
      },
      title: "Custom Retail Platform",
      description: "A comprehensive e-commerce solution with inventory management and customer analytics."
    },
    {
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=340&q=80",
      alt: "Healthcare Application",
      category: {
        name: "Healthcare",
        color: "bg-secondary bg-opacity-10 text-secondary"
      },
      title: "Patient Management System",
      description: "An integrated solution for healthcare providers to manage patient records securely."
    },
    {
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=340&q=80",
      alt: "Logistics System",
      category: {
        name: "Logistics",
        color: "bg-[#107C10] bg-opacity-10 text-[#107C10]"
      },
      title: "Fleet Management Platform",
      description: "Real-time tracking and optimization system for transportation companies."
    }
  ];

  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-neutral-800 mb-4">Our Work</h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">Explore some of our recent projects and solutions we've delivered for our clients.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.alt} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                />
              </div>
              <div className="p-6">
                <span className={`inline-block px-3 py-1 ${project.category.color} text-sm rounded-full mb-3`}>
                  {project.category.name}
                </span>
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-neutral-600 mb-4">{project.description}</p>
                <a href="#" className="text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center">
                  View Case Study 
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 ml-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="#" 
            className="inline-flex items-center bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-md font-medium transition-colors"
          >
            View All Projects 
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 ml-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
