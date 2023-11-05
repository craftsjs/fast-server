import { Middleware } from "../types/handler.type";
import { IVerb } from "./verb.interface";

export interface IRouter extends IVerb {
  use(middleware: Middleware): void;
}