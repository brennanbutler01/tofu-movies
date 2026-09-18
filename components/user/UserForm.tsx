import {
    Title,
    Stack,
    TextInput,
    Group,
    Button,
    FileInput,
    Checkbox,
    Avatar,
    Input,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { uploadImage } from '../../utils/uploadImage'
import axios from 'axios'
import { useUserCRUD } from 'user/useUserCRUD'
import { showNotification } from '@mantine/notifications'
import { BiCheck } from 'react-icons/bi'

interface IFormProps {
    setVisibility: React.Dispatch<React.SetStateAction<boolean>>
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export interface IUserForm {
    name?: string
    email?: string
    image?: string
}

export const UserForm = ({ setLoading, setVisibility }: IFormProps) => {
    const session = useSession()
    const [file, setFile] = useState<File | null>(null)
    const form = useForm<IUserForm>({
        initialValues: {
            email: session?.data?.user?.email || '',
            name: session?.data?.user?.name || '',
            image: session?.data?.user?.image || '',
        },
    })
    const { updateUser } = useUserCRUD()
    const [avatarUploadVisible, setAvatarUploadVisible] = useState(false)

    return (
        <form
            onSubmit={form.onSubmit(
                async values => {
                    setLoading(true)
                    try {
                        await updateUser(values)
                        setVisibility(false)
                    } catch {
                        showNotification({
                            color: 'red',
                            message:
                                'Could not save your profile. Your changes are still here.',
                        })
                    } finally {
                        setLoading(false)
                    }
                },
                errs => console.log(errs)
            )}
        >
            <Title order={3} mb='sm'>
                Edit User Details
            </Title>
            <Stack spacing='xs'>
                <TextInput label='Name' {...form.getInputProps('name')} />
                <Input.Wrapper
                    inputWrapperOrder={['label', 'input', 'description']}
                    description='Make sure you have access to the new email address!'
                    label='Email'
                >
                    <TextInput {...form.getInputProps('email')} disabled />
                </Input.Wrapper>

                <Stack mt={'sm'}>
                    {form.values.image && (
                        <Group>
                            <Avatar
                                radius={'md'}
                                src={form.values.image}
                                size={'lg'}
                            />
                            <TextInput
                                style={{ flexGrow: 2 }}
                                label={'Avatar link'}
                                {...form.getInputProps('image')}
                                disabled
                            />
                        </Group>
                    )}
                    <Group position={'right'}>
                        <Checkbox
                            disabled={
                                process.env.NEXT_PUBLIC_VISITOR_DEMO === 'true'
                            }
                            label={
                                process.env.NEXT_PUBLIC_VISITOR_DEMO === 'true'
                                    ? 'Avatar uploads unavailable in demo'
                                    : 'Show Avatar Upload'
                            }
                            checked={avatarUploadVisible}
                            onChange={e =>
                                setAvatarUploadVisible(e.currentTarget.checked)
                            }
                        />
                        {avatarUploadVisible && (
                            <FileInput
                                label='Choose avatar file'
                                value={file}
                                onChange={async nextFile => {
                                    if (!nextFile) return
                                    setFile(nextFile)
                                    setLoading(true)
                                    try {
                                        form.setFieldValue(
                                            'image',
                                            await uploadImage(nextFile)
                                        )
                                        setAvatarUploadVisible(false)
                                    } catch {
                                        showNotification({
                                            color: 'red',
                                            message:
                                                'Image upload failed. Please try again.',
                                        })
                                    } finally {
                                        setFile(null)
                                        setLoading(false)
                                    }
                                }}
                            />
                        )}
                    </Group>
                </Stack>
            </Stack>
            <Group mt='xl'>
                <Button variant='light' type='submit'>
                    Save Changes
                </Button>
                <Button variant='default' onClick={() => setVisibility(false)}>
                    Cancel
                </Button>
            </Group>
        </form>
    )
}
