import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/auth/LoginModal";
import { RegisterModal } from "@/components/auth/RegisterModal";

export function Hero() {
  const [loginModalOpen, setLoginModalOpen] = useState<'employee' | 'customer' | null>(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const openLoginModal = (type: 'employee' | 'customer') => {
    setLoginModalOpen(type);
  };

  const openRegisterModal = () => {
    setRegisterModalOpen(true);
  };

  return (
    <section className="relative bg-gradient-primary text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center"></div>
      </div>
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-4">Custom Software Solutions for Your Business</h1>
            <p className="text-xl mb-8 opacity-90">We develop innovative software to help businesses streamline operations and achieve digital transformation.</p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-secondary hover:bg-secondary/90 text-white py-3 px-6 rounded-md font-medium transition-colors">
                Get Started
              </Button>
              <Button variant="outline" className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white/50 py-3 px-6 rounded-md font-medium transition-colors">
                Learn More
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-end">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-primary text-2xl font-semibold mb-6">Quick Access</h2>
              <div className="space-y-4">
                <button 
                  onClick={() => openLoginModal('employee')} 
                  className="flex items-center justify-between w-full bg-white hover:bg-neutral-100 border border-neutral-200 rounded-md py-3 px-4 text-neutral-800 transition-colors"
                >
                  <span className="flex items-center">
                    <span className="bg-primary/10 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </span>
                    Employee Portal
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
                <button 
                  onClick={() => openLoginModal('customer')} 
                  className="flex items-center justify-between w-full bg-white hover:bg-neutral-100 border border-neutral-200 rounded-md py-3 px-4 text-neutral-800 transition-colors"
                >
                  <span className="flex items-center">
                    <span className="bg-secondary/10 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </span>
                    Customer Portal
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
                <button 
                  onClick={openRegisterModal} 
                  className="flex items-center justify-between w-full bg-white hover:bg-neutral-100 border border-neutral-200 rounded-md py-3 px-4 text-neutral-800 transition-colors"
                >
                  <span className="flex items-center">
                    <span className="bg-[#107C10]/10 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#107C10]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <line x1="20" y1="8" x2="20" y2="14"></line>
                        <line x1="23" y1="11" x2="17" y2="11"></line>
                      </svg>
                    </span>
                    New Customer Registration
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#107C10]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modals */}
      <LoginModal 
        type={loginModalOpen} 
        isOpen={loginModalOpen !== null} 
        onClose={() => setLoginModalOpen(null)} 
      />
      
      <RegisterModal 
        isOpen={registerModalOpen} 
        onClose={() => setRegisterModalOpen(false)} 
      />
    </section>
  );
}
