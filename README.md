## edno-ts
express-like node framework built in typescript.

## How to install

- this is a node module, avaliable in npm.
- before installing you must download [node](https://nodejs.org/es/)


    npm install edno-ts

## Examples

start an app:

    const edno = new Edno();  
	const ednoApp = edno.create(PORT);

get method:

    ednoApp.get(  
    '/product/:id',  
  
    (req: Request, res: Response, next: () => void) => {  
        // middleware code  
	  next();  
    },  
    ({ body, params }: Request, res: Response) => {  
        // service code  
	  }	  
	);

use Express middlewares if wanted such helmet, morgan, etc:

    edno.use(helmet());  
	edno.use(morgan('dev'))

## Contributing

feel free to help in the repository.
[Contributing Guide](https://github.com/Blopaa/Edno#CONTRIBUTING.md)

## License

MIT
