import { HttpException } from "../../../src/utils/HttpException";
import { HttpStatus } from "../../../src/types/HttpStatus";

export class ValidationExeption extends HttpException {
  constructor(private msg: string) {
    super(HttpStatus.BAD_REQUEST, msg);
  }
}
