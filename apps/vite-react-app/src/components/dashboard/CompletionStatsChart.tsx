"use client"

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
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
        {/* Grid of Donut Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedStats.map(([stepKey, stats]) => {
            const pieData = preparePieData(stats);
            const totalTasks = React.useMemo(() => {
              return stats.total;
            }, [stats]);
            
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

        {/* Summary Section */}
        <div className="mt-8 pt-6 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(completionStats).reduce((sum, stat) => sum + stat.completed, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Selesai</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-yellow-600">
                {Object.values(completionStats).reduce((sum, stat) => sum + stat.remaining, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Tersisa</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-600">
                {Object.values(completionStats).reduce((sum, stat) => sum + stat.total, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Keseluruhan</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompletionStatsChart;