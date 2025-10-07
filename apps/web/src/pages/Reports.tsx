import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CropReport } from '@/lib/types';
import { getReports } from '@/lib/api';
import { ReportCard } from '@/components/chat/ReportCard';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Reports() {
  const { t } = useTranslation();
  const [reports, setReports] = useState<CropReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<CropReport[]>([]);
  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    let filtered = [...reports];

    if (search) {
      filtered = filtered.filter(r => 
        r.crop.toLowerCase().includes(search.toLowerCase()) ||
        r.city.toLowerCase().includes(search.toLowerCase()) ||
        r.state.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (cropFilter !== 'all') {
      filtered = filtered.filter(r => r.crop === cropFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    setFilteredReports(filtered);
  }, [search, cropFilter, statusFilter, reports]);

  const loadReports = async () => {
    setLoading(true);
    const data = await getReports();
    setReports(data);
    setFilteredReports(data);
    setLoading(false);
  };

  const crops = Array.from(new Set(reports.map(r => r.crop)));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('reports')}</h1>
        <p className="text-muted-foreground">View and manage your crop reports</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('search_reports')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={cropFilter} onValueChange={setCropFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder={t('filter_crop')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Crops</SelectItem>
            {crops.map(crop => (
              <SelectItem key={crop} value={crop}>{crop}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder={t('filter_status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">{t('loading')}</p>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('no_reports')}</p>
          <p className="text-sm text-muted-foreground mt-2">{t('create_first')}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredReports.map(report => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}
