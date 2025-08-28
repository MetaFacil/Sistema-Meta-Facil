import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { TelegramService } from '@/lib/integrations/telegram-service';

// Verificar bot e testar conexão
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Buscar token do bot
    const connectedAccount = await prisma.connectedAccount.findFirst({
      where: {
        userId: session.user.id,
        provider: 'TELEGRAM',
        isActive: true
      }
    });

    if (!connectedAccount) {
      return NextResponse.json(
        { error: 'Bot não encontrado' },
        { status: 404 }
      );
    }

    // Testar conexão com o bot
    const telegramService = new TelegramService(connectedAccount.accessToken);
    const botInfo = await telegramService.getBotInfo();

    return NextResponse.json({
      success: true,
      botInfo
    });

  } catch (error) {
    console.error('Telegram check error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Enviar mensagem para um chat/canal
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
    const { chatId, content } = body;

    if (!chatId || !content) {
      return NextResponse.json(
        { error: 'Dados incompletos. chatId e content são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se o conteúdo tem as informações necessárias
    if (!content.body) {
      return NextResponse.json(
        { error: 'O conteúdo da mensagem é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar token do primeiro bot conectado do usuário
    const connectedAccount = await prisma.connectedAccount.findFirst({
      where: {
        userId: session.user.id,
        provider: 'TELEGRAM',
        isActive: true
      }
    });

    if (!connectedAccount) {
      return NextResponse.json(
        { error: 'Nenhum bot do Telegram conectado' },
        { status: 404 }
      );
    }

    // Buscar os arquivos de mídia associados ao conteúdo, se houver
    let mediaFiles = [];
    if (content.id) {
      mediaFiles = await prisma.mediaFile.findMany({
        where: {
          contentId: content.id
        }
      });
    }

    // Publicar conteúdo
    const telegramService = new TelegramService(connectedAccount.accessToken);
    const result = await telegramService.publishContent(chatId, {
      title: content.title || '',
      body: content.body,
      mediaFiles: mediaFiles.map((file: {url: string, type: string, mimeType: string}) => ({
        url: file.url,
        type: file.type,
        mimeType: file.mimeType
      })),
      hashtags: content.hashtags ? content.hashtags.split(',') : []
    });

    // Atualizar status do conteúdo, se tiver ID
    if (content.id) {
      await prisma.content.update({
        where: { id: content.id },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date()
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Conteúdo publicado com sucesso',
      result
    });

  } catch (error) {
    console.error('Telegram publish error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao publicar no Telegram' },
      { status: 500 }
    );
  }
}