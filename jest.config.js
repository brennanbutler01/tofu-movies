const nextJest = require('next/jest')
const createConfig = nextJest({ dir: './' })({
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/__e2e__/'],
    watchman: false,
})
module.exports = async () => ({
    ...(await createConfig()),
    transformIgnorePatterns: [
        '/node_modules/(?!(?:sanitize-html|htmlparser2|domhandler|domutils|domelementtype|dom-serializer|entities)/)',
    ],
})
