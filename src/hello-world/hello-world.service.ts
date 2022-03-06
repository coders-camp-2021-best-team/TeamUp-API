import { GreetingDto } from './greeting.dto';
import { Greeting } from './greeting.entity';

export const HelloWorldService = new (class {
    async greet(greetingID: string, name: string) {
        const greeting = await Greeting.findOne(greetingID);

        if (!greeting) return null;

        greeting.text = greeting.text.replaceAll('{name}', name);

        return greeting;
    }

    getAllGreetings() {
        return Greeting.find();
    }

    createGreeting(greeting: GreetingDto) {
        return Greeting.save(Greeting.create(greeting));
    }
})();
