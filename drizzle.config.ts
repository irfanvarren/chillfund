import { defineConfig } from 'drizzle-kit';
export default defineConfig({
    out: './drizzle',
    schema: './src/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: "postgresql://chillfund_owner:npg_KnhRJBw0c3YH@ep-yellow-tooth-a1z1lyuu-pooler.ap-southeast-1.aws.neon.tech/chillfund?sslmode=require",
    },
}); 