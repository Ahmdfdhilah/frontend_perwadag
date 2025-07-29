import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import DashboardCards from "@/components/Dashboard/DashboardCards";
import CompletionStatsChart from "@/components/Dashboard/CompletionStatsChart";
import LogActivitySection from "@/components/Dashboard/LogActivitySection";
import SuratTugasTable from "@/components/SuratTugas/SuratTugasTable";
import SuratTugasCards from "@/components/SuratTugas/SuratTugasCards";
import { suratTugasService } from "../../services/suratTugas/service";
import { SuratTugasDashboardSummary } from "../../services/suratTugas/types";
import { useRole } from "@/hooks/useRole";
import { useURLFilters } from "@/hooks/useURLFilters";
import {
  RefreshCw,
  AlertCircle,
  FileText
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import Filtering from "@/components/common/Filtering";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@workspace/ui/components/select";
import { Label } from "@workspace/ui/components/label";
import { getCurrentYear } from "@/utils/yearUtils";
import { useYearOptions } from "@/hooks/useYearOptions";

interface DashboardPageFilters {
  tahun_evaluasi: string;
  search: string;
  [key: string]: string | number;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useRole();

  // URL Filters configuration
  const { updateURL, getCurrentFilters } = useURLFilters<DashboardPageFilters>({
    defaults: {
      tahun_evaluasi: getCurrentYear().toString(),
      search: '',
    },
    cleanDefaults: true,
  });

  // Get current filters from URL
  const filters = getCurrentFilters();

  const [dashboardData, setDashboardData] = useState<SuratTugasDashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Use optimized year options hook and filter out 'all' option for dashboard
  const { yearOptions: allYearOptions } = useYearOptions();
  const yearOptions = allYearOptions.filter(option => option.value !== 'all');

  const fetchDashboardData = async (year?: number | null) => {
    try {
      setIsLoading(true);
      const data = await suratTugasService.getDashboardSummary(year || undefined);
      setDashboardData(data);
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);

    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const year = parseInt(filters.tahun_evaluasi);
    fetchDashboardData(year);
  }, [filters.tahun_evaluasi]);

  const handleYearChange = (value: string) => {
    updateURL({ tahun_evaluasi: value });
  };

  const handleSearchChange = (search: string) => {
    updateURL({ search });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const year = parseInt(filters.tahun_evaluasi);
    await fetchDashboardData(year);
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


  if (!dashboardData && !isLoading) {
    return (
      <div className="space-y-6">
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
      {/* Page Header */}
      <PageHeader
        title={dashboardData ? getRoleTitle(dashboardData.user_info.role) : 'Dashboard'}
        description={dashboardData ? getWelcomeMessage(dashboardData.user_info.role, dashboardData.user_info.nama) : 'Memuat data dashboard...'}
        actions={
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
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
            value={filters.tahun_evaluasi}
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
      <DashboardCards dashboardData={dashboardData} loading={isLoading} />

      {/* Charts and Tables Grid */}
      <CompletionStatsChart
        completionStats={dashboardData?.summary.completion_stats}
        loading={isLoading}
      />

      {/* Recent Surat Tugas */}
      {(dashboardData?.summary.recent_surat_tugas || isLoading) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Surat Tugas Terbaru</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewAllSuratTugas}
              >
                Lihat Semua
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <SuratTugasTable
                data={dashboardData?.summary.recent_surat_tugas || []}
                loading={isLoading}
                isDashboard={true}
              />
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              <SuratTugasCards
                data={dashboardData?.summary.recent_surat_tugas || []}
                loading={isLoading}
                isDashboard={true}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Log Activity Section - Only for Admin */}
      {isAdmin() && (
        <LogActivitySection
          searchQuery={filters.search}
          onSearchChange={handleSearchChange}
        />
      )}
    </div>
  );
};

export default DashboardPage;