import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';

const loadConfig = async (env: ConfigService): Promise<Record<string, any>> => {
  const params = {
    ttl: parseInt(env.get('THROTTLE_TTL')),
    limit: parseInt(env.get('THROTTLE_LIMIT')),
  };

  console.log(`THROTTLE CONFIG: ${JSON.stringify(params)}`);
  return params;
};

// careful with tests or health check APIs - error will raise 429 code
export default ThrottlerModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => await loadConfig(config),
});
