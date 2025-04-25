
import { Mermaid } from 'mdx-mermaid/lib/Mermaid'
import type { MDXComponents } from 'mdx/types'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import Pre from 'pliny/ui/Pre'
import TOCInline from 'pliny/ui/TOCInline'
import Image from './Image'
import CustomLink from './Link'
import LinkCard from './LinkCard'
import TableWrapper from './TableWrapper'
export const components: MDXComponents = {
  Image,
  TOCInline,
  a: ({ href, ...props }) => (
    <CustomLink href={href ?? `#${href}`} {...props} />
  ),
  pre: Pre,
  table: TableWrapper,
  LinkCard,
  BlogNewsletterForm,
  Mermaid,
}
