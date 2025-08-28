import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const contentId = params.id;
    
    // Buscar o conteúdo com arquivos de mídia
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
        { error: 'Você não tem permissão para acessar este conteúdo' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      content
    });

  } catch (error) {
    console.error('Get content error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const contentId = params.id;
    const body = await req.json();
    
    // Buscar o conteúdo para verificar se existe e pertence ao usuário
    const existingContent = await prisma.content.findUnique({
      where: { id: contentId }
    });

    if (!existingContent) {
      return NextResponse.json(
        { error: 'Conteúdo não encontrado' },
        { status: 404 }
      );
    }

    if (existingContent.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Você não tem permissão para editar este conteúdo' },
        { status: 403 }
      );
    }

    // Dados que podem ser atualizados
    const updateData: any = {};
    
    // Campos de texto
    if (body.title !== undefined) updateData.title = body.title;
    if (body.body !== undefined) updateData.body = body.body;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.platforms !== undefined) updateData.platforms = body.platforms;
    if (body.hashtags !== undefined) updateData.hashtags = body.hashtags;
    
    // Datas
    if (body.scheduledFor !== undefined) {
      updateData.scheduledFor = body.scheduledFor ? new Date(body.scheduledFor) : null;
    }
    
    if (body.publishedAt !== undefined) {
      updateData.publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
    }

    // Atualizar o conteúdo
    const updatedContent = await prisma.content.update({
      where: { id: contentId },
      data: updateData,
      include: {
        mediaFiles: true
      }
    });

    // Atualizar arquivos de mídia, se fornecidos
    if (body.mediaFileIds && Array.isArray(body.mediaFileIds)) {
      // Primeiro, desassociar arquivos existentes
      await prisma.mediaFile.updateMany({
        where: { contentId },
        data: { contentId: null }
      });
      
      // Depois, associar os novos arquivos
      await prisma.mediaFile.updateMany({
        where: {
          id: {
            in: body.mediaFileIds
          }
        },
        data: { contentId }
      });
      
      // Recarregar o conteúdo com os arquivos atualizados
      const refreshedContent = await prisma.content.findUnique({
        where: { id: contentId },
        include: {
          mediaFiles: true
        }
      });
      
      if (refreshedContent) {
        return NextResponse.json({
          success: true,
          content: refreshedContent
        });
      }
    }

    return NextResponse.json({
      success: true,
      content: updatedContent
    });

  } catch (error) {
    console.error('Update content error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const contentId = params.id;
    
    // Buscar o conteúdo para verificar se existe e pertence ao usuário
    const existingContent = await prisma.content.findUnique({
      where: { id: contentId }
    });

    if (!existingContent) {
      return NextResponse.json(
        { error: 'Conteúdo não encontrado' },
        { status: 404 }
      );
    }

    if (existingContent.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Você não tem permissão para excluir este conteúdo' },
        { status: 403 }
      );
    }

    // Primeiro, desassociar quaisquer arquivos de mídia
    await prisma.mediaFile.updateMany({
      where: { contentId },
      data: { contentId: null }
    });
    
    // Depois, excluir o conteúdo
    await prisma.content.delete({
      where: { id: contentId }
    });

    return NextResponse.json({
      success: true,
      message: 'Conteúdo excluído com sucesso'
    });

  } catch (error) {
    console.error('Delete content error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
