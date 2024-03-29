import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/shared/database/prisma.service';
import { hash } from 'bcryptjs';
import { UsersRepository } from 'src/shared/repositories/users.repositories';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepo: UsersRepository) {}

    async create(createUserDto: CreateUserDto) {
        const { name, email, password } = createUserDto;

        const emailExists = await this.usersRepo.findByEmail({
            where: { email },
            select: { id: true },
        });

        if (emailExists) {
            throw new ConflictException('This e-mail is already in use.');
        }

        const hashedPassword = await hash(password, 12);

        await this.usersRepo.create({
            data: {
                name,
                email,
                password: hashedPassword,
                categories: {
                    createMany: {
                        data: [
                            { name: 'Salário', icon: 'salary', type: 'INCOME' },
                            {
                                name: 'Freelance',
                                icon: 'freelance',
                                type: 'INCOME',
                            },
                            { name: 'Outro', icon: 'other', type: 'INCOME' },
                            { name: 'Casa', icon: 'home', type: 'EXPENSE' },
                            {
                                name: 'Alimentação',
                                icon: 'food',
                                type: 'EXPENSE',
                            },
                            {
                                name: 'Educação',
                                icon: 'education',
                                type: 'EXPENSE',
                            },
                            { name: 'Lazer', icon: 'fun', type: 'EXPENSE' },
                            {
                                name: 'Mercado',
                                icon: 'grocery',
                                type: 'EXPENSE',
                            },
                            {
                                name: 'Roupas',
                                icon: 'clothes',
                                type: 'EXPENSE',
                            },
                            {
                                name: 'Transporte',
                                icon: 'transport',
                                type: 'EXPENSE',
                            },
                            { name: 'Viagem', icon: 'travel', type: 'EXPENSE' },
                            { name: 'Outro', icon: 'other', type: 'EXPENSE' },
                        ],
                    },
                },
            },
        });

        return {
            name,
            email,
        };
    }
}
