import { prisma } from '@/lib/prisma';
import { TelegramService } from '@/lib/integrations/telegram-service';

/**
 * Função para verificar e publicar conteúdos agendados
 * Esta função pode ser chamada diretamente de qualquer lugar do código
 */
export async function checkAndPublishScheduledContent() {
  try {
    console.log('Verificando conteúdos agendados para publicação automática...');
    
    // Buscar conteúdos agendados que já passaram da data de agendamento
    const now = new Date();
    const overdueContents = await prisma.content.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledFor: {
          lt: now
        }
      },
      include: {
        mediaFiles: true
      }
    });

    console.log(`Encontrados ${overdueContents.length} conteúdos para publicação automática`);

    if (overdueContents.length === 0) {
      return {
        success: true,
        message: 'Nenhum conteúdo agendado para publicação neste momento',
        published: 0,
        results: []
      };
    }

    // Array para armazenar resultados de cada publicação
    const results = [];

    // Publicar cada conteúdo
    for (const content of overdueContents) {
      try {
        // Converter platforms para array se for string
        const platforms = typeof content.platforms === 'string'
          ? content.platforms.split(',').filter((p: string) => p.trim() !== '')
          : content.platforms || [];

        console.log(`Publicando conteúdo: ${content.id} para plataformas:`, platforms);

        // Para cada plataforma, publicar o conteúdo
        const platformResults = [];
        const errors = [];

        for (const platform of platforms) {
          try {
            // Publicar no Telegram
            if (platform === 'TELEGRAM') {
              // Buscar bots conectados do usuário
              const connectedAccounts = await prisma.connectedAccount.findMany({
                where: {
                  userId: content.userId,
                  provider: 'TELEGRAM',
                  isActive: true
                }
              });

              if (connectedAccounts.length === 0) {
                throw new Error('Nenhum bot do Telegram conectado');
              }

              // Usar o primeiro bot conectado
              const botAccount = connectedAccounts[0];
              console.log('Bot selecionado:', botAccount.accountName);
              
              // ID do canal fixo
              const chatId = "-1002290954703";
              console.log(`Usando ID fixo do canal: ${chatId}`);
              
              // Inicializar serviço do Telegram
              const telegramService = new TelegramService(botAccount.accessToken);
              
              // Verificar se o bot está funcionando
              await telegramService.getBotInfo();
              
              // Publicar conteúdo completo com mídia
              await telegramService.publishContent(chatId, {
                title: content.title || '',
                body: content.body,
                mediaFiles: content.mediaFiles?.map((file: any) => ({
                  url: file.url,
                  type: file.type,
                  mimeType: file.mimeType
                })) || [],
                hashtags: typeof content.hashtags === 'string' 
                  ? content.hashtags.split(',').filter((h: string) => h.trim() !== '') 
                  : content.hashtags || []
              });
              
              platformResults.push({
                platform,
                success: true,
                message: 'Publicado com sucesso no Telegram'
              });
            } else {
              // Outras plataformas não implementadas
              errors.push({ 
                platform, 
                error: `Plataforma ${platform} ainda não implementada` 
              });
            }
          } catch (platformError) {
            console.error(`Erro ao publicar no ${platform}:`, platformError);
            errors.push({ 
              platform, 
              error: platformError instanceof Error ? platformError.message : 'Erro desconhecido' 
            });
          }
        }

        // Atualizar o status do conteúdo para PUBLISHED
        await prisma.content.update({
          where: { id: content.id },
          data: {
            status: 'PUBLISHED',
            publishedAt: new Date()
          }
        });

        // Adicionar resultado ao array de resultados
        results.push({
          contentId: content.id,
          title: content.title,
          platformResults,
          errors: errors.length > 0 ? errors : undefined
        });

      } catch (error) {
        console.error(`Erro ao publicar conteúdo ${content.id}:`, error);
        results.push({
          contentId: content.id,
          title: content.title,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }

    return {
      success: true,
      published: results.length,
      results
    };

  } catch (error) {
    console.error('Erro ao processar publicação automática:', error);
    return {
      success: false,
      error: 'Erro interno do servidor', 
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}