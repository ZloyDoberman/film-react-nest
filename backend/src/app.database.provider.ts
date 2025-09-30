import * as mongoose from 'mongoose';
import { AppConfig } from './app.config.provider';

export const databaseProvider = {
  provide: 'DATABASE',
  useFactory: async (config: AppConfig): Promise<typeof mongoose> => {
    try {
      const connection = await mongoose.connect(config.database.url);
      return connection;
    } catch (error) {
      throw error;
    }
  },
  inject: ['CONFIG'],
};
