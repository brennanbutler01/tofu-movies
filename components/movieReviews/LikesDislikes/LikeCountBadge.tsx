import { Badge, Text } from '@mantine/core'

interface ILikeCount {
    count: number
    badgeColor: string
    disabled: boolean
}

export const LikeCountBadge = ({ count, badgeColor, disabled }: ILikeCount) => {
    return (
        <Badge
            variant={'light'}
            color={disabled ? 'gray' : badgeColor}
            sx={{
                ':hover': {
                    cursor: 'pointer',
                },
            }}
        >
            <Text weight={700} size='md'>
                {count}
            </Text>
        </Badge>
    )
}
