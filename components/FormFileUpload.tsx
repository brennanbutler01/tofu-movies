import { UseFormReturnType } from '@mantine/form'
import React from 'react'
import { showNotification } from '@mantine/notifications'
import { FileInput, FileInputProps } from '@mantine/core'
import { IMovieListForm } from './movieLists/MovieListForm'
import { uploadImage } from '../utils/uploadImage'
interface Props {
    form: UseFormReturnType<IMovieListForm>
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    extraActions?: (() => void)[]
}
export const FormFileUpload = ({
    form,
    setLoading,
    extraActions,
    ...rest
}: Props & Omit<FileInputProps, 'form'>) => (
    <FileInput
        {...rest}
        accept='image/jpeg,image/png,image/webp'
        onChange={async file => {
            if (!file) return
            setLoading(true)
            try {
                form.setFieldValue('image', await uploadImage(file))
                extraActions?.forEach(action => action())
            } catch {
                showNotification({
                    color: 'red',
                    message:
                        'Upload failed. Choose an image under 5 MB and try again.',
                })
            } finally {
                setLoading(false)
            }
        }}
    />
)
