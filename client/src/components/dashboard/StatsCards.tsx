import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Icon } from "@/lib/icons";

interface TicketStats {
  open: number;
  inProgress: number;
  resolved: number;
  highPriority?: number;
  total: number;
  assignedToMe?: number;
}

interface StatsCardProps {
  icon: string;
  title: string;
  value: number | string;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorClass?: string;
}

function StatsCard({ icon, title, value, description, trend, colorClass = "bg-primary/10 text-primary" }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">{title}</h3>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
            <Icon name={icon} className="h-5 w-5" />
          </div>
        </div>
        <div className="text-3xl font-semibold mb-1">{value}</div>
        {description && (
          <div className="text-sm text-muted-foreground">
            {trend && (
              <span className={trend.isPositive ? "text-[#107C10]" : "text-destructive"}>
                <Icon name={trend.isPositive ? "arrow-up" : "arrow-down"} className="inline mr-1 h-3 w-3" />
                {trend.value}%
              </span>
            )}{' '}
            {description}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface StatsCardsProps {
  userRole: "employee" | "customer" | "admin";
}

export function StatsCards({ userRole }: StatsCardsProps) {
  const { data: stats, isLoading } = useQuery<TicketStats>({
    queryKey: ['/api/tickets/stats'],
  });

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-5 w-24 bg-muted animate-pulse rounded"></div>
                <div className="w-10 h-10 rounded-full bg-muted animate-pulse"></div>
              </div>
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2"></div>
              <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (userRole === "employee" || userRole === "admin") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          icon="ticket"
          title="Open Tickets"
          value={stats.open}
          description="awaiting response"
          colorClass="bg-primary/10 text-primary"
        />
        <StatsCard
          icon="check-circle"
          title="Resolved Today"
          value={stats.resolved}
          trend={{ value: 12, isPositive: true }}
          description="from yesterday"
          colorClass="bg-[#107C10]/10 text-[#107C10]"
        />
        <StatsCard
          icon="alert-circle"
          title="High Priority"
          value={stats.highPriority || 0}
          trend={{ value: 2, isPositive: false }}
          description="new since yesterday"
          colorClass="bg-destructive/10 text-destructive"
        />
      </div>
    );
  }

  // For customers
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatsCard
        icon="ticket"
        title="Open Tickets"
        value={stats.open}
        description="awaiting response"
        colorClass="bg-primary/10 text-primary"
      />
      <StatsCard
        icon="clock"
        title="In Progress"
        value={stats.inProgress}
        description="being worked on"
        colorClass="bg-secondary/10 text-secondary"
      />
      <StatsCard
        icon="check-circle"
        title="Resolved"
        value={stats.resolved}
        description="recently completed"
        colorClass="bg-[#107C10]/10 text-[#107C10]"
      />
    </div>
  );
}
