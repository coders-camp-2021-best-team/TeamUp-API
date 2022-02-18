import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    verbose: true,
    passWithNoTests: true,
    transform: {
        '^.+\\.ts?$': 'ts-jest'
    }
};

export default config;
