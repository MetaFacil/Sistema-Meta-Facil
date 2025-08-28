import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const createBlogPostSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200),
  slug: z.string().min(1, 'Slug é obrigatório').max(200),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  tags: z.array(z.string()).default([]),
  featuredImage: z.string().url().optional(),
  publishedAt: z.string().datetime().optional()
});

const updateBlogPostSchema = createBlogPostSchema.partial();

// GET /api/blog/posts - List all posts
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') as 'DRAFT' | 'PUBLISHED' | null;
    const search = searchParams.get('search') || '';
    const tag = searchParams.get('tag') || '';

    // In real app, this would query the database
    // For now, return mock data
    const mockPosts = [
      {
        id: '1',
        title: 'Guia Completo de Opções Binárias para Iniciantes',
        slug: 'guia-completo-opcoes-binarias-iniciantes',
        excerpt: 'Aprenda os fundamentos das opções binárias de forma simples e prática.',
        content: 'Conteúdo completo do post...',
        status: 'PUBLISHED',
        seoTitle: 'Opções Binárias para Iniciantes - Guia Completo 2024',
        seoDescription: 'Descubra como começar no mundo das opções binárias com nosso guia completo.',
        tags: ['opções binárias', 'iniciantes', 'trading'],
        featuredImage: '/images/blog/opcoes-binarias-guia.jpg',
        publishedAt: '2024-01-15T10:00:00Z',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        userId: session.user.id,
        author: {
          name: session.user.name,
          email: session.user.email
        },
        analytics: {
          views: 1250,
          shares: 45,
          comments: 12
        }
      },
      {
        id: '2',
        title: 'As 5 Melhores Estratégias de Trading para 2024',
        slug: 'melhores-estrategias-trading-2024',
        excerpt: 'Descubra as estratégias de trading mais eficazes para maximizar seus lucros.',
        content: 'Conteúdo completo do post...',
        status: 'DRAFT',
        tags: ['estratégias', 'trading', '2024'],
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-22T10:00:00Z',
        userId: session.user.id,
        author: {
          name: session.user.name,
          email: session.user.email
        },
        analytics: {
          views: 0,
          shares: 0,
          comments: 0
        }
      }
    ];

    // Apply filters
    let filteredPosts = mockPosts.filter(post => post.userId === session.user.id);

    if (status) {
      filteredPosts = filteredPosts.filter(post => post.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt?.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (tag) {
      filteredPosts = filteredPosts.filter(post => 
        post.tags.some(postTag => postTag.toLowerCase().includes(tag.toLowerCase()))
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        posts: paginatedPosts,
        pagination: {
          page,
          limit,
          total: filteredPosts.length,
          totalPages: Math.ceil(filteredPosts.length / limit),
          hasNext: endIndex < filteredPosts.length,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/blog/posts - Create new post
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = createBlogPostSchema.parse(body);

    // Check if slug is unique (in real app, check database)
    // For now, just simulate
    const slugExists = false; // This would be a database query
    
    if (slugExists) {
      return NextResponse.json(
        { error: 'Slug já existe. Use um slug único.' },
        { status: 400 }
      );
    }

    // In real app, save to database
    const newPost = {
      id: `post_${Date.now()}`,
      ...validatedData,
      userId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: validatedData.status === 'PUBLISHED' 
        ? (validatedData.publishedAt || new Date().toISOString())
        : null
    };

    console.log('Creating new blog post:', newPost);

    return NextResponse.json({
      success: true,
      data: newPost,
      message: 'Post criado com sucesso'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating blog post:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}