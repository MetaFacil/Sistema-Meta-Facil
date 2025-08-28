import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { TelegramService } from '@/lib/integrations/telegram-service';

export async function POST(req: NextRequest) {
  try {
    // Verificação de autenticação
    const session = await getServerSession(authOptions);
    
    console.log('Session data:', session);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Verificar se o usuário existe no banco de dados
    const userExists = await prisma.user.findUnique({
      where: { id: session.user.id }
    });
    
    console.log('User exists:', userExists);
    
    if (!userExists) {
      return NextResponse.json(
        { error: 'Usuário não encontrado. Por favor, faça login novamente.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { botToken } = body;

    if (!botToken) {
      return NextResponse.json(
        { error: 'Token do bot é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se o token é válido
    let botInfo;
    try {
      const telegramService = new TelegramService(botToken);
      
      // Primeiro valida o token
      const isValid = await telegramService.validateToken();
      if (!isValid) {
        return NextResponse.json(
          { error: 'Token inválido ou bot não encontrado. Verifique o token e tente novamente.' },
          { status: 400 }
        );
      }
      
      // Se for válido, obtém as informações do bot
      botInfo = await telegramService.getBotInfo();
    } catch (telegramError) {
      return NextResponse.json(
        { error: 'Token inválido ou bot não encontrado. Verifique o token e tente novamente.' },
        { status: 400 }
      );
    }

    // Verificar se já existe uma conta conectada com este bot
    const existingAccount = await prisma.connectedAccount.findFirst({
      where: {
        userId: session.user.id,
        provider: 'TELEGRAM',
        accountId: botInfo.id.toString(),
      }
    });

    // Se já existe uma conta conectada, atualizar o token em vez de rejeitar
    if (existingAccount) {
      // Atualizar a conta existente com o novo token
      const updatedAccount = await prisma.connectedAccount.update({
        where: { id: existingAccount.id },
        data: { 
          accessToken: botToken,
          isActive: true,
          updatedAt: new Date()
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Token do bot atualizado com sucesso',
        account: updatedAccount,
        updated: true
      });
    }

    // Criar a conta conectada
    console.log('Creating connected account with userId:', session.user.id);
    const connectedAccount = await prisma.connectedAccount.create({
      data: {
        userId: session.user.id,
        provider: 'TELEGRAM',
        accountId: botInfo.id.toString(),
        accountName: botInfo.username ? `@${botInfo.username}` : botInfo.first_name,
        accessToken: botToken,
        isActive: true,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Bot conectado com sucesso',
      account: connectedAccount
    });

  } catch (error: any) {
    console.error('Telegram connect error:', error);
    
    // Mensagens de erro mais amigáveis para o usuário
    let errorMessage = 'Erro ao conectar bot do Telegram';
    
    if (error.code === 'P2002') {
      errorMessage = 'Este bot já está conectado em outra conta';
    } else if (error.code === 'P2003') {
      errorMessage = 'Erro de autenticação. Por favor, faça login novamente e tente outra vez.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}