// Fallback para quando @prisma/client não estiver instalado
let PrismaClient: any;
try {
  PrismaClient = require('@prisma/client').PrismaClient;
} catch (error) {
  console.warn('PrismaClient not available - install @prisma/client');
  PrismaClient = class MockPrismaClient {
    user = { findUnique: () => null, create: () => null, update: () => null };
    systemSettings = { create: () => null, findUnique: () => null };
    $connect = () => Promise.resolve();
    $disconnect = () => Promise.resolve();
  };
}

const globalForPrisma = globalThis as unknown as {
  prisma: typeof PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Helper functions for common database operations
export const dbHelpers = {
  // User operations
  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        subscription: true,
        connectedAccounts: true,
        systemSettings: true,
      },
    });
  },

  async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        subscription: true,
        connectedAccounts: true,
        systemSettings: true,
      },
    });
  },

  // Content operations
  async getContentsByUser(userId: string, filters?: {
    status?: string;
    category?: string;
    platform?: string;
    limit?: number;
    offset?: number;
  }) {
    const { status, category, platform, limit = 20, offset = 0 } = filters || {};
    
    return prisma.content.findMany({
      where: {
        userId,
        ...(status && { status: status as any }),
        ...(category && { category: category as any }),
        ...(platform && { platforms: { has: platform as any } }),
      },
      include: {
        mediaFiles: true,
        analytics: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  },

  // Analytics operations
  async getContentAnalytics(contentId: string) {
    return prisma.contentAnalytics.findMany({
      where: { contentId },
      orderBy: { lastUpdated: 'desc' },
    });
  },

  async getUserAnalytics(userId: string, dateRange?: { from: Date; to: Date }) {
    const whereClause: any = {
      content: { userId },
    };

    if (dateRange) {
      whereClause.lastUpdated = {
        gte: dateRange.from,
        lte: dateRange.to,
      };
    }

    return prisma.contentAnalytics.findMany({
      where: whereClause,
      include: {
        content: {
          select: {
            title: true,
            category: true,
            platforms: true,
          },
        },
      },
      orderBy: { lastUpdated: 'desc' },
    });
  },

  // Campaign operations
  async getCampaignsByUser(userId: string) {
    return prisma.campaign.findMany({
      where: { userId },
      include: {
        campaignContents: {
          include: {
            content: true,
          },
        },
        campaignAnalytics: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  // Blog operations
  async getBlogPostsByUser(userId: string, status?: string) {
    return prisma.blogPost.findMany({
      where: {
        userId,
        ...(status && { status: status as any }),
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  // AI operations
  async saveAIPrompt(data: {
    userId: string;
    type: string;
    prompt: string;
    response: string;
    model: string;
    tokensUsed: number;
  }) {
    return prisma.aIPrompt.create({
      data: {
        userId: data.userId,
        type: data.type as any,
        prompt: data.prompt,
        response: data.response,
        model: data.model as any,
        tokensUsed: data.tokensUsed,
      },
    });
  },

  // Calendar operations
  async getCalendarEvents(userId: string, dateRange?: { from: Date; to: Date }) {
    const whereClause: any = { userId };

    if (dateRange) {
      whereClause.scheduledFor = {
        gte: dateRange.from,
        lte: dateRange.to,
      };
    }

    return prisma.calendarEvent.findMany({
      where: whereClause,
      include: {
        content: {
          select: {
            title: true,
            category: true,
            platforms: true,
          },
        },
      },
      orderBy: { scheduledFor: 'asc' },
    });
  },

  // Connected accounts operations
  async getConnectedAccounts(userId: string) {
    return prisma.connectedAccount.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async updateConnectedAccount(accountId: string, data: any) {
    return prisma.connectedAccount.update({
      where: { id: accountId },
      data,
    });
  },

  // System settings operations
  async getUserSettings(userId: string) {
    return prisma.systemSettings.findUnique({
      where: { userId },
    });
  },

  async updateUserSettings(userId: string, data: any) {
    return prisma.systemSettings.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });
  },

  // Utility functions
  async getStats(userId: string) {
    const [
      totalContents,
      publishedContents,
      totalCampaigns,
      activeCampaigns,
      totalBlogPosts,
      publishedBlogPosts,
    ] = await Promise.all([
      prisma.content.count({ where: { userId } }),
      prisma.content.count({ where: { userId, status: 'PUBLISHED' } }),
      prisma.campaign.count({ where: { userId } }),
      prisma.campaign.count({ where: { userId, status: 'ACTIVE' } }),
      prisma.blogPost.count({ where: { userId } }),
      prisma.blogPost.count({ where: { userId, status: 'PUBLISHED' } }),
    ]);

    return {
      contents: { total: totalContents, published: publishedContents },
      campaigns: { total: totalCampaigns, active: activeCampaigns },
      blogPosts: { total: totalBlogPosts, published: publishedBlogPosts },
    };
  },
};