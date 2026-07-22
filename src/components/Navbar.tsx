import { useState } from 'react'
import { Link } from 'react-router-dom'

export const NAV_ITEMS = [
  { label: 'Our story', path: '/our-story' },
  { label: 'Collective', path: '/collective' },
  { label: 'Workshops', path: '/workshops' },
  { label: 'Programs', path: '/programs' },
  { label: 'Inquiries', path: '/inquiries' },
]

function NavLink({ label, path }: { label: string; path: string }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      to={path}
      className="text-[10px] sm:text-xs md:text-sm transition-colors duration-300 whitespace-nowrap"
      style={{ color: hovered ? '#E1E0CC' : 'rgba(225, 224, 204, 0.8)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </Link>
  )
}

export default function Navbar() {
  return (
    <nav className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
      <div className="bg-black rounded-b-2xl md:rounded-b-3xl px-4 py-2 md:px-8">
        <div className="flex items-center gap-3 sm:gap-6 md:gap-12 lg:gap-14">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.path} {...item} />
          ))}
        </div>
      </div>
    </nav>
  )
}
