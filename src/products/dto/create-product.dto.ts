import { Type } from "class-transformer";
import { IsNumber, IsString, Min } from "class-validator";

export class CreateProductDto {

  @IsString()
  readonly name: string;

  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio debe ser un número con máximo 2 decimales.' }
  )
  @Min(0, { message: 'El precio no puede ser negativo.' })
  readonly price: number;

}
