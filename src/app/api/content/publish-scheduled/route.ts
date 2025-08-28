import { NextRequest, NextResponse } from 'next/server';
import { checkAndPublishScheduledContent } from '@/lib/publish-scheduler';

/**
 * Esta API verifica e publica conteúdos agendados que já passaram da data programada
 */
export async function GET(req: NextRequest) {
  try {
    // Chamar a função que verifica e publica conteúdos agendados
    const result = await checkAndPublishScheduledContent();
    
    // Retornar o resultado
    return NextResponse.json(result);

  } catch (error) {
    console.error('Erro ao processar publicação automática:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}