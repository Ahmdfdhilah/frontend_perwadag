import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PageHeader } from "../../components/common/PageHeader";
import DashboardCards from "../../components/Dashboard/DashboardCards";
import CompletionStatsChart from "../../components/Dashboard/CompletionStatsChart";
import SuratTugasTable from "../../components/SuratTugas/SuratTugasTable";
import SuratTugasCards from "../../components/SuratTugas/SuratTugasCards";
import { suratTugasService } from "../../services/suratTugas/service";
import { SuratTugasDashboardSummary } from "../../services/suratTugas/types";
import { 
  RefreshCw, 
  AlertCircle
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { toast } from "@workspace/ui/components/sonner";
import Filtering from "@/components/common/Filtering";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@workspace/ui/components/select";
import { Label } from "@workspace/ui/components/label";
import { getDefaultYearOptions, getCurrentYear } from "@/utils/yearUtils";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<SuratTugasDashboardSummary | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(getCurrentYear());
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [yearOptions, setYearOptions] = useState<{ value: string; label: string }[]>([{ value: 'all', label: 'Semua Tahun' }]);

  // Fetch year options function
  const fetchYearOptions = async () => {
    try {
      const options = await getDefaultYearOptions();
      setYearOptions(options);
    } catch (error) {
      console.error('Failed to fetch year options:', error);
    }
  };

  const fetchDashboardData = async (year?: number | null) => {
    try {
      setIsLoading(true);
      const data = await suratTugasService.getDashboardSummary(year || undefined);
      setDashboardData(data);
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      toast.error(
        error?.response?.data?.message || 
        "Gagal memuat data dashboard"
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(selectedYear);
    fetchYearOptions();
  }, [selectedYear]);

  const handleYearChange = (value: string) => {
    if (value === 'all') {
      setSelectedYear(null);
    } else {
      setSelectedYear(parseInt(value));
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData(selectedYear);
  };

  const handleViewAllSuratTugas = () => {
    navigate(`/surat-tugas`);
  };

  const getRoleTitle = (userRole: string) => {
    switch (userRole) {
      case "ADMIN":
        return "Dashboard Administrator";
      case "INSPEKTORAT":
        return "Dashboard Inspektorat";
      case "PERWADAG":
        return "Dashboard Perwadag";
      default:
        return "Dashboard";
    }
  };

  const getWelcomeMessage = (userRole: string, userName: string) => {
    switch (userRole) {
      case "ADMIN":
        return `Selamat datang, ${userName}. Kelola semua evaluasi dari sini.`;
      case "INSPEKTORAT":
        return `Selamat datang, ${userName}. Monitor evaluasi di wilayah Anda.`;
      case "PERWADAG":
        return `Selamat datang, ${userName}. Pantau progress evaluasi Anda.`;
      default:
        return `Selamat datang, ${userName}.`;
    }
  };

  if (isLoading && !dashboardData) {
    return (
      <div className="space-y-6">
        <Helmet>
          <title>Dashboard - Loading...</title>
        </Helmet>
        
        <PageHeader
          title="Dashboard"
          description="Memuat data dashboard..."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="space-y-6">
        <Helmet>
          <title>Dashboard - Error</title>
        </Helmet>
        
        <PageHeader
          title="Dashboard"
          description="Gagal memuat data"
        />

        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Gagal Memuat Data</h3>
            <p className="text-muted-foreground mb-4">
              Terjadi kesalahan saat memuat data dashboard.
            </p>
            <Button onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Helmet>
        <title>{getRoleTitle(dashboardData.user_info.role)} - Sistem Evaluasi</title>
      </Helmet>

      {/* Page Header */}
      <PageHeader
        title={getRoleTitle(dashboardData.user_info.role)}
        description={getWelcomeMessage(dashboardData.user_info.role, dashboardData.user_info.nama)}
        actions={
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        }
      />

      {/* Year Filter */}
      <Filtering>
        <div className="space-y-2">
          <Label htmlFor="year-filter">Periode (Tahun)</Label>
          <Select 
            value={selectedYear ? selectedYear.toString() : 'all'} 
            onValueChange={handleYearChange}
            disabled={isLoading}
          >
            <SelectTrigger id="year-filter">
              <SelectValue placeholder="Pilih tahun" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Filtering>

      {/* Dashboard Cards */}
      <DashboardCards dashboardData={dashboardData} />

      {/* Charts and Tables Grid */}
      <CompletionStatsChart 
          completionStats={dashboardData.summary.completion_stats} 
        />

      {/* Recent Surat Tugas */}
      {dashboardData.summary.recent_surat_tugas.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Surat Tugas Terbaru</h3>
          
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <SuratTugasTable
              data={dashboardData.summary.recent_surat_tugas}
              loading={isLoading}
              isDashboard={true}
              onViewAll={handleViewAllSuratTugas}
            />
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            <SuratTugasCards
              data={dashboardData.summary.recent_surat_tugas}
              loading={isLoading}
              isDashboard={true}
              onViewAll={handleViewAllSuratTugas}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;