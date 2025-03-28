import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Subscription } from "@shared/schema";
import { format } from "date-fns";

function formatRenewalDate(dateString: string | Date) {
  if (!dateString) return "N/A";
  return format(new Date(dateString), "MMMM d, yyyy");
}

export function SubscriptionCard() {
  const { data: subscriptions, isLoading, error } = useQuery<Subscription[]>({
    queryKey: ['/api/subscriptions'],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-28 bg-muted animate-pulse rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6">
            <p className="text-muted-foreground">Unable to load subscription data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If no subscriptions, show a message
  if (!subscriptions || subscriptions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6">
            <p className="text-muted-foreground">You don't have any active subscriptions</p>
            <Button className="mt-4">Contact Sales</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Subscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {subscriptions.map((subscription) => (
            <div key={subscription.id} className="bg-muted rounded-lg p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-xl font-semibold">{subscription.name}</span>
                    <Badge variant="success" className="ml-2">
                      {subscription.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-2">{subscription.description}</p>
                  <div className="text-sm">
                    <span className="font-medium">Renewal Date:</span> {formatRenewalDate(subscription.renewalDate || "")}
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex">
                  <Button variant="outline" size="sm" className="mr-2">
                    View Details
                  </Button>
                  <Button size="sm">Manage</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
