import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Subscription } from '@/lib/api';

interface SubscriptionCardProps {
  subscription: Subscription;
}

const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
  // Format renewal date
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="bg-white shadow overflow-hidden rounded-lg">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{subscription.name}</h3>
            {subscription.description && (
              <p className="mt-1 text-sm text-gray-500">
                {subscription.description}
              </p>
            )}
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-4 w-4 mr-1" />
            {subscription.status}
          </span>
        </div>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Subscription ID
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              #{subscription.subscriptionId}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Renewal Date
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formatDate(subscription.renewalDate)}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              License Type
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {subscription.licenseType || 'Standard'}
            </dd>
          </div>
        </dl>
      </div>
      <div className="px-4 py-4 sm:px-6 bg-gray-50 flex justify-end">
        <Button variant="ghost" className="text-primary hover:text-primary-dark">
          View Details
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionCard;
