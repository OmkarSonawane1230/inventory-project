import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, icon: Icon, description, trend }: StatsCardProps) {
  return (
    <Card className="hover-elevate">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1" data-testid="text-stats-title">
              {title}
            </p>
            <h3 className="text-4xl font-bold mb-1" data-testid="text-stats-value">
              {value}
            </h3>
            {description && (
              <p className="text-xs text-muted-foreground" data-testid="text-stats-description">
                {description}
              </p>
            )}
            {trend && (
              <div className={`text-xs mt-2 ${trend.isPositive ? 'text-chart-2' : 'text-chart-4'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
              </div>
            )}
          </div>
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
