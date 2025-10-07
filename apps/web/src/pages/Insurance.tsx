import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Insurance() {
  const { t } = useTranslation();

  const schemes = [
    {
      name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      description: 'Comprehensive crop insurance with low farmer premium and high government subsidy',
      icon: Shield,
      color: 'text-primary'
    },
    {
      name: 'Weather Based Crop Insurance (WBCIS)',
      description: 'Index-based insurance using weather parameters for quick settlements',
      icon: CheckCircle2,
      color: 'text-accent'
    },
    {
      name: 'Modified NAIS',
      description: 'Traditional area-based assessment with wide network coverage',
      icon: AlertCircle,
      color: 'text-orange-500'
    }
  ];

  const faqs = [
    {
      q: 'What is crop insurance?',
      a: 'Crop insurance provides financial protection to farmers against crop losses due to natural calamities, pests, and diseases. It ensures income stability even during bad seasons.'
    },
    {
      q: 'How much premium do I need to pay?',
      a: 'Premium rates are typically 2-5% of the sum insured, with significant government subsidies. The actual farmer share is usually 2% for food crops and 5% for horticultural crops.'
    },
    {
      q: 'What risks are covered?',
      a: 'Coverage includes drought, excess rainfall, flood, hailstorm, cyclone, pest attacks, and diseases. Weather-based schemes cover specific weather parameters like rainfall, temperature, and humidity.'
    },
    {
      q: 'How is the claim settled?',
      a: 'Claims are assessed based on crop cutting experiments (for yield-based) or weather station data (for index-based). Settlements are directly transferred to farmer bank accounts.'
    },
    {
      q: 'When should I enroll?',
      a: 'Enrollment windows are usually 2-4 weeks before sowing season. For Kharif (monsoon) crops: April-July. For Rabi (winter) crops: October-December.'
    },
    {
      q: 'Can I insure multiple crops?',
      a: 'Yes, you can insure different crops on different land parcels. Each crop requires a separate policy with its own premium calculation.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">{t('insurance')}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Protect your crops with government-backed insurance schemes. Compare and choose the best coverage for your farming needs.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <Link to="/chat/onboard">
            <Button size="lg" className="gap-2">
              Get Personalized Recommendations
            </Button>
          </Link>
          <Link to="/reports">
            <Button size="lg" variant="outline">
              View My Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* Available Schemes */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Available Schemes</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {schemes.map((scheme, i) => (
            <Card key={i} className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className={`rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-4`}>
                  <scheme.icon className={`h-6 w-6 ${scheme.color}`} />
                </div>
                <CardTitle>{scheme.name}</CardTitle>
                <CardDescription>{scheme.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Learn More</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Why Insurance */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Why Choose Crop Insurance?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Financial Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Protect your investment and ensure stable income even during crop failures
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Low Premium</h3>
                  <p className="text-sm text-muted-foreground">
                    Pay only 2-5% with 90%+ government subsidy on premium
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Wide Coverage</h3>
                  <p className="text-sm text-muted-foreground">
                    Protection against drought, flood, pests, diseases, and weather events
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Quick Settlement</h3>
                  <p className="text-sm text-muted-foreground">
                    Technology-enabled assessment and direct bank transfer of claims
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Easy Enrollment</h3>
                  <p className="text-sm text-muted-foreground">
                    Simple online process with minimal documentation
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Expert Support</h3>
                  <p className="text-sm text-muted-foreground">
                    AI-powered recommendations and 24/7 advisory support
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQs */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <Card>
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{faq.q}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pl-8">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-3">Need Help Choosing?</h2>
        <p className="text-muted-foreground mb-6">
          Chat with our AI expert to get personalized insurance recommendations based on your crop and location
        </p>
        <Link to="/chat/expert">
          <Button size="lg" className="gap-2">
            Talk to Expert
          </Button>
        </Link>
      </div>
    </div>
  );
}
