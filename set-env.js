import { writeFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';
const targetPath = isProd
    ? './src/environments/environment.prod.ts'
    : './src/environments/environment.ts';

const envFileContent = `
export const environment = {
  production: ${isProd},
  apiUrl: '${process.env.URL}'
};
`;

writeFileSync(targetPath, envFileContent);
console.log(`✅ Environment file generated at ${targetPath}`);
