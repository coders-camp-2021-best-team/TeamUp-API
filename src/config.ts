import Joi from 'joi';

export interface EnvVariables {
    NODE_ENV: 'production' | 'development';
    PORT: number;
}

const envSchema = Joi.object<EnvVariables>({
    NODE_ENV: Joi.string()
        .valid('production', 'development')
        .default('development'),
    PORT: Joi.number().port().default(3000)
}).unknown();

const validated = envSchema.validate(process.env);

if (validated.error) {
    throw new Error(validated.error.message);
}

export default validated.value;
