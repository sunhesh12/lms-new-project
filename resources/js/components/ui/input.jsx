import * as React from "react"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      autoComplete='new-password'
      ref={ref}
      {...props} />
  );
})
Input.displayName = "Input"

export { Input }
