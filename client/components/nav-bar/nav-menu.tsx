import { cn } from "@/lib/utils";
import { Menu, MenuBar, MenuItem, MenuItemContainer } from "../ui/menu";
import { NavMenuLink } from "./nav-menu-link";


export default function NavMenu() {
  return (
    <div className="hidden md:flex items-center h-full">
        <NavMenuLink href="/" ariaLabel="Home page">
            <span>Home</span>
        </NavMenuLink>
        <NavMenuLink href="/shop" ariaLabel="Shop page">
            <span>Shop</span>
        </NavMenuLink>
        <NavMenuLink href="/reviews" ariaLabel="Reviews page">
            <span>Reviews</span>
        </NavMenuLink>
        <NavMenuLink href="/about" ariaLabel="About page">
            <span>About</span>
        </NavMenuLink>
        <NavMenuLink href="/contact" ariaLabel="Contact page">
            <span>Contact</span>
        </NavMenuLink>
    </div>
  )
}
