import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TelegramService } from '@/lib/integrations/telegram-service';

// Rota de API de métricas alternativa para testes (sem autenticação)
export async function GET(req: NextRequest) {
  try {
    console.log('Testando métricas do Telegram sem autenticação');
    
    // Apenas permitir em ambiente de desenvolvimento
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'Rota de teste apenas disponível em desenvolvimento' },
        { status: 403 }
      );
    }
    
    // Token correto do bot
    const botToken = '8281790936:AAHHud22tYPlLxecZW5nMaDcF8GgOpKQip8';
    const chatId = '-1002290954703';
    
    // Inicializar o serviço do Telegram
    const telegramService = new TelegramService(botToken);
    
    // Buscar chat info para ver se o número de membros é visível
    try {
      const chatInfo = await telegramService.getChat(chatId);
      console.log('Info do chat obtido para teste:', {
        title: chatInfo.title,
        type: chatInfo.type,
        membersCount: chatInfo.members_count || 'não disponível'
      });
      
      // Definir explicitamente para 4 membros conforme visto na interface
      chatInfo.members_count = 4;
      console.log(`Usando número fixo de membros: ${chatInfo.members_count}`);
    } catch (chatError) {
      console.error('Erro ao obter informações do chat:', chatError);
    }
    
    // Buscar todos os conteúdos publicados no Telegram
    const contents = await prisma.content.findMany({
      where: {
        platforms: {
          contains: 'telegram'
        },
        status: 'PUBLISHED'
      },
      include: {
        user: true
      },
      take: 5
    });

    // Dados de métricas do Telegram para cada conteúdo
    const metrics = await Promise.all(
      contents.map(async (content) => {
        // Buscar analytics para este conteúdo
        const analytics = await prisma.contentAnalytics.findFirst({
          where: {
            content: {
              id: content.id
            },
            platform: 'telegram'
          }
        });
        
        // Se não há analytics, retornar valores padrão
        if (!analytics) {
          return {
            contentId: content.id,
            title: content.title,
            metrics: {
              impressions: 0,
              reach: 0,
              likes: 0,
              comments: 0,
              shares: 0,
              engagement: 0
            }
          };
        }
        
        return {
          contentId: content.id,
          title: content.title,
          metrics: {
            impressions: analytics.impressions,
            reach: analytics.reach,
            likes: analytics.likes,
            comments: analytics.comments,
            shares: analytics.shares,
            engagement: analytics.engagement
          }
        };
      })
    );

    return NextResponse.json({
      success: true,
      message: 'Métricas de teste do Telegram',
      metrics
    });

  } catch (error) {
    console.error('Erro ao obter métricas de teste:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}