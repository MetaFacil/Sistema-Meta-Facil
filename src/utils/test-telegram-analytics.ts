import { prisma } from '@/lib/prisma';
import { ContentAnalytics, AnalyticsHistory } from '@/types';

/**
 * Função para testar o sistema de histórico de métricas do Telegram
 * @param contentId ID do conteúdo para testar
 */
export async function testTelegramAnalyticsHistory(contentId: string) {
  try {
    console.log('Iniciando teste do sistema de histórico de métricas do Telegram...');
    
    // Verificar se o conteúdo existe
    const content = await prisma.content.findUnique({
      where: { id: contentId }
    });
    
    if (!content) {
      console.error('Conteúdo não encontrado');
      return;
    }
    
    console.log(`Conteúdo encontrado: ${content.title}`);
    
    // Verificar analytics atual
    const currentAnalytics = await prisma.contentAnalytics.findFirst({
      where: {
        contentId: contentId,
        platform: 'telegram'
      }
    });
    
    if (!currentAnalytics) {
      console.log('Nenhuma métrica encontrada para este conteúdo');
      return;
    }
    
    console.log('Métricas atuais:', currentAnalytics);
    
    // Verificar histórico
    const history = await prisma.analyticsHistory.findMany({
      where: {
        analyticsId: currentAnalytics.id
      },
      orderBy: {
        recordedAt: 'desc'
      },
      take: 10
    });
    
    console.log(`Histórico encontrado: ${history.length} registros`);
    
    if (history.length > 0) {
      console.log('Últimos registros do histórico:');
      history.forEach((record, index) => {
        console.log(`${index + 1}. ${record.recordedAt.toISOString()}: 
          Impressões: ${record.impressions}
          Alcance: ${record.reach}
          Curtidas: ${record.likes}
          Comentários: ${record.comments}
          Compartilhamentos: ${record.shares}
          Engajamento: ${record.engagement}%`);
      });
    }
    
    // Testar criação de novo registro no histórico
    console.log('Testando criação de novo registro no histórico...');
    
    const newHistoryRecord = await prisma.analyticsHistory.create({
      data: {
        analyticsId: currentAnalytics.id,
        platform: 'telegram',
        impressions: currentAnalytics.impressions + Math.floor(Math.random() * 100),
        reach: currentAnalytics.reach + Math.floor(Math.random() * 50),
        likes: currentAnalytics.likes + Math.floor(Math.random() * 10),
        comments: currentAnalytics.comments + Math.floor(Math.random() * 5),
        shares: currentAnalytics.shares + Math.floor(Math.random() * 3),
        saves: currentAnalytics.saves + Math.floor(Math.random() * 2),
        engagement: parseFloat(((currentAnalytics.engagement || 0) + (Math.random() * 2)).toFixed(2)),
        clickThroughRate: currentAnalytics.clickThroughRate ? parseFloat(((currentAnalytics.clickThroughRate || 0) + (Math.random() * 0.5)).toFixed(2)) : null,
        recordedAt: new Date()
      }
    });
    
    console.log('Novo registro criado:', newHistoryRecord);
    
    // Atualizar métricas atuais
    console.log('Atualizando métricas atuais...');
    
    const updatedAnalytics = await prisma.contentAnalytics.update({
      where: { id: currentAnalytics.id },
      data: {
        impressions: newHistoryRecord.impressions,
        reach: newHistoryRecord.reach,
        likes: newHistoryRecord.likes,
        comments: newHistoryRecord.comments,
        shares: newHistoryRecord.shares,
        saves: newHistoryRecord.saves,
        engagement: newHistoryRecord.engagement,
        clickThroughRate: newHistoryRecord.clickThroughRate,
        lastUpdated: new Date()
      }
    });
    
    console.log('Métricas atualizadas:', updatedAnalytics);
    
    console.log('Teste concluído com sucesso!');
    
  } catch (error) {
    console.error('Erro durante o teste:', error);
  }
}

// Executar o teste se este arquivo for executado diretamente
if (require.main === module) {
  const contentId = process.argv[2];
  if (!contentId) {
    console.error('Por favor, forneça um ID de conteúdo como argumento');
    process.exit(1);
  }
  
  testTelegramAnalyticsHistory(contentId);
}