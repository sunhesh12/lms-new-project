import { forwardRef } from "react";
import { Link } from "@inertiajs/react";

import styles from "@/css/components/button.module.css"

const Button = forwardRef(({ className, variant, size, asChild = false, href, children, ...props }, ref) => {
  if(href) {
    return (
      <Link ref={ref} className={className + " " + styles.button} href={href}>
        {children}
      </Link>
    )
  }
  
  return (
    <button ref={ref} className={className + " " + styles.button}>
      {children}
    </button>
  );
})
Button.displayName = "Button"

export default Button;