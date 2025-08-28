import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { TelegramService } from '@/lib/integrations/telegram-service';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificação de autenticação
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const accountId = params.id;
    if (!accountId) {
      return NextResponse.json(
        { error: 'ID da conta é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se a conta existe e pertence ao usuário
    const existingAccount = await prisma.connectedAccount.findFirst({
      where: {
        id: accountId,
        userId: session.user.id,
        provider: 'TELEGRAM'
      }
    });

    if (!existingAccount) {
      return NextResponse.json(
        { error: 'Conta não encontrada ou você não tem permissão para atualizá-la' },
        { status: 404 }
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

    // Atualizar a conta com o novo token e informações do bot
    const updatedAccount = await prisma.connectedAccount.update({
      where: { id: accountId },
      data: {
        accountId: botInfo.id.toString(),
        accountName: botInfo.username ? `@${botInfo.username}` : botInfo.first_name,
        accessToken: botToken,
        isActive: true,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Bot atualizado com sucesso',
      account: updatedAccount
    });

  } catch (error: any) {
    console.error('Telegram update error:', error);
    
    // Mensagens de erro mais amigáveis para o usuário
    let errorMessage = 'Erro ao atualizar bot do Telegram';
    
    if (error.code === 'P2002') {
      errorMessage = 'Este bot já está conectado em outra conta';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const accountId = params.id;
    if (!accountId) {
      return NextResponse.json(
        { error: 'ID da conta é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se a conta existe e pertence ao usuário
    const existingAccount = await prisma.connectedAccount.findFirst({
      where: {
        id: accountId,
        userId: session.user.id,
        provider: 'TELEGRAM'
      }
    });

    if (!existingAccount) {
      return NextResponse.json(
        { error: 'Conta não encontrada ou você não tem permissão para removê-la' },
        { status: 404 }
      );
    }

    // Remover a conta
    await prisma.connectedAccount.delete({
      where: { id: accountId }
    });

    return NextResponse.json({
      success: true,
      message: 'Bot removido com sucesso'
    });

  } catch (error: any) {
    console.error('Telegram delete error:', error);
    
    let errorMessage = 'Erro ao remover bot do Telegram';
    if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}