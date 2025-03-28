import { 
  Database, 
  Bug, 
  Calendar, 
  FileText, 
  BarChart,
  LucideIcon
} from 'lucide-react';

interface AppLinkCardProps {
  name: string;
  icon: string;
  url: string;
}

const AppLinkCard = ({ name, icon, url }: AppLinkCardProps) => {
  const getIcon = () => {
    switch (icon) {
      case 'database':
        return <Database className="text-white" />;
      case 'bug':
        return <Bug className="text-white" />;
      case 'calendar':
        return <Calendar className="text-white" />;
      case 'file-text':
        return <FileText className="text-white" />;
      case 'bar-chart':
        return <BarChart className="text-white" />;
      default:
        return <Database className="text-white" />;
    }
  };

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
    >
      <div className="p-5 flex flex-col items-center">
        <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
          {getIcon()}
        </div>
        <div className="mt-3 text-center">
          <h3 className="text-lg font-medium text-gray-900">{name}</h3>
        </div>
      </div>
    </a>
  );
};

export default AppLinkCard;
