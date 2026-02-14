"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { Menu, ExternalLink, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface TopbarProps {
  businessName: string;
  slug: string;
  onMenuClick: () => void;
}

export function Topbar({ businessName, slug, onMenuClick }: TopbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 cursor-pointer"
        >
          <Menu size={20} className="text-gray-600" />
        </button>
        <h1 className="font-semibold text-gray-900 truncate">{businessName}</h1>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href={`/${slug}`}
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          Ver vitrine
          <ExternalLink size={14} />
        </Link>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm cursor-pointer"
          >
            {businessName.charAt(0)}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
              <Link
                href={`/${slug}`}
                target="_blank"
                className="sm:hidden flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setDropdownOpen(false)}
              >
                <ExternalLink size={16} />
                Ver vitrine
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
              >
                <LogOut size={16} />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
