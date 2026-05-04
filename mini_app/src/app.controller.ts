import { Controller, Get } from "@nestjs/common";

@Controller("/app")
export class AppController {
  @Get("/data")
  getRootRoute() {
    return "<h1>Hello There!</h1>";
  }

  @Get('/get-data')
  getByThere() {
    return "<h1>Get Data Route</h1>";
  }
}
