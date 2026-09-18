import sanitizeHtml from 'sanitize-html'
export function reviewHtml(value: string) {
    return sanitizeHtml(value, {
        allowedTags: [
            'p',
            'br',
            'strong',
            'em',
            'u',
            'ul',
            'ol',
            'li',
            'blockquote',
        ],
        allowedAttributes: {},
        disallowedTagsMode: 'discard',
    })
}
