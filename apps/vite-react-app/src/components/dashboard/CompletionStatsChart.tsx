import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import { Badge } from "@workspace/ui/components/badge";
import { 
  CheckCircle, 
  Clock, 
  FileText,
  Users,
  MessageSquare,
  ClipboardCheck,
  BarChart3,
  BookOpen,
  HelpCircle
} from "lucide-react";
import { CompletionStat } from "../../services/suratTugas/types";

interface CompletionStatsChartProps {
  completionStats: {
    surat_pemberitahuan: CompletionStat;
    entry_meeting: CompletionStat;
    konfirmasi_meeting: CompletionStat;
    exit_meeting: CompletionStat;
    matriks: CompletionStat;
    laporan_hasil: CompletionStat;
    kuisioner: CompletionStat;
  };
}

const CompletionStatsChart: React.FC<CompletionStatsChartProps> = ({ 
  completionStats 
}) => {
  const getStepIcon = (stepKey: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      surat_pemberitahuan: <FileText className="h-4 w-4" />,
      entry_meeting: <Users className="h-4 w-4" />,
      konfirmasi_meeting: <MessageSquare className="h-4 w-4" />,
      exit_meeting: <Users className="h-4 w-4" />,
      matriks: <BarChart3 className="h-4 w-4" />,
      laporan_hasil: <BookOpen className="h-4 w-4" />,
      kuisioner: <HelpCircle className="h-4 w-4" />
    };
    return iconMap[stepKey] || <ClipboardCheck className="h-4 w-4" />;
  };

  const getStepName = (stepKey: string) => {
    const nameMap: Record<string, string> = {
      surat_pemberitahuan: "Surat Pemberitahuan",
      entry_meeting: "Entry Meeting",
      konfirmasi_meeting: "Konfirmasi Meeting",
      exit_meeting: "Exit Meeting",
      matriks: "Matriks Evaluasi",
      laporan_hasil: "Laporan Hasil",
      kuisioner: "Kuesioner"
    };
    return nameMap[stepKey] || stepKey.replace('_', ' ');
  };

  const getProgressBadgeVariant = (percentage: number) => {
    if (percentage >= 80) return "default";
    if (percentage >= 50) return "secondary";
    return "destructive";
  };

  const sortedStats = Object.entries(completionStats).sort(
    ([, a], [, b]) => b.percentage - a.percentage
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>Status Penyelesaian Tahapan</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedStats.map(([stepKey, stats]) => (
            <div key={stepKey} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStepIcon(stepKey)}
                  <span className="text-sm font-medium">
                    {getStepName(stepKey)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={getProgressBadgeVariant(stats.percentage)}
                    className="text-xs"
                  >
                    {stats.percentage}%
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {stats.completed}/{stats.total}
                  </span>
                </div>
              </div>
              
              <div className="space-y-1">
                <Progress value={stats.percentage} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Selesai: {stats.completed}</span>
                  </span>
                  {stats.remaining > 0 && (
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-yellow-500" />
                      <span>Tersisa: {stats.remaining}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Section */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">
                {Object.values(completionStats).reduce((sum, stat) => sum + stat.completed, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Total Selesai</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-600">
                {Object.values(completionStats).reduce((sum, stat) => sum + stat.remaining, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Total Tersisa</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">
                {Object.values(completionStats).reduce((sum, stat) => sum + stat.total, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Total Keseluruhan</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompletionStatsChart;