'use client';

import {
  Stethoscope,
  Building2,
  ShoppingBag,
  Factory,
  Film,
  ArrowRight,
  CheckCircle2,
  Microscope,
  FileText,
  HeartPulse,
  BadgeCheck,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export function IndustrySolutionsMockup() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>
          Industry Solutions
        </h1>
        <p className='text-muted-foreground mt-1'>
          AI solutions tailored for specific industries
        </p>
      </div>

      <Tabs defaultValue='overview' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='healthcare'>Healthcare</TabsTrigger>
          <TabsTrigger value='finance'>Financial Services</TabsTrigger>
          <TabsTrigger value='retail'>Retail & E-commerce</TabsTrigger>
          <TabsTrigger value='manufacturing'>Manufacturing</TabsTrigger>
          <TabsTrigger value='media'>Media & Entertainment</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <Card className='overflow-hidden'>
              <div className='bg-green-100 dark:bg-green-900/20 p-6'>
                <div className='flex items-center mb-4'>
                  <Stethoscope className='h-8 w-8 text-green-700 dark:text-green-400' />
                  <h2 className='text-xl font-semibold ml-3'>Healthcare</h2>
                </div>
                <p className='text-sm text-muted-foreground'>
                  AI solutions for medical imaging, clinical documentation,
                  patient care optimization, and healthcare compliance.
                </p>
              </div>
              <CardFooter className='bg-background p-4'>
                <Button variant='outline' className='w-full' asChild>
                  <a
                    href='/solutions/healthcare'
                    className='flex items-center justify-between'
                  >
                    <span>Explore Healthcare Solutions</span>
                    <ArrowRight className='h-4 w-4 ml-2' />
                  </a>
                </Button>
              </CardFooter>
            </Card>

            <Card className='overflow-hidden'>
              <div className='bg-blue-100 dark:bg-blue-900/20 p-6'>
                <div className='flex items-center mb-4'>
                  <Building2 className='h-8 w-8 text-blue-700 dark:text-blue-400' />
                  <h2 className='text-xl font-semibold ml-3'>
                    Financial Services
                  </h2>
                </div>
                <p className='text-sm text-muted-foreground'>
                  Fraud detection, customer insights, trading & investment, and
                  regulatory compliance solutions.
                </p>
              </div>
              <CardFooter className='bg-background p-4'>
                <Button variant='outline' className='w-full' asChild>
                  <a
                    href='/solutions/finance'
                    className='flex items-center justify-between'
                  >
                    <span>Explore Financial Solutions</span>
                    <ArrowRight className='h-4 w-4 ml-2' />
                  </a>
                </Button>
              </CardFooter>
            </Card>

            <Card className='overflow-hidden'>
              <div className='bg-purple-100 dark:bg-purple-900/20 p-6'>
                <div className='flex items-center mb-4'>
                  <ShoppingBag className='h-8 w-8 text-purple-700 dark:text-purple-400' />
                  <h2 className='text-xl font-semibold ml-3'>
                    Retail & E-commerce
                  </h2>
                </div>
                <p className='text-sm text-muted-foreground'>
                  Customer experience, inventory management, visual search, and
                  pricing optimization solutions.
                </p>
              </div>
              <CardFooter className='bg-background p-4'>
                <Button variant='outline' className='w-full' asChild>
                  <a
                    href='/solutions/retail'
                    className='flex items-center justify-between'
                  >
                    <span>Explore Retail Solutions</span>
                    <ArrowRight className='h-4 w-4 ml-2' />
                  </a>
                </Button>
              </CardFooter>
            </Card>

            <Card className='overflow-hidden'>
              <div className='bg-orange-100 dark:bg-orange-900/20 p-6'>
                <div className='flex items-center mb-4'>
                  <Factory className='h-8 w-8 text-orange-700 dark:text-orange-400' />
                  <h2 className='text-xl font-semibold ml-3'>Manufacturing</h2>
                </div>
                <p className='text-sm text-muted-foreground'>
                  Predictive maintenance, quality control, supply chain
                  optimization, and process optimization.
                </p>
              </div>
              <CardFooter className='bg-background p-4'>
                <Button variant='outline' className='w-full' asChild>
                  <a
                    href='/solutions/manufacturing'
                    className='flex items-center justify-between'
                  >
                    <span>Explore Manufacturing Solutions</span>
                    <ArrowRight className='h-4 w-4 ml-2' />
                  </a>
                </Button>
              </CardFooter>
            </Card>

            <Card className='overflow-hidden'>
              <div className='bg-red-100 dark:bg-red-900/20 p-6'>
                <div className='flex items-center mb-4'>
                  <Film className='h-8 w-8 text-red-700 dark:text-red-400' />
                  <h2 className='text-xl font-semibold ml-3'>
                    Media & Entertainment
                  </h2>
                </div>
                <p className='text-sm text-muted-foreground'>
                  Content analysis, content creation, content moderation, and
                  audience engagement solutions.
                </p>
              </div>
              <CardFooter className='bg-background p-4'>
                <Button variant='outline' className='w-full' asChild>
                  <a
                    href='/solutions/media'
                    className='flex items-center justify-between'
                  >
                    <span>Explore Media Solutions</span>
                    <ArrowRight className='h-4 w-4 ml-2' />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className='mt-8'>
            <h2 className='text-2xl font-bold mb-4'>Featured Case Studies</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Healthcare AI Transformation</CardTitle>
                  <CardDescription>
                    How Memorial Health System improved patient outcomes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground'>
                    Memorial Health System implemented Krutrim Cloud's medical
                    imaging analysis and clinical documentation solutions,
                    resulting in a 35% reduction in diagnostic time and 28%
                    improvement in documentation accuracy.
                  </p>
                  <div className='flex flex-wrap gap-2 mt-4'>
                    <Badge
                      variant='outline'
                      className='bg-green-50 text-green-700'
                    >
                      Healthcare
                    </Badge>
                    <Badge variant='outline'>Medical Imaging</Badge>
                    <Badge variant='outline'>Documentation</Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant='outline' className='w-full'>
                    Read Case Study
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Retail Personalization at Scale</CardTitle>
                  <CardDescription>
                    How GlobalShop increased conversion rates by 42%
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground'>
                    GlobalShop leveraged Krutrim Cloud's recommendation engine
                    and visual search capabilities to deliver personalized
                    shopping experiences, resulting in a 42% increase in
                    conversion rates and 27% higher average order value.
                  </p>
                  <div className='flex flex-wrap gap-2 mt-4'>
                    <Badge
                      variant='outline'
                      className='bg-purple-50 text-purple-700'
                    >
                      Retail
                    </Badge>
                    <Badge variant='outline'>Recommendations</Badge>
                    <Badge variant='outline'>Visual Search</Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant='outline' className='w-full'>
                    Read Case Study
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value='healthcare' className='space-y-6'>
          <div className='bg-green-50 dark:bg-green-900/10 rounded-lg p-6 mb-6'>
            <div className='flex items-center mb-4'>
              <Stethoscope className='h-8 w-8 text-green-700 dark:text-green-400' />
              <h2 className='text-2xl font-bold ml-3'>Healthcare Solutions</h2>
            </div>
            <p className='text-muted-foreground max-w-3xl'>
              Krutrim Cloud offers comprehensive AI solutions for healthcare
              providers, researchers, and pharmaceutical companies. Our
              solutions help improve patient outcomes, streamline operations,
              and accelerate research.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Card>
              <CardHeader>
                <div className='flex items-center gap-2'>
                  <Microscope className='h-5 w-5 text-green-600' />
                  <CardTitle>Medical Imaging Analysis</CardTitle>
                </div>
                <CardDescription>
                  AI-powered analysis of medical images
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className='space-y-2'>
                  <li className='flex items-start gap-2'>
                    <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 shrink-0' />
                    <span className='text-sm'>
                      Detect anomalies in X-rays, MRIs, CT scans, and
                      ultrasounds
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 shrink-0' />
                    <span className='text-sm'>
                      Segment and classify medical images for detailed analysis
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 shrink-0' />
                    <span className='text-sm'>
                      Provide quantitative measurements and progression tracking
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant='outline' className='w-full' asChild>
                  <a href='/solutions/healthcare/imaging'>Learn More</a>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className='flex items-center gap-2'>
                  <FileText className='h-5 w-5 text-green-600' />
                  <CardTitle>Clinical Documentation</CardTitle>
                </div>
                <CardDescription>
                  Streamline medical documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className='space-y-2'>
                  <li className='flex items-start gap-2'>
                    <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 shrink-0' />
                    <span className='text-sm'>
                      Automate transcription of patient-provider conversations
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 shrink-0' />
                    <span className='text-sm'>
                      Extract structured data from clinical notes
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 shrink-0' />
                    <span className='text-sm'>
                      Generate comprehensive clinical summaries
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant='outline' className='w-full' asChild>
                  <a href='/solutions/healthcare/documentation'>Learn More</a>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className='flex items-center gap-2'>
                  <HeartPulse className='h-5 w-5 text-green-600' />
                  <CardTitle>Patient Care Optimization</CardTitle>
                </div>
                <CardDescription>
                  Improve patient outcomes with AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className='space-y-2'>
                  <li className='flex items-start gap-2'>
                    <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 shrink-0' />
                    <span className='text-sm'>
                      Predict patient deterioration and readmission risk
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 shrink-0' />
                    <span className='text-sm'>
                      Optimize treatment plans based on patient data
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 shrink-0' />
                    <span className='text-sm'>
                      Monitor patient vitals and provide early interventions
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant='outline' className='w-full' asChild>
                  <a href='/solutions/healthcare/patient-care'>Learn More</a>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className='flex items-center gap-2'>
                  <BadgeCheck className='h-5 w-5 text-green-600' />
                  <CardTitle>Healthcare Compliance</CardTitle>
                </div>
                <CardDescription>Ensure regulatory compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className='space-y-2'>
                  <li className='flex items-start gap-2'>
                    <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 shrink-0' />
                    <span className='text-sm'>
                      Automate compliance monitoring and reporting
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 shrink-0' />
                    <span className='text-sm'>
                      Protect patient data with advanced security measures
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 shrink-0' />
                    <span className='text-sm'>
                      Maintain audit trails for regulatory requirements
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant='outline' className='w-full' asChild>
                  <a href='/solutions/healthcare/compliance'>Learn More</a>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className='mt-8'>
            <h2 className='text-2xl font-bold mb-4'>
              Healthcare Success Stories
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>Memorial Health System</CardTitle>
                <CardDescription>
                  Leading healthcare provider with 12 hospitals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <p className='text-sm'>
                    Memorial Health System implemented Krutrim Cloud's medical
                    imaging analysis and clinical documentation solutions across
                    their network of 12 hospitals.
                  </p>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='bg-green-50 dark:bg-green-900/10 rounded-lg p-4 text-center'>
                      <p className='text-3xl font-bold text-green-700'>35%</p>
                      <p className='text-sm text-muted-foreground'>
                        Reduction in diagnostic time
                      </p>
                    </div>
                    <div className='bg-green-50 dark:bg-green-900/10 rounded-lg p-4 text-center'>
                      <p className='text-3xl font-bold text-green-700'>28%</p>
                      <p className='text-sm text-muted-foreground'>
                        Improvement in documentation accuracy
                      </p>
                    </div>
                    <div className='bg-green-50 dark:bg-green-900/10 rounded-lg p-4 text-center'>
                      <p className='text-3xl font-bold text-green-700'>
                        ₹35.2Cr
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        Annual cost savings
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className='w-full'>Read Full Case Study</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
