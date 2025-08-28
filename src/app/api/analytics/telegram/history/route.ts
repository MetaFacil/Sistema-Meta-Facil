import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Função para obter o histórico de métricas de um conteúdo específico
export async function GET(req: NextRequest, { params }: { params: { contentId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const contentId = searchParams.get('contentId');
    const limit = searchParams.get('limit') || '30'; // Padrão: últimos 30 registros

    if (!contentId) {
      return NextResponse.json(
        { error: 'ID do conteúdo é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se o conteúdo pertence ao usuário
    const content = await prisma.content.findUnique({
      where: { 
        id: contentId,
        userId: session.user.id
      }
    });

    if (!content) {
      return NextResponse.json(
        { error: 'Conteúdo não encontrado ou não pertence ao usuário' },
        { status: 404 }
      );
    }

    // Buscar o analytics atual
    const currentAnalytics = await prisma.contentAnalytics.findFirst({
      where: {
        contentId: contentId,
        platform: 'telegram'
      }
    });

    if (!currentAnalytics) {
      return NextResponse.json({
        success: true,
        message: 'Nenhuma métrica encontrada para este conteúdo',
        history: [],
        current: null
      });
    }

    // Buscar histórico de métricas
    const history = await prisma.analyticsHistory.findMany({
      where: {
        analyticsId: currentAnalytics.id
      },
      orderBy: {
        recordedAt: 'desc'
      },
      take: parseInt(limit)
    });

    return NextResponse.json({
      success: true,
      history: history,
      current: currentAnalytics
    });

  } catch (error) {
    console.error('Erro ao buscar histórico de métricas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Função para obter estatísticas agregadas do histórico
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { contentId, period = '30d' } = body;

    if (!contentId) {
      return NextResponse.json(
        { error: 'ID do conteúdo é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se o conteúdo pertence ao usuário
    const content = await prisma.content.findUnique({
      where: { 
        id: contentId,
        userId: session.user.id
      }
    });

    if (!content) {
      return NextResponse.json(
        { error: 'Conteúdo não encontrado ou não pertence ao usuário' },
        { status: 404 }
      );
    }

    // Buscar o analytics atual
    const currentAnalytics = await prisma.contentAnalytics.findFirst({
      where: {
        contentId: contentId,
        platform: 'telegram'
      }
    });

    if (!currentAnalytics) {
      return NextResponse.json({
        success: true,
        message: 'Nenhuma métrica encontrada para este conteúdo',
        stats: null
      });
    }

    // Calcular data de início com base no período
    const endDate = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    // Buscar histórico de métricas no período
    const history = await prisma.analyticsHistory.findMany({
      where: {
        analyticsId: currentAnalytics.id,
        recordedAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        recordedAt: 'asc'
      }
    });

    if (history.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nenhum histórico encontrado para o período especificado',
        stats: {
          period: period,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          totalRecords: 0,
          growth: {
            impressions: 0,
            reach: 0,
            likes: 0,
            comments: 0,
            shares: 0,
            engagement: 0
          },
          averages: {
            impressions: 0,
            reach: 0,
            likes: 0,
            comments: 0,
            shares: 0,
            engagement: 0
          }
        }
      });
    }

    // Calcular estatísticas
    const firstRecord = history[0];
    const lastRecord = history[history.length - 1];
    
    const growth = {
      impressions: lastRecord.impressions - firstRecord.impressions,
      reach: lastRecord.reach - firstRecord.reach,
      likes: lastRecord.likes - firstRecord.likes,
      comments: lastRecord.comments - firstRecord.comments,
      shares: lastRecord.shares - firstRecord.shares,
      engagement: parseFloat((lastRecord.engagement - firstRecord.engagement).toFixed(2))
    };
    
    // Calcular médias
    const totals = history.reduce((acc: { impressions: number; reach: number; likes: number; comments: number; shares: number; engagement: number; }, record: { impressions: number; reach: number; likes: number; comments: number; shares: number; engagement: number; }) => {
      acc.impressions += record.impressions;
      acc.reach += record.reach;
      acc.likes += record.likes;
      acc.comments += record.comments;
      acc.shares += record.shares;
      acc.engagement += record.engagement;
      return acc;
    }, {
      impressions: 0,
      reach: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      engagement: 0
    });
    
    const averages = {
      impressions: Math.round(totals.impressions / history.length),
      reach: Math.round(totals.reach / history.length),
      likes: Math.round(totals.likes / history.length),
      comments: Math.round(totals.comments / history.length),
      shares: Math.round(totals.shares / history.length),
      engagement: parseFloat((totals.engagement / history.length).toFixed(2))
    };

    return NextResponse.json({
      success: true,
      stats: {
        period: period,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalRecords: history.length,
        growth,
        averages,
        firstRecord,
        lastRecord
      }
    });

  } catch (error) {
    console.error('Erro ao calcular estatísticas do histórico:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}