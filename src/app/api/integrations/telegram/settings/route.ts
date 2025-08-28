import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { TelegramService } from '@/lib/integrations/telegram-service';

// Atualizar configurações do Telegram
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { accountId, defaultChannelId, defaultChannelName } = body;

    if (!accountId) {
      return NextResponse.json(
        { error: 'ID da conta é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se a conta existe e pertence ao usuário
    const account = await prisma.connectedAccount.findUnique({
      where: {
        id: accountId,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Conta não encontrada' },
        { status: 404 }
      );
    }

    if (account.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Você não tem permissão para editar esta conta' },
        { status: 403 }
      );
    }

    // Se foi fornecido um novo channelId, validar com a API do Telegram
    if (defaultChannelId) {
      try {
        const telegramService = new TelegramService(account.accessToken);
        const chatInfo = await telegramService.getChat(defaultChannelId);
        
        // Usar o nome do chat fornecido pela API, se não for fornecido pelo usuário
        const channelName = defaultChannelName || chatInfo.title || chatInfo.username || 'Canal do Telegram';
        
        // Atualizar a conta com as novas informações
        const updatedAccount = await prisma.connectedAccount.update({
          where: { id: accountId },
          data: {
            defaultChannelId: defaultChannelId,
            defaultChannelName: channelName,
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Configurações do Telegram atualizadas com sucesso',
          account: updatedAccount,
          chatInfo: {
            id: chatInfo.id,
            title: chatInfo.title,
            username: chatInfo.username,
            type: chatInfo.type,
            membersCount: chatInfo.members_count,
          },
        });
      } catch (telegramError) {
        return NextResponse.json(
          { 
            error: 'Erro ao validar canal do Telegram', 
            details: telegramError instanceof Error ? telegramError.message : 'Erro desconhecido',
          },
          { status: 400 }
        );
      }
    } else {
      // Se não foi fornecido um novo channelId, apenas atualizar o nome, se fornecido
      const updateData: any = {};
      
      if (defaultChannelName !== undefined) {
        updateData.defaultChannelName = defaultChannelName;
      }
      
      // Se não há nada para atualizar, retornar erro
      if (Object.keys(updateData).length === 0) {
        return NextResponse.json(
          { error: 'Nenhuma informação para atualizar' },
          { status: 400 }
        );
      }
      
      const updatedAccount = await prisma.connectedAccount.update({
        where: { id: accountId },
        data: updateData,
      });

      return NextResponse.json({
        success: true,
        message: 'Configurações do Telegram atualizadas com sucesso',
        account: updatedAccount,
      });
    }
  } catch (error) {
    console.error('Erro ao atualizar configurações do Telegram:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Buscar configurações do Telegram
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Buscar todas as contas do Telegram do usuário
    const accounts = await prisma.connectedAccount.findMany({
      where: {
        userId: session.user.id,
        provider: 'telegram',
        isActive: true,
      },
    });

    if (accounts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nenhuma conta do Telegram encontrada',
        accounts: [],
      });
    }

    // Testar a conectividade com cada conta
    const accountsWithStatus = await Promise.all(
      accounts.map(async (account: any) => {
        try {
          const telegramService = new TelegramService(account.accessToken);
          const botInfo = await telegramService.getBotInfo();
          
          let channelInfo = null;
          if (account.defaultChannelId) {
            try {
              channelInfo = await telegramService.getChat(account.defaultChannelId);
            } catch (channelError) {
              console.error(`Erro ao obter informações do canal ${account.defaultChannelId}:`, channelError);
            }
          }
          
          return {
            ...account,
            isConnected: true,
            botInfo,
            channelInfo,
          };
        } catch (error) {
          console.error(`Erro ao testar conexão com a conta ${account.id}:`, error);
          return {
            ...account,
            isConnected: false,
            error: error instanceof Error ? error.message : 'Erro desconhecido',
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      accounts: accountsWithStatus,
    });
  } catch (error) {
    console.error('Erro ao buscar configurações do Telegram:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}