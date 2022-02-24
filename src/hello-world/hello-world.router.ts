import { Router } from 'express';
import { HelloWorldController } from '.';

export const HelloWorldRouter = Router();

HelloWorldRouter.get('/greet', HelloWorldController.greet);
HelloWorldRouter.get('/greetings', HelloWorldController.getAllGreetings);
HelloWorldRouter.post('/greetings', HelloWorldController.createGreeting);
