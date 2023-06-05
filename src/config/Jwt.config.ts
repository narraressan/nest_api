import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

const loadConfig = async (env: ConfigService): Promise<Record<string, any>> => {
  const params = {
    secret: env.get('JWT_SECRET'),
  };

  console.log(`JWT CONFIG: ${JSON.stringify(params)}`);
  return params;
};

export default JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (env: ConfigService) => await loadConfig(env),
});
