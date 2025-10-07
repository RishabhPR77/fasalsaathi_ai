import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CropReport, InsuranceScheme } from '@/lib/types';
import { getReportById, getSchemesForReport } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Share2, Download, MessageSquare, Shield } from 'lucide-react';
import { InsuranceSchemeCard } from '@/components/insurance/InsuranceSchemeCard';

export default function ReportDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<CropReport | null>(null);
  const [schemes, setSchemes] = useState<InsuranceScheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadData(id);
    }
  }, [id]);

  const loadData = async (reportId: string) => {
    setLoading(true);
    const [reportData, schemesData] = await Promise.all([
      getReportById(reportId),
      getSchemesForReport(reportId)
    ]);
    setReport(reportData);
    setSchemes(schemesData);
    setLoading(false);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-orange-500';
      case 'critical': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Report not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link to="/reports">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Reports
          </Button>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{report.crop} - {report.variety}</h1>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span>{report.city}, {report.state}</span>
              <span>•</span>
              <span>Sowing: {new Date(report.sowingDate).toLocaleDateString()}</span>
              <span>•</span>
              <span>{report.season}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              {t('share')}
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              {t('download')}
            </Button>
            <Link to={`/chat/expert?rid=${report.id}`}>
              <Button size="sm" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                {t('discuss_expert')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Season Risk */}
          <Card>
            <CardHeader>
              <CardTitle>{t('season_risk')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold">{report.seasonRisk.score}/100</span>
                <Badge variant="outline" className={getRiskColor(report.seasonRisk.level)}>
                  {report.seasonRisk.level.toUpperCase()}
                </Badge>
              </div>
              <Progress value={report.seasonRisk.score} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">
                Overall seasonal risk assessment based on weather, soil, and pest factors
              </p>
            </CardContent>
          </Card>

          {/* Stage Risks */}
          <Card>
            <CardHeader>
              <CardTitle>{t('stage_risks')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {report.stageRisks.map((stage, i) => (
                <div key={i} className="border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{stage.stage}</h3>
                    <Badge variant="outline" className={getRiskColor(stage.riskLevel)}>
                      {stage.riskScore}/100
                    </Badge>
                  </div>
                  <Progress value={stage.riskScore} className="h-2 mb-3" />
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Risk Contributors:</p>
                    {stage.contributors.map((contrib, j) => (
                      <div key={j} className="flex items-start gap-2 text-sm">
                        <Badge variant="secondary" className="text-xs">
                          {contrib.impact}%
                        </Badge>
                        <div>
                          <span className="font-medium">{contrib.factor}:</span>
                          <span className="text-muted-foreground ml-1">{contrib.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {stage.recommendations.length > 0 && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium mb-1">Recommendations:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {stage.recommendations.map((rec, k) => (
                          <li key={k}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Insurance Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                {t('insurance_recommendations')}
              </CardTitle>
              <CardDescription>
                Recommended insurance schemes based on your crop risk profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {schemes.map(scheme => (
                <InsuranceSchemeCard 
                  key={scheme.id} 
                  scheme={scheme} 
                  reportId={report.id}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className="mt-1">{report.status}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-sm font-medium mt-1">
                  {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-sm font-medium mt-1">
                  {new Date(report.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
