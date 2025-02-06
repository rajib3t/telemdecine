import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@/Components/ui/button";
import { Link } from '@inertiajs/react';
import { ChevronDown, LucideIcon } from 'lucide-react';

interface MenuItem {
  icon: LucideIcon;
  label: string;
  href?: string;
  submenus?: MenuItem[];
  routeName?:string;
}

interface NavItemProps extends MenuItem {
  depth?: number;
  isActive?: boolean;
  onItemClick: (href: string) => void;
  currentPath?: string;
}

const ButtonContent: React.FC<{
  icon: LucideIcon;
  label: string;
  isSubmenuOpen?: boolean
}> = ({
  icon: Icon,
  label,
  isSubmenuOpen
}) => (
  <>
    <Icon className="h-4 w-4" />
    <span className="flex-1 text-left">{label}</span>
    {isSubmenuOpen !== undefined && (
      <ChevronDown
        className={`h-4 w-4 transition-transform duration-200 ${isSubmenuOpen ? 'rotate-180' : ''}`}
      />
    )}
  </>
);

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  href,
  submenus = [],
  depth = 0,
  isActive,
  onItemClick,
  currentPath = route().current(),
  routeName,
}) => {
  const hasSubmenus = submenus.length > 0;

  // Helper function to get route name from href
  const getRouteName = useCallback((url: string | undefined) => {
    if (!url) return '';
    try {
      // Extract route name from Laravel's route() function
      return route().has(url) ? url : '';
    } catch {
      return '';
    }
  }, []);

  // Check if current path matches this item or any of its submenus
  const isCurrentPathInSubmenus = useCallback((items: MenuItem[]): boolean => {
    return items.some(item => {
      const itemRouteName = getRouteName(item.routeName);
      console.log(itemRouteName);

      if (itemRouteName && itemRouteName === item.routeName) return true;
      if (item.submenus?.length) return isCurrentPathInSubmenus(item.submenus);
      return false;
    });
  }, [currentPath, getRouteName]);

  // Initialize submenu open state based on whether current path is in submenus
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(() => {
    return hasSubmenus && isCurrentPathInSubmenus(submenus);
  });

  // Update submenu open state when current path changes
  useEffect(() => {
    if (hasSubmenus) {
      const shouldBeOpen = isCurrentPathInSubmenus(submenus);
      setIsSubmenuOpen(shouldBeOpen);
    }
  }, [currentPath, hasSubmenus, submenus, isCurrentPathInSubmenus]);

  const handleClick = useCallback(() => {
    if (hasSubmenus) {
      setIsSubmenuOpen(prev => !prev);
    } else if (href) {
      onItemClick(href);
    }
  }, [hasSubmenus, href, onItemClick]);

  const currentRouteName = getRouteName(href);
  const isItemActive = (currentRouteName && currentRouteName === routeName) ||
    (hasSubmenus && isCurrentPathInSubmenus(submenus));

  return (
    <div className="space-y-1">
      {href && !hasSubmenus ? (
        <Button
          variant={isItemActive ? "secondary" : "ghost"}
          className={`w-full justify-start gap-2 ${depth > 0 ? 'ml-4' : ''}`}
          asChild
        >
          <Link href={href} onClick={handleClick}>
            <ButtonContent icon={icon} label={label} />
          </Link>
        </Button>
      ) : (
        <Button
          variant={isItemActive ? "secondary" : "ghost"}
          className={`w-full justify-start gap-2 ${depth > 0 ? 'ml-4' : ''} ${hasSubmenus ? 'font-medium' : ''}`}
          onClick={handleClick}
        >
          <ButtonContent
            icon={icon}
            label={label}
            isSubmenuOpen={hasSubmenus ? isSubmenuOpen : undefined}
          />
        </Button>
      )}

      {hasSubmenus && (
        <div className={`overflow-hidden transition-all duration-200 ${isSubmenuOpen ? 'max-h-96' : 'max-h-0'}`}>
          <div className="ml-4 space-y-1 pt-1">
            {submenus.map((submenu) => (
              <NavItem
                key={submenu.label}
                {...submenu}
                depth={depth + 1}
                currentPath={currentPath}
                onItemClick={onItemClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavItem;
