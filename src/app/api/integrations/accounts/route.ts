import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Buscar todas as contas conectadas do usuário
    const connectedAccounts = await prisma.connectedAccount.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      accounts: connectedAccounts
    });

  } catch (error) {
    console.error('Error fetching connected accounts:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar contas conectadas' },
      { status: 500 }
    );
  }
}

// Desconectar uma conta
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

    // Verificar se a conta pertence ao usuário
    const account = await prisma.connectedAccount.findUnique({
      where: {
        id: accountId
      }
    });

    if (!account || account.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Conta não encontrada' },
        { status: 404 }
      );
    }

    // Desativar a conta em vez de deletar
    await prisma.connectedAccount.update({
      where: {
        id: accountId
      },
      data: {
        isActive: false
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Conta desconectada com sucesso'
    });

  } catch (error) {
    console.error('Error disconnecting account:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}