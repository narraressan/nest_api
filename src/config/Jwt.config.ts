import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

const loadConfig = (env: ConfigService) => {
  const params = {
    secret: env.get('JWT_SECRET'),
  };

  console.log(`JWT CONFIG: ${JSON.stringify(params)}`);
  return params;
};

export default JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (env: ConfigService) => loadConfig(env),
});
