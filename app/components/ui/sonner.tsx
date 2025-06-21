"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-[#171719] group-[.toaster]:border-[#171719] group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-[#B5B5B3]",
          actionButton:
            "group-[.toast]:bg-[#171719] group-[.toast]:text-[#F1F1F1]",
          cancelButton:
            "group-[.toast]:bg-[#F1F1F1] group-[.toast]:text-[#171719]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster } 