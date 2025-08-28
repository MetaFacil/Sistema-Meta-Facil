import { NextRequest, NextResponse } from 'next/server';
import { TelegramService } from '@/lib/integrations/telegram-service';
import { prisma } from '@/lib/prisma';

// Esta função será executada periodicamente para coletar métricas do Telegram
export async function GET(req: NextRequest) {
  try {
    // Verificar se a requisição tem o header de autorização correto (para segurança)
    const authHeader = req.headers.get('authorization');
    const cronAuth = process.env.CRON_AUTH_TOKEN;
    
    if (!cronAuth || authHeader !== `Bearer ${cronAuth}`) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
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
        user: {
          include: {
            connectedAccounts: true
          }
        }
      }
    });

    if (contents.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nenhum conteúdo publicado no Telegram encontrado',
        processed: 0
      });
    }

    // Token correto do bot
    const botToken = '8281790936:AAHHud22tYPlLxecZW5nMaDcF8GgOpKQip8';
    const chatId = '-1002290954703';

    // Inicializar o serviço do Telegram
    const telegramService = new TelegramService(botToken);

    try {
      // Verificar se o token é válido
      const isValid = await telegramService.validateToken();
      if (!isValid) {
        console.error('Token do Telegram inválido');
        return NextResponse.json(
          { success: false, error: 'Token do Telegram inválido' },
          { status: 401 }
        );
      }

      // Obter informações do chat
      const chatInfo = await telegramService.getChatInfo(chatId);
      
      // Verificar se o bot é administrador
      const isAdmin = await telegramService.isBotAdmin(chatId);
      
      console.log(`Bot é administrador do canal: ${isAdmin}`);
      
      // Extrair número de membros
      const membersCount = chatInfo.members_count || 0;
      console.log(`Número de membros no canal: ${membersCount}`);

      let processedCount = 0;
      const results = [];
      
      // Processar cada conteúdo
      for (const content of contents) {
        try {
          // Coletar métricas reais quando possível
          const analytics = await telegramService.collectRealMetrics(chatId);
          
          // Verificar se já existe analytics para este conteúdo
          const existingAnalytics = await prisma.contentAnalytics.findFirst({
            where: {
              contentId: content.id,
              platform: 'telegram'
            }
          });

          // Atualizar ou criar novo registro de analytics
          if (existingAnalytics) {
            // Criar registro no histórico antes de atualizar
            await prisma.analyticsHistory.create({
              data: {
                analyticsId: existingAnalytics.id,
                platform: 'telegram',
                impressions: existingAnalytics.impressions,
                reach: existingAnalytics.reach,
                likes: existingAnalytics.likes,
                comments: existingAnalytics.comments,
                shares: existingAnalytics.shares,
                saves: existingAnalytics.saves,
                engagement: existingAnalytics.engagement,
                clickThroughRate: existingAnalytics.clickThroughRate,
              }
            });

            // Atualizar o registro atual
            await prisma.contentAnalytics.update({
              where: { id: existingAnalytics.id },
              data: {
                ...analytics,
                lastUpdated: new Date()
              }
            });
          } else {
            // Criar novo registro de analytics
            await prisma.contentAnalytics.create({
              data: {
                contentId: content.id,
                platform: 'telegram',
                ...analytics,
                lastUpdated: new Date()
              }
            });
          }

          results.push({
            contentId: content.id,
            title: content.title,
            ...analytics
          });

          processedCount++;
        } catch (contentError) {
          console.error(`Erro ao processar conteúdo ${content.id}:`, contentError);
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Coleta de métricas do Telegram concluída',
        processed: processedCount,
        total: contents.length,
        chatInfo: {
          id: chatInfo.id,
          title: chatInfo.title,
          members: membersCount,
          type: chatInfo.type,
          isAdmin: isAdmin
        },
        results: results.slice(0, 5) // Retornar apenas os primeiros 5 resultados para limitar o tamanho da resposta
      });

    } catch (error) {
      console.error('Erro ao coletar métricas do Telegram:', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erro ao coletar métricas do Telegram:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}