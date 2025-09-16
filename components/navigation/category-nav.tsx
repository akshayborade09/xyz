"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { MenuBar } from "@/components/ui/glow-menu"
import { categoryItems } from "@/lib/navigation-data"

export function CategoryNav() {
  const pathname = usePathname()
  const [activeItem, setActiveItem] = useState<string>("")

  useEffect(() => {
    // Extract the first segment of the path
    const segment = pathname.split("/")[1]

    // Find the matching category by checking items within categories
    for (const category of categoryItems) {
      const matchedItem = category.items.find((item) => item.href === `/${segment}`)
      if (matchedItem) {
        setActiveItem(matchedItem.title)
        return
      }
    }
  }, [pathname])

  const handleItemClick = (label: string) => {
    setActiveItem(label)
    // Navigation will happen through the Link component
  }

  // Transform categoryItems to MenuItem format
  const menuItems = categoryItems.flatMap(category => 
    category.items.map(item => ({
      icon: item.icon,
      label: item.title,
      href: item.href,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      iconColor: "text-blue-500"
    }))
  )

  return (
    <div className="w-full flex justify-center py-2">
      <MenuBar
        items={menuItems}
        activeItem={activeItem}
        onItemClick={handleItemClick}
        className="mx-auto"
      />
    </div>
  )
}
