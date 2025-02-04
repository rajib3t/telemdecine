import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/Components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Menu, User, Home, Settings, LogOut, Bell, LucideIcon, Users, ChevronDown, Building, Shield, List } from "lucide-react";
import { Link, usePage } from '@inertiajs/react';

interface MenuItem {
  icon: LucideIcon;
  label: string;
  href?: string;
  submenus?: MenuItem[];
}

interface NavItemProps extends MenuItem {
  depth?: number;
  isActive?: boolean;
  onItemClick: (href: string) => void;
}

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  brandName?: string;
  brandIcon?: LucideIcon;
  customMenuItems?: MenuItem[];
}

const defaultMenuItems: MenuItem[] = [
  {
    icon: Home,
    label: 'Dashboard',
    href: route('dashboard')
  },
  {
    icon: Users,
    label: 'User Management',
    submenus: [
        { icon: Users, label: 'All Users', href: route('user.index') },
        {
            icon: Shield,
            label: 'Roles',
            submenus:[
                { icon: List, label: 'List', href: route('role.index') },
            ]
        },
        {
            icon: Settings,
            label: 'Permissions',
            submenus:[
                { icon:List, label:'List', href : route('permission.index') }
            ]
        }
    ]
  },
  {
    icon: Building,
    label: 'Organization',
    submenus: [
      { icon: Building, label: 'Departments', href: '/departments' },
      { icon: Users, label: 'Teams', href: '/teams' }
    ]
  }
];

const ButtonContent: React.FC<{ icon: LucideIcon; label: string; isSubmenuOpen?: boolean }> = ({
  icon: Icon,
  label,
  isSubmenuOpen
}) => (
  <>
    <Icon className="h-4 w-4" />
    <span className="flex-1 text-left">{label}</span>
    {isSubmenuOpen !== undefined && (
      <ChevronDown
        className={`h-4 w-4 transition-transform duration-200
          ${isSubmenuOpen ? 'rotate-180' : ''}`}
      />
    )}
  </>
);


const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  href,
  submenus = [], // Provide default empty array
  depth = 0,
  isActive,
  onItemClick
}) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const hasSubmenus = submenus.length > 0;

  const handleClick = useCallback(() => {
    if (hasSubmenus) {
      setIsSubmenuOpen(prev => !prev);
    } else if (href) {
      onItemClick(href);
    }
  }, [hasSubmenus, href, onItemClick]);

  return (
    <div className="space-y-1">
      {href && !hasSubmenus ? (
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={`w-full justify-start gap-2 ${depth > 0 ? 'ml-4' : ''}`}
          asChild
        >
          <Link href={href} onClick={handleClick}>
            <ButtonContent icon={icon} label={label} />
          </Link>
        </Button>
      ) : (
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={`w-full justify-start gap-2 ${depth > 0 ? 'ml-4' : ''}
            ${hasSubmenus ? 'font-medium' : ''}`}
          onClick={handleClick}
        >
          <ButtonContent icon={icon} label={label} isSubmenuOpen={hasSubmenus ? isSubmenuOpen : undefined} />
        </Button>
      )}

      {hasSubmenus && (
        <div className={`overflow-hidden transition-all duration-200
          ${isSubmenuOpen ? 'max-h-96' : 'max-h-0'}`}
        >
          <div className="ml-4 space-y-1 pt-1">
            {submenus.map((submenu) => (
              <NavItem
                key={submenu.label}
                {...submenu}
                depth={depth + 1}
                isActive={isActive}
                onItemClick={onItemClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const NotificationBadge: React.FC<{ count: number }> = ({ count }) => (
  count > 0 ? (
    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
      {count > 99 ? '99+' : count}
    </span>
  ) : null
);

const UserMenu: React.FC = () => {
  const { user } = usePage().props.auth;
  const userInitials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" alt={user.name} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={route('profile.edit')} className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={route('logout')}
            method="post"
            as="button"
            className="flex w-full items-center text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
  brandName = 'MyApp',
  brandIcon: BrandIcon = Settings,
  customMenuItems
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string>(window.location.pathname);
  const [notificationCount, setNotificationCount] = useState(3);

  const menuItems = useMemo(() =>
    customMenuItems || defaultMenuItems,
    [customMenuItems]
  );

  const handleItemClick = useCallback((href: string) => {
    setActiveItem(href);
    setIsMobileMenuOpen(false);
  }, []);

  const NavigationContent = useCallback(() => (
    <nav className="flex-1 space-y-2 overflow-y-auto py-4">
      {menuItems.map((item) => (
        <NavItem
          key={item.label}
          {...item}
          isActive={activeItem === item.href}
          onItemClick={handleItemClick}
        />
      ))}
    </nav>
  ), [menuItems, activeItem, handleItemClick]);

  const BrandLogo = useCallback(() => (
    <Link href="/" className="flex items-center gap-2 font-semibold">
      <BrandIcon className="h-6 w-6" />
      {brandName}
    </Link>
  ), [brandName]);

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden h-screen w-64 border-r bg-background p-4 lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center px-2">
            <BrandLogo />
          </div>
          <NavigationContent />
          <div className="border-t pt-4">
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link href={route('profile.edit')}>
                <User className="h-4 w-4" />
                Profile
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center border-b px-6">
              <BrandLogo />
            </div>
            <div className="p-4">
              <NavigationContent />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-50 flex h-14 items-center border-b bg-background px-4">
          <div className="flex flex-1 items-center justify-end gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <NotificationBadge count={notificationCount} />
            </Button>
            <UserMenu />
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
