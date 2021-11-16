## edno-ts

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

edno is an OOP framework with decorators built in typescript to run quickly and efficiently.

## How to install

this is a node module, avaliable in npm.

before installing you must download [node](https://nodejs.org/es/)

    npm install edno-ts

## Features
- Start an app

```ts

/**
 * example: 
 * 
 * @example const options = {
 *   port: 3000,
 *   root: __dirname,
 *   middlewares: [morgan("dev"), helmet()]
 *   paths: {
 *     exceptions: "\exceptions\handlers",
 *     controller: "\**\controllers\*.ts",
 *     component: "\components\*.ts"
 *   }
 * }
 */
const options: Options = {
  port: number,
  root: string,
  middlewares?: MiddlewareFunc[],
  paths?: {
    exception?: string,
    controller?: string,
    component?: string,
  }
}

const edno = new Edno(options);
const ednoApp = edno.start(() => {
  console.log(`server on port ${PORT}`)
})
```
- Define the base path of your controllers
```ts
@Controller("/user")
class x {}
```
- Create endpoint supporting GET, POST, PUT, DELETE.
```ts
@Controller("<path>")
class x {
  @Get("<path>")
  public greetUser(req: Request, res: Response){
    res.send("HI");
  }
  @Post("<path>")
  public x (/*params*/){}
  @Put("<path>")
  public x (/*params*/){}
  @Delete("<path>")
  public x (/*params*/){}
}
```
- Read posted body on JSON.
```ts
@Get("<path>")
public greetUser(req: Request, res: Response){
  const body = req.body;
}
```
- Route parameters
```ts
@Get("/:name")
public greetUser(req: Request, res: Response){
  const username = req.params?.name
  res.send(`HELLO ${username}`);
}
```

- Middlewares
```ts
/**
 * Class Middleware decorator
 * 
 * Middleware structure -> (req: Request, rest: Response, next: () => void) => void
 */
@Contoler('<path>')
@ControllerMiddleware(<Middleware array>)
class x {
  
  @Get("<path>")
  @Middleware(<Middleware array>)
  public y (...){...}
  
}
```

## Error Handling

- Create your own exceptions

```ts

/**
 * you can create your own exceptions by extending the HttpException class,
 * in the super() you must pass as the first parameter a number,
 * the status, and the message to be sent, which can be an object or a string.
 */

class CustomException extends HttpException {
  constructor(private status: number, private message: string | Record<string, any>) {
    super(status, message);
  }
}
```

- Catch exceptions

```ts

/**
 * throw the exception at the endpoint
 */

@Controller(...)
class controller {
  @Get(...)
  public endpoint (){
    throw new Exception();
  }
}

/**
 * in the decorator you put the class you want to be intercepted when you throw it,
 * the method it will be executed only if the exception is thrown,
 * in the method you receive the exception thrown example: 
 * throw new Exception("something happened")
 * -> you will receive this exception as a parameter, with message "something happened", etc.
 * 
 */

class ExceptionHandler {
  @ErrorHandler(Exception)
  public handlerException (exception: Exception){
    return // new response will be sent to client in the event of the handled exception
  }
}
```

## Injection 
dependency injection can be performed using 2 decorators

- Component

  @Component will mark the decorated class as injectable,
  without the class being decorated, it will not be possible to inject the class.
```ts
@Component()
class Greet {
  public greet(){
    console.log("HI")
  }
}
```

- Inject

    @Inject will inject
the class sent as a parameter whenever it is a component (decorated with @Component) 
and @Inject is inside the constructor.

```ts
@Controller(...)
class X {
  
  constructor(
    @Inject(Greet) private greet: Greet
  ) {}
  
}
```

## Contributing

feel free to help in the repository.
[Contributing Guide](https://github.com/Blopaa/Edno/blob/dev/CONTRIBUTING.md)

## License

MIT

[npm-url]: https://npmjs.org/package/edno-ts

[npm-image]: https://img.shields.io/npm/v/edno-ts.svg

[downloads-image]: https://img.shields.io/npm/dm/edno-ts.svg

[downloads-url]: https://npmcharts.com/compare/edno-ts?minimal=true