import { getRepository } from 'typeorm';
import { GreetingDto } from './greeting.dto';
import { Greeting } from './greeting.entity';

export const HelloWorldService = new (class {
    async greet(greetingID: string, name: string) {
        const greetingsRepo = getRepository(Greeting);

        const greeting = await greetingsRepo.findOne(greetingID);

        if (!greeting) return null;

        greeting.text = greeting.text.replaceAll('{name}', name);

        return greeting;
    }

    getAllGreetings() {
        const greetingsRepo = getRepository(Greeting);

        return greetingsRepo.find();
    }

    createGreeting(greeting: GreetingDto) {
        const greetingsRepo = getRepository(Greeting);

        return greetingsRepo.save(greeting);
    }
})();
