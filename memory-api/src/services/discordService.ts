import { Client, GatewayIntentBits, TextChannel, Collection, Message } from 'discord.js';
import config from '../config';

class DiscordService {
  private client: Client;
  private isReady: boolean = false;
  
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    });

    this.initialize();
  }

  private initialize(): void {
    if (!config.discord.token) {
      console.warn('Discord token not provided. Discord functionality will be unavailable.');
      return;
    }

    this.client.on('ready', () => {
      console.log(`Discord bot logged in as ${this.client.user?.tag}`);
      this.isReady = true;
    });

    this.client.login(config.discord.token).catch(error => {
      console.error('Failed to log in to Discord:', error);
    });
  }

  private async ensureReady(): Promise<boolean> {
    if (!this.isReady && config.discord.token) {
      console.log('Waiting for Discord client to be ready...');
      // Wait for up to 5 seconds for the client to be ready
      for (let i = 0; i < 10; i++) {
        if (this.isReady) break;
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    return this.isReady;
  }

  async getMessages(channelId: string, limit: number = 50): Promise<any[]> {
    if (!(await this.ensureReady())) {
      throw new Error('Discord client is not ready. Please check your configuration.');
    }

    try {
      const channel = await this.client.channels.fetch(channelId);
      if (!channel || !(channel instanceof TextChannel)) {
        throw new Error('Channel not found or is not a text channel');
      }

      const messages = await channel.messages.fetch({ limit });
      return [...messages.values()].map(msg => ({
        id: msg.id,
        channelId: msg.channelId,
        author: {
          id: msg.author.id,
          username: msg.author.username
        },
        content: msg.content,
        timestamp: msg.createdAt
      }));
    } catch (error) {
      console.error('Error fetching Discord messages:', error);
      throw new Error(`Failed to fetch messages: ${(error as Error).message}`);
    }
  }

  async sendMessage(channelId: string, content: string): Promise<any> {
    if (!(await this.ensureReady())) {
      throw new Error('Discord client is not ready. Please check your configuration.');
    }

    try {
      const channel = await this.client.channels.fetch(channelId);
      if (!channel || !(channel instanceof TextChannel)) {
        throw new Error('Channel not found or is not a text channel');
      }

      const message = await channel.send(content);
      return {
        id: message.id,
        channelId: message.channelId,
        content: message.content,
        timestamp: message.createdAt
      };
    } catch (error) {
      console.error('Error sending Discord message:', error);
      throw new Error(`Failed to send message: ${(error as Error).message}`);
    }
  }
}

export default new DiscordService();