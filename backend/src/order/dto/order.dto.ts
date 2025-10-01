import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

//TODO реализовать DTO для /orders
export class PostTicketsDto {
  @IsString()
  @IsNotEmpty()
  film: string;

  @IsString()
  @IsOptional()
  day: string;

  @IsString()
  @IsOptional()
  time: string;

  @IsString()
  @IsNotEmpty()
  session: string;

  @IsString()
  @IsNotEmpty()
  daytime: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'Номер ряда должен быть не менее 1' })
  @Max(5, { message: 'Номер ряда должен быть не более 5' })
  row: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'Номер места должен быть не менее 1' })
  @Max(10, { message: 'Номер места должен быть не более 10' })
  seat: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'Цена билета не может быть отрицательной' })
  price: number;
}

export class PostOrderDto {
  @IsEmail({}, { message: 'Некорректный email адрес' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostTicketsDto)
  @ArrayMinSize(1)
  tickets: PostTicketsDto[];
}

export class TicketsResponseDto {
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
}

export class OrderResponseDto {
  total: number;
  items: TicketsResponseDto[];
}
