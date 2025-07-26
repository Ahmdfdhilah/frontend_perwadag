import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import {
  BarChart3,
  TrendingUp,
  FileText
} from "lucide-react";
import { SuratTugasDashboardSummary } from "../../services/suratTugas/types";

interface DashboardCardsProps {
  dashboardData: SuratTugasDashboardSummary;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ dashboardData }) => {
  const { summary } = dashboardData;
  const { statistics, summary_by_relationship } = summary;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total Surat Tugas Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Surat Tugas</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.total_surat_tugas}</div>
          <p className="text-xs text-muted-foreground">
            {statistics.year_filter_applied && statistics.filtered_year
              ? `Tahun ${statistics.filtered_year}`
              : "Semua tahun"
            }
          </p>
        </CardContent>
      </Card>

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