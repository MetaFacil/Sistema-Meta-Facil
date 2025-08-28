import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const contentId = formData.get('contentId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    // Validar tipo de arquivo
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/mov',
      'video/avi'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não suportado' },
        { status: 400 }
      );
    }

    // Validar tamanho (50MB max)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Máximo 50MB' },
        { status: 400 }
      );
    }

    // Criar diretório de upload se não existir
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Diretório já existe
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filepath = join(uploadDir, filename);

    // Salvar arquivo
    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);
    await writeFile(filepath, buffer);

    // Determinar tipo de mídia
    let mediaType = 'IMAGE';
    if (file.type.startsWith('video/')) {
      mediaType = 'VIDEO';
    } else if (file.type.startsWith('application/')) {
      mediaType = 'DOCUMENT';
    }

    // Salvar no banco de dados
    const mediaFile = await prisma.mediaFile.create({
      data: {
        contentId: contentId || null, // Permite null para uploads temporários
        type: mediaType,
        url: `/uploads/${filename}`,
        filename: file.name,
        size: file.size,
        mimeType: file.type,
      }
    });

    return NextResponse.json({
      success: true,
      file: {
        id: mediaFile.id,
        url: mediaFile.url,
        filename: mediaFile.filename,
        size: mediaFile.size,
        type: mediaFile.type,
        mimeType: mediaFile.mimeType
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('id');

    if (!fileId) {
      return NextResponse.json(
        { error: 'ID do arquivo é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar arquivo no banco
    const mediaFile = await prisma.mediaFile.findUnique({
      where: { id: fileId },
      include: { content: true }
    });

    if (!mediaFile) {
      return NextResponse.json(
        { error: 'Arquivo não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se o usuário tem permissão para deletar
    if (mediaFile.content.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Sem permissão para deletar este arquivo' },
        { status: 403 }
      );
    }

    // Deletar do banco de dados
    await prisma.mediaFile.delete({
      where: { id: fileId }
    });

    return NextResponse.json({
      success: true,
      message: 'Arquivo deletado com sucesso'
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}