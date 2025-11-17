export interface Breadcrumb {
  href: string
  title: string
}

export function generateBreadcrumbs(pathname: string): Breadcrumb[] {
  // Skip empty segments and get path parts
  const paths = pathname.split("/").filter(Boolean)

  // Create breadcrumb items
  const breadcrumbs: Breadcrumb[] = []

  // Add home/dashboard as first breadcrumb if not already in path
  if (paths.length > 0 && paths[0] !== "dashboard") {
    breadcrumbs.push({
      href: "/dashboard",
      title: "Home",
    })
  }

  // Special cases for capitalization
  const specialCases: { [key: string]: string } = {
    "vms": "VMs",
    "cpu": "CPU",
    "gpu": "GPU",
    "tpu": "TPU",
    "hpc": "HPC",
    "ai": "AI",
    "api": "API",
    "iam": "IAM",
    "vpc": "VPC",
    "static-ips": "Static IP Addresses",
    "certificates": "Certificate Manager",
    "load-balancing": "Load Balancers",
    "auto-scaling": "Auto Scaling Groups",
    "database": "Databases",
  }

  // Build the rest of the breadcrumbs
  paths.forEach((path, index) => {
    // Build the href for this breadcrumb
    const href = `/${paths.slice(0, index + 1).join("/")}`

    // Format the title (convert kebab-case to Title Case with special cases)
    let title: string

    // Check if the entire path segment is a special case first
    if (specialCases[path.toLowerCase()]) {
      title = specialCases[path.toLowerCase()]
    } else {
      // Otherwise, convert kebab-case to Title Case with word-level special cases
      title = path
        .split("-")
        .map((word) => {
          // Check if the word is a special case
          const lowerWord = word.toLowerCase()
          if (specialCases[lowerWord]) {
            return specialCases[lowerWord]
          }
          // Otherwise, convert to Title Case
          return word.charAt(0).toUpperCase() + word.slice(1)
        })
        .join(" ")
    }

    breadcrumbs.push({ href, title })
  })

  return breadcrumbs
}
