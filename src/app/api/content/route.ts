import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const createContentSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  body: z.string().min(1, 'Conteúdo é obrigatório'),
  type: z.string().default('POST'),
  category: z.string().default('EDUCATIONAL'),
  status: z.string().default('DRAFT'),
  platforms: z.string().optional(), // Armazenado como string CSV
  hashtags: z.string().optional(), // Armazenado como string CSV
  scheduledFor: z.string().optional(),
  mediaFileIds: z.array(z.string()).optional(), // IDs dos arquivos temporários
});

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
    const validatedData = createContentSchema.parse(body);

    // Criar o conteúdo
    const content = await prisma.content.create({
      data: {
        userId: session.user.id,
        title: validatedData.title,
        body: validatedData.body,
        type: validatedData.type,
        category: validatedData.category,
        status: validatedData.status,
        platforms: validatedData.platforms,
        hashtags: validatedData.hashtags,
        scheduledFor: validatedData.scheduledFor ? new Date(validatedData.scheduledFor) : null,
      }
    });

    // Associar arquivos de mídia temporários ao conteúdo, se houver
    if (validatedData.mediaFileIds && validatedData.mediaFileIds.length > 0) {
      await prisma.mediaFile.updateMany({
        where: {
          id: {
            in: validatedData.mediaFileIds
          },
          contentId: null // Apenas arquivos temporários
        },
        data: {
          contentId: content.id
        }
      });
    }

    // Buscar o conteúdo com os arquivos de mídia associados
    const contentWithMedia = await prisma.content.findUnique({
      where: { id: content.id },
      include: {
        mediaFiles: true
      }
    });

    return NextResponse.json({
      success: true,
      content: contentWithMedia
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Create content error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Buscar conteúdos do usuário com arquivos de mídia
    const contents = await prisma.content.findMany({
      where: { userId: session.user.id },
      include: {
        mediaFiles: true
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    // Contar total de conteúdos
    const total = await prisma.content.count({
      where: { userId: session.user.id }
    });

    return NextResponse.json({
      success: true,
      contents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get contents error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}