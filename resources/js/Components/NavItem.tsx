import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@/Components/ui/button";
import { Link } from '@inertiajs/react';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

interface MenuItem {
  icon: LucideIcon;
  label: string;
  href?: string;
  submenus?: MenuItem[];
  routeName?: string[];
}

interface NavItemProps extends MenuItem {
  depth?: number;
  isActive?: boolean;
  onItemClick: (href: string) => void;
  currentPath?: string;
}

interface ButtonContentProps {
  icon: LucideIcon;
  label: string;
  isSubmenuOpen?: boolean;
}

const ButtonContent: React.FC<ButtonContentProps> = ({
  icon: Icon,
  label,
  isSubmenuOpen
}) => (
  <>
    <Icon className="h-4 w-4" />
    <span className="flex-1 text-left">{label}</span>
    {isSubmenuOpen !== undefined && (
      <ChevronDown
        className={cn(
          "h-4 w-4 transition-transform duration-200",
          isSubmenuOpen && "rotate-180"
        )}
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
  onItemClick,
  currentPath,
  routeName = [],
}) => {
  const hasSubmenus = submenus.length > 0;

  const isRouteActive = useCallback((routeNames: string[] | undefined): boolean => {
    if (!routeNames?.length) return false;
    return routeNames.some(name => route().current(name));
  }, []);

  const isCurrentPathInSubmenus = useCallback((items: MenuItem[]): boolean => {
    return items.some(item => {
      if (isRouteActive(item.routeName)) return true;
      if (item.submenus?.length) return isCurrentPathInSubmenus(item.submenus);
      return false;
    });
  }, [isRouteActive]);

  const [isSubmenuOpen, setIsSubmenuOpen] = useState(() =>
    hasSubmenus && isCurrentPathInSubmenus(submenus)
  );

  useEffect(() => {
    if (hasSubmenus) {
      setIsSubmenuOpen(isCurrentPathInSubmenus(submenus));
    }
  }, [currentPath, hasSubmenus, submenus, isCurrentPathInSubmenus]);

  const handleClick = useCallback(() => {
    if (hasSubmenus) {
      setIsSubmenuOpen(prev => !prev);
    } else if (href) {
      onItemClick(href);
    }
  }, [hasSubmenus, href, onItemClick]);

  const isItemActive = isRouteActive(routeName) ||
    (hasSubmenus && isCurrentPathInSubmenus(submenus));

  const buttonClassName = cn(
    "w-full justify-start gap-2",
    depth > 0 && "ml-4",
    hasSubmenus && "font-medium"
  );

  return (
    <div className="space-y-1">
      {href && !hasSubmenus ? (
        <Button
          variant={isItemActive ? "secondary" : "ghost"}
          className={buttonClassName}
          asChild
        >
          <Link href={href} onClick={handleClick}>
            <ButtonContent icon={icon} label={label} />
          </Link>
        </Button>
      ) : (
        <Button
          variant={isItemActive ? "secondary" : "ghost"}
          className={buttonClassName}
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
        <div
          className={cn(
            "overflow-hidden transition-all duration-200",
            isSubmenuOpen ? "max-h-96" : "max-h-0"
          )}
        >
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
