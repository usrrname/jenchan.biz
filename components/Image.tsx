/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { ImageProps } from 'next/image'
import NextImage from 'next/image'

const Image = ({ ...rest }: ImageProps) => <NextImage {...rest} />

export default Image
