import { 
  Code, 
  Smartphone, 
  Cloud, 
  Database, 
  Settings, 
  Shield,
  LucideIcon
} from 'lucide-react';

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
}

const ServiceCard = ({ icon, title, description }: ServiceCardProps) => {
  const getIcon = (): JSX.Element => {
    switch (icon) {
      case 'code':
        return <Code className="text-white text-xl" />;
      case 'smartphone':
        return <Smartphone className="text-white text-xl" />;
      case 'cloud':
        return <Cloud className="text-white text-xl" />;
      case 'database':
        return <Database className="text-white text-xl" />;
      case 'settings':
        return <Settings className="text-white text-xl" />;
      case 'shield':
        return <Shield className="text-white text-xl" />;
      default:
        return <Code className="text-white text-xl" />;
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
        {getIcon()}
      </div>
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">
        {description}
      </p>
    </div>
  );
};

export default ServiceCard;
