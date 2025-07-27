"use client"

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  FileText,
  Users,
  MessageSquare,
  ClipboardCheck,
  BarChart3,
  BookOpen,
  HelpCircle
} from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@workspace/ui/components/chart";
import { CompletionStat } from "../../services/suratTugas/types";
import { useRole } from "@/hooks/useRole";

interface CompletionStatsChartProps {
  completionStats?: {
    surat_pemberitahuan: CompletionStat;
    entry_meeting: CompletionStat;
    konfirmasi_meeting: CompletionStat;
    exit_meeting: CompletionStat;
    matriks: CompletionStat;
    laporan_hasil: CompletionStat;
    kuisioner: CompletionStat;
  };
  loading?: boolean;
}

const CompletionStatsChart: React.FC<CompletionStatsChartProps> = ({
  completionStats,
  loading = false
}) => {
  const { isAdmin } = useRole();

  // Filter completion stats based on role
  const filteredStats = React.useMemo(() => {
    if (!completionStats) return {};

    return Object.fromEntries(
      Object.entries(completionStats).filter(([stepKey]) => {
        if (stepKey === 'laporan_hasil' && !isAdmin()) {
          return false;
        }
        return true;
      })
    );
  }, [completionStats, isAdmin]);

  // Determine grid classes based on chart count
  const chartCount = Object.keys(filteredStats).length;
  const getGridClasses = () => {
    if (chartCount === 6) {
      // 6 charts: 2x3 grid on large screens, responsive on smaller
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";
    } else if (chartCount === 7) {
      // 7 charts: flexible grid that handles odd number well
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";
    }
    // Default fallback
    return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";
  };
  if (loading || !completionStats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={getGridClasses()}>
            {Array.from({ length: isAdmin() ? 7 : 6 }).map((_, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader className="items-center pb-0">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                  <div className="mx-auto aspect-square max-h-[200px] flex items-center justify-center">
                    <Skeleton className="h-32 w-32 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t">
            <div className="grid grid-cols-3 gap-4 text-center">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-1">
                  <Skeleton className="h-8 w-16 mx-auto" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if all stats are zero (no data)
  const hasNoData = Object.values(completionStats).every(stat => stat.total === 0);

  // Early return for debugging
  if (hasNoData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Status Penyelesaian Tahapan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Belum Ada Data
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Belum ada surat tugas yang dibuat. Silakan buat surat tugas terlebih dahulu untuk melihat statistik penyelesaian.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

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

  // Chart config for completion status
  const chartConfig = {
    count: {
      label: "Jumlah",
    },
    completed: {
      label: "Selesai",
      color: "#10b981", // green-500
    },
    remaining: {
      label: "Tersisa",
      color: "#e5e7eb", // gray-200
    },
  } satisfies ChartConfig;

  // Prepare data for each donut chart
  const preparePieData = (stats: CompletionStat) => [
    {
      status: "completed",
      count: stats.completed,
      fill: "#10b981" // green-500 for completed
    },
    {
      status: "remaining",
      count: stats.remaining,
      fill: "#e5e7eb" // gray-200 for remaining
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>Status Penyelesaian Tahapan</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Grid of Donut Charts */}
        <div className={getGridClasses()}>
          {Object.entries(filteredStats)
            .sort(([, a], [, b]) => b.percentage - a.percentage)
            .map(([stepKey, stats]) => {
              const pieData = preparePieData(stats);
              const totalTasks = stats.total;

              return (
                <Card key={stepKey} className="flex flex-col">
                  <CardHeader className="items-center pb-0">
                    <div className="flex items-center space-x-2">
                      {getStepIcon(stepKey)}
                      <CardTitle className="text-sm font-medium">
                        {getStepName(stepKey)}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 pb-0">
                    <ChartContainer
                      config={chartConfig}
                      className="mx-auto aspect-square max-h-[200px]"
                    >
                      <PieChart>
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                          data={pieData}
                          dataKey="count"
                          nameKey="status"
                          innerRadius={50}
                          strokeWidth={5}
                        >
                          <Label
                            content={({ viewBox }) => {
                              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                return (
                                  <text
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                  >
                                    <tspan
                                      x={viewBox.cx}
                                      y={viewBox.cy}
                                      className="fill-foreground text-2xl font-bold"
                                    >
                                      {stats.completed}
                                    </tspan>
                                    <tspan
                                      x={viewBox.cx}
                                      y={(viewBox.cy || 0) + 20}
                                      className="fill-muted-foreground text-sm"
                                    >
                                      dari {totalTasks}
                                    </tspan>
                                  </text>
                                )
                              }
                            }}
                          />
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompletionStatsChart;