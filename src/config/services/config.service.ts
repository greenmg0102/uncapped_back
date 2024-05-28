import * as dotenv from 'dotenv';

export class ConfigService {
    private readonly envConfig: Record<string, string>;
    constructor() {
        const result = dotenv.config();

        if (result.error) {
            this.envConfig = process.env;
        } else {
            this.envConfig = result.parsed;
        }
    }

    public get(key: string): string {
        return this.envConfig[key];
    }

    public async getPortConfig() {
        return this.get('PORT');
    }

    public async getMongoConfig() {

        // mongodb+srv://comantivirus250:UU91cP4ozLsOmFli@cluster0.ozkykn8.mongodb.net/?retryWrites=true&w=majority&ssl=true&ssl_cert_reqs=CERT_NONE
        // uri: 'mongodb://' + this.get('DATABASE_HOST') + ':' + this.get('DATABASE_PORT') + '/' + this.get('DATABASE_NAME')
        // uri: "mongodb+srv://pokerstrategy:Supernova%40525@cluster0.1syllpl.mongodb.net/?retryWrites=true&w=majority",

        return {
            uri: 'mongodb://' + this.get('DATABASE_HOST') + ':' + this.get('DATABASE_PORT') + '/' + this.get('DATABASE_NAME'),
            // uri: "mongodb+srv://pokerstrategy:Supernova%40525@cluster0.1syllpl.mongodb.net/?retryWrites=true&w=majority",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
    }
}
