import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { Services } from "@/components/home/Services";
import { About } from "@/components/home/About";
import { Portfolio } from "@/components/home/Portfolio";
import { Contact } from "@/components/home/Contact";
import { useEffect } from "react";

export default function HomePage() {
  // Set up event listeners for the login modal triggers from footer
  useEffect(() => {
    const handleOpenLoginModal = (event: CustomEvent<{ type: string }>) => {
      const loginButtons = document.querySelectorAll('.dropdown-menu-login-button');
      const type = event.detail.type;
      
      if (type === 'employee') {
        // Find and click the employee login button
        (loginButtons[0] as HTMLButtonElement)?.click();
      } else if (type === 'customer') {
        // Find and click the customer login button
        (loginButtons[1] as HTMLButtonElement)?.click();
      } else if (type === 'register') {
        // Find and click the register button
        (loginButtons[2] as HTMLButtonElement)?.click();
      }
    };

    // Add event listener for custom event
    window.addEventListener('open-login-modal', handleOpenLoginModal as EventListener);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('open-login-modal', handleOpenLoginModal as EventListener);
    };
  }, []);

  // Smooth scroll to sections when clicking on nav links
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#"]');
      
      if (link && link.getAttribute('href') !== '#') {
        e.preventDefault();
        const targetId = link.getAttribute('href')?.substring(1);
        const targetElement = document.getElementById(targetId as string);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Services />
        <About />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
