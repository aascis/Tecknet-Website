import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  AlertTriangle 
} from 'lucide-react';

interface TicketStatsProps {
  total: number;
  pending: number;
  resolved: number;
  highPriority: number;
}

const TicketStats = ({ total, pending, resolved, highPriority }: TicketStatsProps) => {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium text-gray-900">Ticket Dashboard</h2>
      <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                <Ticket className="h-6 w-6" />
              </div>
              <div className="ml-5">
                <div className="text-sm font-medium text-gray-500 truncate">
                  Total Tickets
                </div>
                <div className="mt-1 text-3xl font-semibold text-gray-900">
                  {total}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-yellow-100 text-yellow-600">
                <Clock className="h-6 w-6" />
              </div>
              <div className="ml-5">
                <div className="text-sm font-medium text-gray-500 truncate">
                  Pending Tickets
                </div>
                <div className="mt-1 text-3xl font-semibold text-gray-900">
                  {pending}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="ml-5">
                <div className="text-sm font-medium text-gray-500 truncate">
                  Resolved Tickets
                </div>
                <div className="mt-1 text-3xl font-semibold text-gray-900">
                  {resolved}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-red-100 text-red-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="ml-5">
                <div className="text-sm font-medium text-gray-500 truncate">
                  High Priority
                </div>
                <div className="mt-1 text-3xl font-semibold text-gray-900">
                  {highPriority}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketStats;
