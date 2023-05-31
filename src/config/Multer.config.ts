import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { toMb } from 'src/utils';

const loadConfig = (env: ConfigService): Record<string, any> => {
  const config = {
    limits: {
      files: 2,
      fileSize: toMb(parseInt(env.get('SINGLE_FILE_LIMIT_MB'))),
    },
    dest: env.get('UPLOAD_DIR'),
  };

  console.log({ message: `UPLOAD CONFIG: ${JSON.stringify(config)}` });
  return config;
};

export default MulterModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => loadConfig(config),
});
