"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Bell, HelpCircle } from "lucide-react"
import { MenuBar } from "@/components/ui/glow-menu"
import { KrutrimLogo } from "@/components/ui/krutrim-logo"
import { UserMenu } from "@/components/navigation/user-menu"
import { topNavItems } from "@/lib/navigation-data"
import { RegionSelector } from "@/components/navigation/region-selector"

export function TopNav() {
  const pathname = usePathname()
  const [activeItem, setActiveItem] = useState<string>("")

  useEffect(() => {
    // Extract the first segment of the path
    const segment = pathname.split("/")[1]

    if (segment === "") {
      setActiveItem("Home")
    } else {
      // Find the matching nav item by checking items within categories
      for (const category of topNavItems) {
        const matchedItem = category.items.find((item) => item.href === `/${segment}`)
        if (matchedItem) {
          setActiveItem(matchedItem.title)
          return
        }
      }
    }
  }, [pathname])

  const handleItemClick = (label: string) => {
    setActiveItem(label)
    // Navigation will happen through the Link component
  }

  return (
    <div className="w-full flex items-center justify-between px-4 py-2 border-b">
      <Link href="/" className="flex items-center gap-2">
        <KrutrimLogo className="h-8 w-8" />
        <span className="font-bold text-xl">Krutrim Cloud</span>
      </Link>

      <div className="flex-1 flex justify-center">
        <MenuBar
          items={topNavItems.flatMap(category => 
            category.items.map(item => ({
              icon: item.icon,
              label: item.title,
              href: item.href,
              gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              iconColor: "text-blue-500"
            }))
          )}
          activeItem={activeItem}
          onItemClick={handleItemClick}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm font-bold">₹5,000 credits</div>
        <RegionSelector />
        <button className="flex items-center justify-center rounded-full w-8 h-8 border-0 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </button>
        <button className="flex items-center justify-center rounded-full w-8 h-8 border-0 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">Help</span>
        </button>
        <UserMenu />
      </div>
    </div>
  )
}
