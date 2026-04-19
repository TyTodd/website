"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

type NavButtonProps = {
  href: string;
  children: ReactNode;
  ariaLabel?: string;
  isIconOnly?: boolean;
};

export function NavButton({
  href,
  children,
  ariaLabel,
  isIconOnly,
}: NavButtonProps) {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      size="sm"
      isIconOnly={isIconOnly}
      aria-label={ariaLabel}
      onPress={() => router.push(href)}
    >
      {children}
    </Button>
  );
}
