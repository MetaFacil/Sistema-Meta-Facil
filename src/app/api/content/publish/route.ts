import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { TelegramService } from '@/lib/integrations/telegram-service';

export async function POST(req: NextRequest) {
  try {
    console.log('Recebida solicitação para publicar conteúdo');
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.log('Erro: Usuário não autenticado');
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    console.log('Usuário autenticado:', session.user.id);
    const body = await req.json();
    const { contentId, platforms } = body;

    console.log('Dados recebidos:', { contentId, platforms });

    if (!contentId || !platforms || !Array.isArray(platforms) || platforms.length === 0) {
      console.log('Erro: ID do conteúdo ou plataformas inválidos');
      return NextResponse.json(
        { error: 'ID do conteúdo e plataformas são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar o conteúdo
    const content = await prisma.content.findUnique({
      where: { id: contentId },
      include: {
        mediaFiles: true
      }
    });

    if (!content) {
      return NextResponse.json(
        { error: 'Conteúdo não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se o conteúdo pertence ao usuário
    if (content.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Você não tem permissão para publicar este conteúdo' },
        { status: 403 }
      );
    }

    const results = [];
    const errors = [];

    // Publicar nas plataformas selecionadas
    for (const platform of platforms) {
      try {
        // Verificar se é uma plataforma do Telegram (inicia com @)
        if (platform.startsWith('@')) {
          await publishToTelegram(session.user.id, content, platform);
          results.push({ platform, success: true });
          continue;
        }
        
        switch (platform) {
          case 'TELEGRAM':
            try {
              await publishToTelegram(session.user.id, content);
              results.push({ platform, success: true });
            } catch (telegramError) {
              console.error('Erro específico do Telegram:', telegramError);
              errors.push({ 
                platform, 
                error: telegramError instanceof Error ? telegramError.message : 'Erro desconhecido no Telegram' 
              });
            }
            break;
          case 'INSTAGRAM':
            errors.push({ platform, error: 'Instagram ainda não implementado' });
            break;
          case 'FACEBOOK':
            errors.push({ platform, error: 'Facebook ainda não implementado' });
            break;
          default:
            errors.push({ platform, error: 'Plataforma não suportada' });
        }
      } catch (error) {
        console.error(`Erro ao publicar no ${platform}:`, error);
        errors.push({ 
          platform, 
          error: error instanceof Error ? error.message : 'Erro desconhecido' 
        });
      }
    }

    // Atualizar o status do conteúdo se pelo menos uma publicação for bem-sucedida
    if (results.length > 0) {
      await prisma.content.update({
        where: { id: contentId },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date()
        }
      });
    }

    return NextResponse.json({
      success: results.length > 0,
      published: results,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Publish error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Função para publicar no Telegram
async function publishToTelegram(userId: string, content: any, telegramPlatform?: string) {
  console.log('Iniciando publicação no Telegram para userId:', userId);
  console.log('Conteúdo a ser publicado:', { 
    title: content.title, 
    body: content.body?.substring(0, 100) + '...',
    mediaFiles: content.mediaFiles?.length || 0
  });
  
  // Buscar bots conectados do usuário
  const connectedAccounts = await prisma.connectedAccount.findMany({
    where: {
      userId,
      provider: 'TELEGRAM',
      isActive: true
    }
  });

  console.log('Contas conectadas encontradas:', connectedAccounts.length);

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
  const botInfo = await telegramService.getBotInfo();
  console.log('Bot verificado com sucesso:', botInfo.username);
  
  // Verificar se há arquivos de mídia
  if (content.mediaFiles && content.mediaFiles.length > 0) {
    console.log('Arquivos de mídia encontrados:', content.mediaFiles.length);
    content.mediaFiles.forEach((file: any, index: number) => {
      console.log(`Arquivo ${index + 1}:`, {
        id: file.id,
        url: file.url,
        type: file.type,
        mimeType: file.mimeType
      });
    });
  } else {
    console.log('Nenhum arquivo de mídia encontrado');
  }
  
  // Publicar conteúdo completo com mídia
  await telegramService.publishContent(chatId, {
    title: content.title || '',
    body: content.body,
    mediaFiles: content.mediaFiles?.map((file: any) => ({
      url: file.url,
      type: file.type,
      mimeType: file.mimeType
    })) || [],
    hashtags: []
  });
  
  console.log('Publicação no Telegram concluída com sucesso!');
  return true;
}