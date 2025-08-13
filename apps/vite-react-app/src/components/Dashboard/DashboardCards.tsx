import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  BarChart3,
  TrendingUp,
  FileText
} from "lucide-react";
import { DashboardSummaryResponse } from "../../services/suratTugas/types";

interface DashboardCardsProps {
  dashboardData: DashboardSummaryResponse | null;
  loading?: boolean;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ dashboardData, loading = false }) => {
  if (loading || !dashboardData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-24" />
              </CardTitle>
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const { summary, user_info } = dashboardData;
  const { statistics, summary_by_relationship } = summary;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total Perwadag Card - Only for Admin/Inspektorat */}
      {user_info.role !== "PERWADAG" && statistics.total_perwadag !== undefined && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Perwadag</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.total_perwadag}</div>
            <p className="text-xs text-muted-foreground">
              {user_info.role === "INSPEKTORAT" 
                ? `Di ${user_info.inspektorat}`
                : "Keseluruhan"
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Average Progress Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rata-rata Progress</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.average_progress}%</div>
          <Progress value={statistics.average_progress} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            Keseluruhan evaluasi
          </p>
        </CardContent>
      </Card>

      {/* Completion Summary Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status Penyelesaian</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium">
            {summary_by_relationship.fully_completed_relationships} dari {summary_by_relationship.total_relationships}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Tahapan lengkap
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCards;