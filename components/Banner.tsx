'use client'

interface BannerProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export default function Banner({
  children,
  className = '',
  id = 'banner'
}: BannerProps) {
  return (
    <div
      id={id}
      className={`relative z-50 animate-[slideDown_0.5s_ease-out_0.5s_forwards] border-b-2 border-neutral-200 text-black shadow-xs ${className} `}
    >
      <div className="relative px-4 py-3 sm:px-6 lg:px-8">
        <button
          onClick={(e) => {
            const banner = e.currentTarget.closest('[id]') as HTMLElement
            if (banner) {
              banner.style.animation = 'slideUp 0.3s ease-in forwards'
              setTimeout(() => banner.remove(), 300)
            }
          }}
          className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full p-1 transition-colors hover:bg-white/20 focus:ring-2 focus:ring-black/50 focus:outline-none"
          aria-label="Close banner"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="ml-10 text-center sm:text-left">{children}</div>
      </div>
    </div>
  )
}
