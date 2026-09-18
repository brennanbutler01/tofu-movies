import { Alert, Button, Group, Text } from '@mantine/core'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export function VisitorNotice() {
    const { status } = useSession()
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<string>()
    if (process.env.NEXT_PUBLIC_VISITOR_DEMO !== 'true') return null
    return (
        <Alert title='Portfolio demo' mb='md'>
            <Group position='apart'>
                <Text size='sm'>
                    Fictional sample films. Your lists and reviews save for one
                    hour in a separate visitor session. Live catalogue data and
                    uploads are unavailable.
                </Text>
                {status === 'authenticated' ? (
                    <Button
                        size='xs'
                        loading={busy}
                        onClick={async () => {
                            setBusy(true)
                            setError(undefined)
                            try {
                                const response = await fetch(
                                    '/api/demo/session',
                                    { method: 'DELETE' }
                                )
                                if (!response.ok)
                                    throw new Error(
                                        'Reset failed. Please retry.'
                                    )
                                window.location.assign('/auth/signin')
                            } catch (error) {
                                setError(
                                    error instanceof Error
                                        ? error.message
                                        : 'Reset failed.'
                                )
                                setBusy(false)
                            }
                        }}
                    >
                        Reset demo
                    </Button>
                ) : (
                    <Link href='/auth/signin'>Start demo</Link>
                )}
                {error && (
                    <Text color='red' role='alert'>
                        {error}
                    </Text>
                )}
            </Group>
        </Alert>
    )
}
