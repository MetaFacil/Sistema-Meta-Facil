import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Content } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');
    
    // Converter strings de data para objetos Date
    const startDate = startDateStr ? new Date(startDateStr) : new Date();
    const endDate = endDateStr ? new Date(endDateStr) : new Date();
    
    // Se não há data de término, definir para 1 mês após a data de início
    if (!endDateStr) {
      endDate.setMonth(startDate.getMonth() + 1);
    }

    // Buscar conteúdos agendados
    const contents = await prisma.content.findMany({
      where: {
        userId: session.user.id,
        status: 'SCHEDULED',
        scheduledFor: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        mediaFiles: true
      },
      orderBy: {
        scheduledFor: 'asc'
      }
    });

    // Converter conteúdos em eventos para o calendário
    const events = contents.map((content: Content) => ({
      id: content.id,
      contentId: content.id,
      userId: content.userId,
      title: content.title,
      description: content.body.substring(0, 100) + (content.body.length > 100 ? '...' : ''),
      scheduledFor: content.scheduledFor,
      platforms: typeof content.platforms === 'string' 
        ? content.platforms.split(',').filter((p: string) => p.trim() !== '')
        : [],
      status: 'SCHEDULED',
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      mediaFiles: content.mediaFiles
    }));

    return NextResponse.json({
      success: true,
      events
    });

  } catch (error) {
    console.error('Get calendar events error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}