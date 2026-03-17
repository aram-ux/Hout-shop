"use client";

import { Share2, Facebook, MessageCircle } from "lucide-react";
import { useState } from "react";

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  imageUrl?: string;
}

export default function SocialShare({ url, title, description }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description || "");

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: "hover:text-[#25D366]",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:text-[#1877F2]",
    },
    {
      name: "Pinterest",
      // Using a simple pin SVG inline since lucide doesn't have Pinterest
      icon: null,
      href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedDesc}`,
      color: "hover:text-[#E60023]",
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: do nothing
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-oak-500 mr-1">Delen:</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-9 h-9 rounded-lg border border-oak-200 flex items-center justify-center text-oak-400 transition-colors ${link.color} hover:border-oak-300`}
          aria-label={`Deel via ${link.name}`}
          title={link.name}
        >
          {link.icon ? (
            <link.icon className="w-4 h-4" />
          ) : (
            // Pinterest icon
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
            </svg>
          )}
        </a>
      ))}
      <button
        onClick={handleCopyLink}
        className="w-9 h-9 rounded-lg border border-oak-200 flex items-center justify-center text-oak-400 transition-colors hover:text-oak-600 hover:border-oak-300"
        aria-label="Kopieer link"
        title={copied ? "Gekopieerd!" : "Kopieer link"}
      >
        <Share2 className="w-4 h-4" />
      </button>
      {copied && (
        <span className="text-xs text-forest animate-pulse">Gekopieerd!</span>
      )}
    </div>
  );
}
