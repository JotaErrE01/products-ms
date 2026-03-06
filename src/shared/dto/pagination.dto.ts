import { Type } from "class-transformer";
import { IsOptional, Min, IsNumber } from "class-validator";

export class PaginationDTO {
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}

