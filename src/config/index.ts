const jwt = {
    JWT_KEY: 'e2f667e43efff4dadbbd6f3b177aa4f7',
    SALT_ROUNDS: 13,
    EXPIRES_IN: '1d'
}

const env = {
    host: 'http://localhost',
    port: 3333
}
const baseUrl: string = `${env.host}:${String(env.port)}/`;
const staticUrl: string = baseUrl + 'uploads/';

export { 
    jwt, 
    env, 
    baseUrl,
    staticUrl
}