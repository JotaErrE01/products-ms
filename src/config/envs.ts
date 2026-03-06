import 'dotenv/config';
import z from 'zod';

const envsSchema = z.object({
  PORT: z.coerce.number().min(0).max(8000),
  DATABASE_URL: z.string().min(1).readonly(),
  NATS_SERVERS: z.array(z.string().min(1)).min(1),
});

type EnvVars = z.infer<typeof envsSchema>;

const { data, error } = envsSchema.safeParse({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(',').map(s => s.trim()),
});

if (error) throw new Error(`Error en Enviroment Variables ${error.message}`);

export default (): EnvVars => data;
