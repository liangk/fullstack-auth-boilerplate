import morgan from 'morgan';

// Combined preset is verbose; feel free to adjust per environment
export const logger = morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev');
