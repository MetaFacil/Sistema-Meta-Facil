import { TelegramService } from '@/lib/integrations/telegram-service';
import { prisma } from '@/lib/prisma';
import { testTelegramAnalyticsHistory } from './test-telegram-analytics';

/**
 * Função para testar a integração completa com o Telegram
 */
export async function testTelegramIntegration() {
  try {
    console.log('Iniciando teste de integração completa com o Telegram...');
    
    // Token e ID do canal (valores de exemplo)
    const botToken = '8281790936:AAHHud22tYPlLxecZW5nMaDcF8GgOpKQip8';
    const chatId = '-1002290954703';
    
    // Inicializar o serviço do Telegram
    const telegramService = new TelegramService(botToken);
    
    // Testar validação do token
    console.log('Testando validação do token...');
    const isValid = await telegramService.validateToken();
    console.log(`Token válido: ${isValid}`);
    
    if (!isValid) {
      console.error('Token inválido. Não é possível continuar com o teste.');
      return;
    }
    
    // Testar obtenção de informações do bot
    console.log('Obtendo informações do bot...');
    const botInfo = await telegramService.getBotInfo();
    console.log('Informações do bot:', botInfo);
    
    // Testar obtenção de informações do chat
    console.log('Obtendo informações do chat...');
    const chatInfo = await telegramService.getChatInfo(chatId);
    console.log('Informações do chat:', chatInfo);
    
    // Testar se o bot é administrador
    console.log('Verificando se o bot é administrador...');
    const isAdmin = await telegramService.isBotAdmin(chatId);
    console.log(`Bot é administrador: ${isAdmin}`);
    
    // Coletar métricas reais/estimadas
    console.log('Coletando métricas...');
    const metrics = await telegramService.collectRealMetrics(chatId);
    console.log('Métricas coletadas:', metrics);
    
    // Se houver conteúdo no banco de dados, testar o histórico
    console.log('Buscando conteúdo para testar histórico...');
    const content = await prisma.content.findFirst({
      where: {
        platforms: {
          contains: 'telegram'
        }
      }
    });
    
    if (content) {
      console.log(`Conteúdo encontrado: ${content.title}`);
      
      // Testar o sistema de histórico
      await testTelegramAnalyticsHistory(content.id);
    } else {
      console.log('Nenhum conteúdo encontrado para testar o histórico.');
    }
    
    console.log('Teste de integração concluído com sucesso!');
    
  } catch (error) {
    console.error('Erro durante o teste de integração:', error);
  }
}

// Executar o teste se este arquivo for executado diretamente
if (require.main === module) {
  testTelegramIntegration();
}