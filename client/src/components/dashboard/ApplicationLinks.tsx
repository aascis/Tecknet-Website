import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { AppLink } from "@shared/schema";
import { Icon } from "@/lib/icons";

export function ApplicationLinks() {
  const { data: appLinks, isLoading, error } = useQuery<AppLink[]>({
    queryKey: ['/api/app-links'],
  });

  const [isClient, setIsClient] = useState(false);

  // Check if we're in the browser (client-side)
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Company Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !appLinks) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Company Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            <p>Unable to load application links</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          {appLinks.map((appLink) => (
            <a
              key={appLink.id}
              href={appLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-white border border-border rounded-md hover:border-primary transition-colors"
            >
              <Icon name={appLink.icon} className="w-5 h-5 mr-3 text-primary" />
              <span>{appLink.name}</span>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
