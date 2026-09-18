module.exports = {
    reactStrictMode: true,
    experimental: { esmExternals: 'loose' },
    // Bundle the sanitizer parser chain so hosted CommonJS loaders do not
    // require its ESM-only dependencies at runtime.
    transpilePackages: [
        'sanitize-html',
        'htmlparser2',
        'domhandler',
        'domutils',
        'domelementtype',
        'dom-serializer',
        'entities',
    ],
}
