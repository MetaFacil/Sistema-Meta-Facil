import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

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
        userId: session.user.id
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
      message: 'Conta removida com sucesso'
    });

  } catch (error: any) {
    console.error('Error deleting connected account:', error);
    
    let errorMessage = 'Erro ao remover conta';
    if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}