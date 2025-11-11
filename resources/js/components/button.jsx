import { forwardRef } from "react";
import { Link } from "@inertiajs/react";

import styles from "@/css/components/button.module.css"

const Button = forwardRef(({ className, variant, size, asChild = false, link, children, ...props }, ref) => {
  if(link) {
    return (
      <Link ref={ref} className={className + " " + styles.button} href={link}>
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