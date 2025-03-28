import { Link } from "wouter";
import { Facebook, Twitter, Linkedin, Github } from "lucide-react";

export function Footer() {
  const openLoginModal = (type: string) => {
    // Simulate click on the respective login button in the header
    const event = new CustomEvent('open-login-modal', { detail: { type } });
    window.dispatchEvent(event);
  };

  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-6">TeckNet</h3>
            <p className="mb-6 opacity-80">
              Providing innovative software solutions to businesses since 2010. Your technology partner for digital success.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-colors">
                <Linkedin size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-colors">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-colors">
                <Github size={16} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="opacity-80 hover:opacity-100 transition-opacity">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#services" className="opacity-80 hover:opacity-100 transition-opacity">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/#about" className="opacity-80 hover:opacity-100 transition-opacity">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#portfolio" className="opacity-80 hover:opacity-100 transition-opacity">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="opacity-80 hover:opacity-100 transition-opacity">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#services" className="opacity-80 hover:opacity-100 transition-opacity">
                  Custom Software Development
                </Link>
              </li>
              <li>
                <Link href="/#services" className="opacity-80 hover:opacity-100 transition-opacity">
                  Mobile App Development
                </Link>
              </li>
              <li>
                <Link href="/#services" className="opacity-80 hover:opacity-100 transition-opacity">
                  Cloud Solutions
                </Link>
              </li>
              <li>
                <Link href="/#services" className="opacity-80 hover:opacity-100 transition-opacity">
                  IT Consulting
                </Link>
              </li>
              <li>
                <Link href="/#services" className="opacity-80 hover:opacity-100 transition-opacity">
                  Support & Maintenance
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6">Portal Access</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => openLoginModal('employee')} 
                  className="opacity-80 hover:opacity-100 transition-opacity flex items-center"
                >
                  <span className="mr-2">👤</span> Employee Login
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openLoginModal('customer')} 
                  className="opacity-80 hover:opacity-100 transition-opacity flex items-center"
                >
                  <span className="mr-2">👤</span> Customer Login
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openLoginModal('register')} 
                  className="opacity-80 hover:opacity-100 transition-opacity flex items-center"
                >
                  <span className="mr-2">👤</span> Register as Customer
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white border-opacity-20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="opacity-80 mb-4 md:mb-0">&copy; {new Date().getFullYear()} TeckNet. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="opacity-80 hover:opacity-100 transition-opacity">
              Privacy Policy
            </Link>
            <Link href="/terms" className="opacity-80 hover:opacity-100 transition-opacity">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
