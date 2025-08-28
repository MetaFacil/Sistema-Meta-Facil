import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Buscar arquivos temporários (sem contentId) com mais de 24 horas
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    const tempFiles = await prisma.mediaFile.findMany({
      where: {
        contentId: null,
        createdAt: {
          lt: oneDayAgo
        }
      }
    });

    let deletedCount = 0;
    const errors = [];

    for (const file of tempFiles) {
      try {
        // Deletar arquivo físico
        const filepath = join(process.cwd(), 'public', file.url);
        await unlink(filepath);

        // Deletar registro do banco
        await prisma.mediaFile.delete({
          where: { id: file.id }
        });

        deletedCount++;
      } catch (error) {
        console.error(`Erro ao deletar arquivo ${file.id}:`, error);
        errors.push(`Erro ao deletar ${file.filename}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${deletedCount} arquivos temporários deletados`,
      deletedCount,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}