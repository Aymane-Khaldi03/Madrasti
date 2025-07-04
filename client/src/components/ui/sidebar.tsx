import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft, GraduationCap, User, LogOut, BookOpen, Calendar, FileText, Bell, Settings, Shield, Users } from "lucide-react"
import { useLocation } from "wouter"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAuth } from "@/contexts/AuthContext"
import { getAllMenu } from "./SidebarNav"
import { useLanguage } from "@/contexts/LanguageContext"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "17rem" // Increased for more space
const SIDEBAR_WIDTH_MOBILE = "19rem" // Slightly larger for mobile
const SIDEBAR_WIDTH_ICON = "5.2rem" // 83.2px, more space for icon + left padding
const SIDEBAR_KEYBOARD_SHORTCUT = "b"
const SIDEBAR_GRADIENT = "bg-gradient-to-b from-blue-900 via-blue-800 to-purple-900"

type SidebarContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    // Contrôle de l'overlay mobile
    React.useEffect(() => {
      if (isMobile && openMobile) {
        // Rendre l'overlay totalement transparent
        const overlay = document.querySelector('[data-radix-portal] [data-radix-overlay]');
        if (overlay) {
          overlay.setAttribute('style', 'background: transparent !important; backdrop-filter: none !important;');
        }
      }
    }, [isMobile, openMobile]);

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo<SidebarContextProps>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

// Adapter SidebarLinks pour accepter { to, icon, label, role }
interface SidebarLink {
  to: string;
  icon: JSX.Element;
  label: string;
  role: string;
}
interface SidebarLinksProps {
  links: SidebarLink[];
  currentPath: string;
  onLinkClick?: (e: React.MouseEvent<HTMLAnchorElement> | React.TouchEvent<HTMLAnchorElement>, href: string) => void;
}
function SidebarLinks({ links, currentPath, onLinkClick }: SidebarLinksProps) {
  return (
    <nav className="flex-1 flex flex-col gap-2">
      {links.map((link) => (
        <a
          key={link.to}
          href={link.to}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95 cursor-pointer",
            currentPath === link.to 
              ? "bg-blue-200 dark:bg-blue-800 border-l-4 border-blue-500 dark:border-blue-300 text-blue-900 dark:text-blue-100 shadow-md" 
              : "hover:bg-blue-100 dark:hover:bg-blue-800 hover:shadow-sm text-blue-800 dark:text-blue-200"
          )}
          aria-label={typeof link.label === 'string' ? link.label : undefined}
          tabIndex={0}
          onMouseDown={onLinkClick ? (e) => { e.preventDefault(); e.stopPropagation(); } : undefined}
          onClick={onLinkClick ? (e) => onLinkClick(e, link.to) : undefined}
          onTouchEnd={onLinkClick ? (e) => onLinkClick(e, link.to) : undefined}
        >
          <div className="flex-shrink-0">{link.icon}</div>
          <span className="transition-all duration-300">{link.label}</span>
        </a>
      ))}
    </nav>
  );
}

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
    collapsed?: boolean
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      collapsed = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Use only the context state for mobile sidebar
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
    const { user, signOut } = useAuth();
    const { t } = useLanguage();
    const role = user?.role || 'student';
    const links: SidebarLink[] = getAllMenu(t).filter((item: SidebarLink) => item.role === role);
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const [, navigate] = useLocation();

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            `${SIDEBAR_GRADIENT} flex h-full w-[--sidebar-width] flex-col text-sidebar-foreground shadow-2xl rounded-r-3xl py-6 px-3 border-r border-blue-950/30 transition-all duration-500`,
            className
          )}
          ref={ref}
          {...props}
          style={{ transition: 'width 0.4s cubic-bezier(.4,2,.6,1)', ...props.style }}
        >
          {/* Profil en haut */}
          <div className="flex flex-col items-center mb-8 transition-all duration-500">
            <div className="w-16 h-16 rounded-full bg-blue-200 dark:bg-blue-900 flex items-center justify-center mb-2">
              <User className="w-8 h-8 text-blue-700 dark:text-blue-200" />
            </div>
            <div className="font-bold text-lg text-blue-900 dark:text-blue-100">{user?.name || 'Utilisateur'}</div>
            <div className="text-xs text-blue-600 dark:text-blue-300 font-semibold">{role.charAt(0).toUpperCase() + role.slice(1)}</div>
          </div>
          {/* Liens dynamiques mutualisés */}
          <SidebarLinks links={links} currentPath={currentPath} />
          {/* Déconnexion en bas */}
          <div className="mt-8">
            <button
              className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 font-semibold shadow hover:bg-red-200 dark:hover:bg-red-800 transition focus:outline-none focus:ring-2 focus:ring-red-400"
              onClick={signOut}
              aria-label="Déconnexion"
            >
              <LogOut className="w-5 h-5" /> Déconnexion
            </button>
          </div>
        </div>
      );
    }

    if (isMobile) {
      // Handler pour la navigation mobile (ferme la sidebar avant navigation)
      const handleMobileNav = (e: React.MouseEvent<HTMLAnchorElement> | React.TouchEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        e.stopPropagation();
        setOpenMobile(false);
        setTimeout(() => {
          navigate(href);
        }, 200);
      };
      return (
        <Sheet
          open={openMobile}
          onOpenChange={setOpenMobile}
          {...props}
        >
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="z-50 w-full max-w-xs sm:max-w-sm bg-sidebar p-0 text-sidebar-foreground rounded-tr-3xl rounded-br-3xl shadow-inner shadow-2xl transition-transform duration-500 ease-in-out !left-0 border-0"
            style={{
              top: '4rem',
              height: 'calc(100vh - 4rem)',
              '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
              ...props.style,
            } as React.CSSProperties}
            side={side}
            tabIndex={0}
            aria-modal="true"
            aria-label="Menu latéral mobile"
            onPointerDownOutside={(e) => {
              e.preventDefault();
              setOpenMobile(false);
            }}
            onEscapeKeyDown={() => setOpenMobile(false)}
          >
            {/* Navigation mutualisée, identique desktop, strictement selon allMenu */}
            <div className="flex-1 flex flex-col overflow-y-auto p-4">
              <SidebarLinks links={links} currentPath={currentPath} onLinkClick={handleMobileNav} />
              {/* Déconnexion */}
              <div className="mt-6 pt-4 border-t border-blue-200 dark:border-blue-800">
                <button
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 font-semibold shadow hover:bg-red-200 dark:hover:bg-red-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 active:scale-95 cursor-pointer"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpenMobile(false);
                    setTimeout(() => {
                      signOut();
                    }, 200);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpenMobile(false);
                    setTimeout(() => {
                      signOut();
                    }, 200);
                  }}
                  aria-label="Déconnexion"
                >
                  <LogOut className="w-5 h-5" /> 
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )
    }

    // Desktop: dynamic width logic
    const isIcon = state === "collapsed" && collapsible === "icon";
    const isCollapsed = state === "collapsed" && collapsible !== "icon";
    return (
      <div
        ref={ref}
        className={cn(
          "group peer text-sidebar-foreground md:block h-full transition-all duration-500",
          isCollapsed ? "w-0 min-w-0 overflow-hidden" : isIcon ? "w-[4.5rem] min-w-0" : "w-[16rem] min-w-0",
          className
        )}
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
        style={{ transition: 'width 0.4s cubic-bezier(.4,2,.6,1)', ...props.style }}
        {...props}
      >
        {/* Only render children if not fully collapsed */}
        {!isCollapsed && (
          <div className="h-full flex flex-col bg-sidebar shadow-2xl rounded-r-3xl py-6 px-3 border-r border-blue-950/30 transition-all duration-500">
            {children}
          </div>
        )}
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

// SidebarTrigger: modern, floating, circular button with hamburger icon
export const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { toggleSidebar, state, isMobile } = useSidebar();
    return (
      <button
        ref={ref}
        type="button"
        aria-label="Toggle sidebar"
        onClick={toggleSidebar}
        className={cn(
          // Push up into header, responsive for mobile/desktop, never overlaps text
          "fixed top-1.5 left-2 md:left-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 dark:bg-blue-950/80 shadow-lg border border-blue-200 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900 transition-all duration-300",
          className
        )}
        style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)' }}
      >
        <span className="sr-only">Toggle sidebar</span>
        <svg
          className="h-7 w-7 text-blue-900 dark:text-blue-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    );
  }
);
SidebarTrigger.displayName = "SidebarTrigger"

// SidebarRail: a11y-friendly, always-visible rail for sidebar toggle
const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = "SidebarRail"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  const { state, isMobile } = useSidebar();
  return (
    <main
      ref={ref}
      data-sidebar="inset"
      className={cn(
        // Remove all forced margins, let content stretch
        "flex flex-col flex-1 min-w-0 w-full max-w-full overflow-y-auto bg-gray-50/5 dark:bg-gray-950/10 transition-all duration-500",
        isMobile
          ? "px-2 py-2 sm:px-4 sm:py-4"
          : "px-4 py-4 sm:px-8 sm:py-8",
        className
      )}
      {...props}
    />
  );
});
SidebarInset.displayName = "SidebarInset";



const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      )}
      {...props}
    />
  )
})
SidebarInput.displayName = "SidebarInput"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupAction.displayName = "SidebarGroupAction"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn("w-full text-sm", className)}
    {...props}
  />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// SidebarMenuButton: responsive icon size and sidebar width (smaller, dynamic)
const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { isMobile, state } = useSidebar()

    // Responsive icon size and sidebar width for all screens
    let iconSize = '1.5rem';
    let sidebarWidth = 'w-[5.2rem] min-w-[83.2px]';
    if (isMobile) {
      iconSize = '1.1rem';
      sidebarWidth = 'w-[4.2rem] min-w-[67.2px]';
    } else if (window.innerWidth < 640) {
      iconSize = '1.15rem';
      sidebarWidth = 'w-[4.5rem] min-w-[72px]';
    } else if (window.innerWidth < 1024) {
      iconSize = '1.2rem';
      sidebarWidth = 'w-[5rem] min-w-[80px]';
    }

    // Push icon to the absolute left in collapsed mode
    const collapsedClasses = state === 'collapsed'
      ? `bg-white dark:bg-blue-950 h-[3.5rem] min-h-[56px] flex items-center justify-start p-0 text-blue-700 dark:text-blue-100 ${sidebarWidth} !pl-0 !ml-0` // <-- force no left padding/margin
      : '';

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(
          sidebarMenuButtonVariants({ variant, size }),
          className,
          isActive && 'scale-110 text-primary animate-pulse',
          collapsedClasses,
          state === 'collapsed' && '!text-blue-700 dark:!text-blue-100',
          state === 'collapsed' && '!justify-start !items-center !pl-0 !ml-0 !w-full !min-w-0 !gap-0' // force full width, no gap, no padding
        )}
        style={state === 'collapsed' ? { fontSize: iconSize, justifyContent: 'flex-start', textAlign: 'left', paddingLeft: 0, marginLeft: 0, width: '100%', minWidth: 0, gap: 0 } : {}}
        {...props}
      >
        {/* Icon always absolutely left-aligned in collapsed mode */}
        {state === 'collapsed' ? (
          <span className="flex items-center ml-0 mr-0 pl-0 w-full justify-start !justify-start !ml-0 !pl-0 !mr-0">
            {/* Only render the first child (icon) in collapsed mode */}
            {Array.isArray(children) ? children[0] : children}
          </span>
        ) : (
          children
        )}
      </Comp>
    )

    if (!tooltip) {
      return button
    }

    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      }
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    showOnHover?: boolean
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
        "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuAction.displayName = "SidebarMenuAction"

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground",
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      "peer-data-[size=sm]/menu-button:top-1",
      "peer-data-[size=default]/menu-button:top-1.5",
      "peer-data-[size=lg]/menu-button:top-2.5",
      "group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
))
SidebarMenuBadge.displayName = "SidebarMenuBadge"

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showIcon?: boolean
  }
>(({ className, showIcon = false, ...props }, ref) => {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 max-w-[--skeleton-width] flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
})
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
      "group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
))
SidebarMenuSub.displayName = "SidebarMenuSub"

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ ...props }, ref) => <li ref={ref} {...props} />)
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean
    size?: "sm" | "md"
    isActive?: boolean
  }
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
}
