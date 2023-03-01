import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsNumber } from "class-validator"

export class WalletDto {
    @IsNumber()
    @ApiProperty({
        description: 'Amount',
        example: 100,
        required: true,
        title: 'Amount',
    })
    amount: number;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'Narration',
        example: 'Payment Narration',
        required: false,
        title: 'Narration',
    })
    narration?: string;
}

export class VerifyPaymentDto {
    @IsString()
    @ApiProperty({
        description: 'Reference',
        example: 'iRef-PDxvK17533577nR5oN',
        required: true,
        title: 'Payment reference',
    })
    reference: string;
}
