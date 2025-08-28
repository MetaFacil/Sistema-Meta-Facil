import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TelegramService } from '@/lib/integrations/telegram-service';

// Rota de teste para publicação sem autenticação - APENAS PARA DESENVOLVIMENTO
export async function POST(req: NextRequest) {
  try {
    console.log('Recebida solicitação de teste para publicar conteúdo');
    
    // Apenas permitir em ambiente de desenvolvimento
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'Rota de teste apenas disponível em desenvolvimento' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { contentId } = body;

    if (!contentId) {
      return NextResponse.json(
        { error: 'ID do conteúdo é obrigatório' },
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

    // Buscar bots conectados (primeiro usuário com conta ativa)
    const connectedAccounts = await prisma.connectedAccount.findMany({
      where: {
        provider: 'TELEGRAM',
        isActive: true
      },
      take: 1
    });

    if (connectedAccounts.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum bot do Telegram conectado' },
        { status: 404 }
      );
    }

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
    
    // Atualizar o status do conteúdo
    await prisma.content.update({
      where: { id: contentId },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Conteúdo publicado com sucesso (teste)'
    });

  } catch (error) {
    console.error('Test publish error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}