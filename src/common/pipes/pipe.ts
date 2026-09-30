import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import z from "zod"

export class MyPipe implements PipeTransform {
  constructor(private readonly schema: z.ZodType){}
  transform(value: any, metadata: ArgumentMetadata) {
    try{
      this.schema.parse(value)
      return value
    } catch (e) {
      if (e instanceof z.ZodError){
        throw new BadRequestException({
          message: "validation error",
          errors: e.issues
        })
      }
    }

  }
  
}