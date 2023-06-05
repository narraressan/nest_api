import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';

const loadConfig = async (env: ConfigService): Promise<Record<string, any>> => {
  const params = {
    ttl: parseInt(env.get('CACHE_TTL')),
  };

  console.log(`CACHE CONFIG: ${JSON.stringify(params)}`);
  return params;
};

// CacheModule (which uses interceptors to cache responses) will not work properly with gql
export default CacheModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => await loadConfig(config),
});
