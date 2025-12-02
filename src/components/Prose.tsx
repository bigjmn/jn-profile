import clsx from 'clsx'

export function Prose({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={clsx(
        className,
        'prose prose-zinc max-w-none dark:prose-invert',
      )}
      {...props}
    />
  )
}
