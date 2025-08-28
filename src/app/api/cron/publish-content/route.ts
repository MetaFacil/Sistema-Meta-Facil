import { NextRequest, NextResponse } from 'next/server';

/**
 * API para ser chamada por um serviço de cron (como Vercel Cron Jobs)
 * Esta API chama a API interna de publicação de conteúdos agendados
 */
export async function GET(req: NextRequest) {
  try {
    // Verificar cabeçalho de autorização (no futuro)
    // Para agora, permitimos o acesso para testes
    
    // Chamar a API de publicação de conteúdos agendados
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/content/publish-scheduled`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    // Repassar resposta da API
    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao executar cron de publicação:', error);
    return NextResponse.json(
      { error: 'Erro ao executar cron de publicação', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}