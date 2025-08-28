import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/blog/analytics - Get blog analytics
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || '30d'; // 7d, 30d, 90d, 1y
    const postId = searchParams.get('postId'); // Optional: analytics for specific post

    // Mock analytics data
    const analyticsData = {
      overview: {
        totalPosts: 15,
        publishedPosts: 12,
        draftPosts: 3,
        totalViews: 25680,
        totalShares: 456,
        totalComments: 89,
        averageReadTime: 4.2, // minutes
        bounceRate: 0.35,
        returnVisitors: 0.42
      },
      period: {
        label: period === '7d' ? 'Últimos 7 dias' : 
               period === '30d' ? 'Últimos 30 dias' :
               period === '90d' ? 'Últimos 90 dias' : 'Último ano',
        views: 5420,
        uniqueVisitors: 3890,
        shares: 78,
        comments: 23,
        newSubscribers: 45
      },
      topPosts: [
        {
          id: '1',
          title: 'Guia Completo de Opções Binárias para Iniciantes',
          slug: 'guia-completo-opcoes-binarias-iniciantes',
          views: 1250,
          shares: 45,
          comments: 12,
          publishedAt: '2024-01-15T10:00:00Z',
          performance: 'Excelente'
        },
        {
          id: '3',
          title: 'Análise Técnica: Dominando os Padrões Gráficos',
          slug: 'analise-tecnica-padroes-graficos',
          views: 890,
          shares: 32,
          comments: 8,
          publishedAt: '2024-01-18T10:00:00Z',
          performance: 'Bom'
        }
      ],
      trafficSources: [
        { source: 'Organic Search', visitors: 1580, percentage: 40.6 },
        { source: 'Direct', visitors: 980, percentage: 25.2 },
        { source: 'Social Media', visitors: 760, percentage: 19.5 },
        { source: 'Referral', visitors: 420, percentage: 10.8 },
        { source: 'Email', visitors: 150, percentage: 3.9 }
      ],
      popularTags: [
        { tag: 'opções binárias', count: 8, views: 3420 },
        { tag: 'trading', count: 12, views: 5680 },
        { tag: 'análise técnica', count: 6, views: 2340 },
        { tag: 'estratégias', count: 4, views: 1890 },
        { tag: 'iniciantes', count: 5, views: 2100 }
      ],
      viewsTimeline: [
        { date: '2024-01-01', views: 120 },
        { date: '2024-01-02', views: 145 },
        { date: '2024-01-03', views: 98 },
        { date: '2024-01-04', views: 234 },
        { date: '2024-01-05', views: 189 },
        { date: '2024-01-06', views: 267 },
        { date: '2024-01-07', views: 201 },
        { date: '2024-01-08', views: 298 },
        { date: '2024-01-09', views: 187 },
        { date: '2024-01-10', views: 312 }
      ],
      userEngagement: {
        averageTimeOnPage: 240, // seconds
        pagesPerSession: 2.3,
        subscriptionRate: 0.08,
        socialShareRate: 0.12,
        commentRate: 0.05
      },
      seoMetrics: {
        averagePosition: 12.4,
        clickThroughRate: 0.034,
        impressions: 15680,
        clicks: 534,
        topKeywords: [
          { keyword: 'opções binárias', position: 8, clicks: 89 },
          { keyword: 'como investir trading', position: 15, clicks: 45 },
          { keyword: 'análise técnica forex', position: 12, clicks: 67 }
        ]
      }
    };

    // If specific post analytics requested
    if (postId) {
      const postAnalytics = {
        postId,
        title: 'Guia Completo de Opções Binárias para Iniciantes',
        publishedAt: '2024-01-15T10:00:00Z',
        metrics: {
          views: 1250,
          uniqueViews: 980,
          shares: 45,
          comments: 12,
          averageReadTime: 5.2,
          bounceRate: 0.28,
          completionRate: 0.67
        },
        timeline: [
          { date: '2024-01-15', views: 89 },
          { date: '2024-01-16', views: 234 },
          { date: '2024-01-17', views: 189 },
          { date: '2024-01-18', views: 145 },
          { date: '2024-01-19', views: 298 },
          { date: '2024-01-20', views: 187 },
          { date: '2024-01-21', views: 108 }
        ],
        referrers: [
          { source: 'google.com', views: 420 },
          { source: 'instagram.com', views: 280 },
          { source: 'facebook.com', views: 190 },
          { source: 'direct', views: 360 }
        ],
        demographics: {
          countries: [
            { country: 'Brasil', views: 850 },
            { country: 'Portugal', views: 210 },
            { country: 'Estados Unidos', views: 120 },
            { country: 'Argentina', views: 70 }
          ],
          devices: [
            { device: 'Mobile', views: 720, percentage: 57.6 },
            { device: 'Desktop', views: 430, percentage: 34.4 },
            { device: 'Tablet', views: 100, percentage: 8.0 }
          ]
        }
      };

      return NextResponse.json({
        success: true,
        data: postAnalytics
      });
    }

    return NextResponse.json({
      success: true,
      data: analyticsData
    });

  } catch (error) {
    console.error('Error fetching blog analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}