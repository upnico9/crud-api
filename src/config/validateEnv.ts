export function validateEnv(requiredVars: string[]) {
    const missing = requiredVars.filter((key) => !process.env[key]);
  
    if (missing.length > 0) {
      console.error('Missing required environment variables:');
      missing.forEach((key) => console.error(`- ${key}`));
      process.exit(1);
    }
    console.log('Environnement variables loaded');
  }
  