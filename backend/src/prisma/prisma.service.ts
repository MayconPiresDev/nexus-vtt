import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        if (!process.env.DATABASE_URL) {
            console.error('❌ ERRO: DATABASE_URL não encontrada no arquivo .env');
        }

        const pool = new Pool({
            connectionString: process.env.DATABASE_URL
        });

        const adapter = new PrismaPg(pool);

        super({adapter});
    }

    async onModuleInit() {
        await this.$connect();
    }
}