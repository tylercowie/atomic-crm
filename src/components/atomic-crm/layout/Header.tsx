import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Settings, User } from "lucide-react";
import { CanAccess } from "ra-core";
import { useState } from "react";
import { Link, matchPath, useLocation } from "react-router";
import { RefreshButton } from "@/components/admin/refresh-button";
import { ThemeModeToggle } from "@/components/admin/theme-mode-toggle";
import { UserMenu } from "@/components/admin/user-menu";
import { useUserMenu } from "@/hooks/user-menu-context";
import { useIsMobile } from "@/hooks/use-mobile";

import { useConfigurationContext } from "../root/ConfigurationContext";

const Header = () => {
  const { darkModeLogo, lightModeLogo, title } = useConfigurationContext();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  let currentPath: string | boolean = "/";
  if (matchPath("/", location.pathname)) {
    currentPath = "/";
  } else if (matchPath("/contacts/*", location.pathname)) {
    currentPath = "/contacts";
  } else if (matchPath("/companies/*", location.pathname)) {
    currentPath = "/companies";
  } else if (matchPath("/deals/*", location.pathname)) {
    currentPath = "/deals";
  } else {
    currentPath = false;
  }

  return (
    <nav className="flex-grow">
      <header className="bg-secondary">
        <div className="px-4">
          <div className="flex justify-between items-center flex-1">
            <Link
              to="/"
              className="flex items-center gap-2 text-secondary-foreground no-underline"
            >
              <img
                className="[.light_&]:hidden h-6"
                src={darkModeLogo}
                alt={title}
              />
              <img
                className="[.dark_&]:hidden h-6"
                src={lightModeLogo}
                alt={title}
              />
              <h1 className="text-xl font-semibold hidden sm:block">{title}</h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <nav className="flex">
                <NavigationTab
                  label="Dashboard"
                  to="/"
                  isActive={currentPath === "/"}
                />
                <NavigationTab
                  label="Contacts"
                  to="/contacts"
                  isActive={currentPath === "/contacts"}
                />
                <NavigationTab
                  label="Companies"
                  to="/companies"
                  isActive={currentPath === "/companies"}
                />
                <NavigationTab
                  label="Deals"
                  to="/deals"
                  isActive={currentPath === "/deals"}
                />
              </nav>
            </div>

            <div className="flex items-center">
              <ThemeModeToggle />
              <RefreshButton />
              <UserMenu>
                <ConfigurationMenu />
                <CanAccess resource="sales" action="list">
                  <UsersMenu />
                </CanAccess>
              </UserMenu>

              {/* Mobile Navigation */}
              {isMobile && (
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-64">
                    <SheetHeader>
                      <SheetTitle>Navigation</SheetTitle>
                    </SheetHeader>
                    <nav className="flex flex-col gap-2 mt-4">
                      <MobileNavigationTab
                        label="Dashboard"
                        to="/"
                        isActive={currentPath === "/"}
                        onClick={() => setMobileMenuOpen(false)}
                      />
                      <MobileNavigationTab
                        label="Contacts"
                        to="/contacts"
                        isActive={currentPath === "/contacts"}
                        onClick={() => setMobileMenuOpen(false)}
                      />
                      <MobileNavigationTab
                        label="Companies"
                        to="/companies"
                        isActive={currentPath === "/companies"}
                        onClick={() => setMobileMenuOpen(false)}
                      />
                      <MobileNavigationTab
                        label="Deals"
                        to="/deals"
                        isActive={currentPath === "/deals"}
                        onClick={() => setMobileMenuOpen(false)}
                      />
                    </nav>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          </div>
        </div>
      </header>
    </nav>
  );
};

const NavigationTab = ({
  label,
  to,
  isActive,
}: {
  label: string;
  to: string;
  isActive: boolean;
}) => (
  <Link
    to={to}
    className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
      isActive
        ? "text-secondary-foreground border-secondary-foreground"
        : "text-secondary-foreground/70 border-transparent hover:text-secondary-foreground/80"
    }`}
  >
    {label}
  </Link>
);

const MobileNavigationTab = ({
  label,
  to,
  isActive,
  onClick,
}: {
  label: string;
  to: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <Link
    to={to}
    onClick={onClick}
    className={`px-4 py-3 text-sm font-medium transition-colors rounded-md ${
      isActive
        ? "bg-secondary text-secondary-foreground"
        : "text-foreground/70 hover:bg-muted hover:text-foreground"
    }`}
  >
    {label}
  </Link>
);

const UsersMenu = () => {
  const { onClose } = useUserMenu() ?? {};
  return (
    <DropdownMenuItem asChild onClick={onClose}>
      <Link to="/sales" className="flex items-center gap-2">
        <User /> Users
      </Link>
    </DropdownMenuItem>
  );
};

const ConfigurationMenu = () => {
  const { onClose } = useUserMenu() ?? {};
  return (
    <DropdownMenuItem asChild onClick={onClose}>
      <Link to="/settings" className="flex items-center gap-2">
        <Settings />
        My info
      </Link>
    </DropdownMenuItem>
  );
};
export default Header;
