import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, LocalizedString, SanityImage } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Computed
  getTotalItems: () => number;
  getSubtotal: () => number;
}

function generateCartItemId(item: Omit<CartItem, "id">): string {
  return `${item.productId}-${item.width}x${item.height}x${item.thickness}-${item.isCustomSize ? "custom" : "standard"}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const id = generateCartItemId(item);
        const existingItem = get().items.find((i) => i.id === id);

        if (existingItem) {
          set({
            items: get().items.map((i) =>
              i.id === id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({
            items: [...get().items, { ...item, id }],
          });
        }

        // Open cart drawer when adding
        set({ isOpen: true });
      },

      removeItem: (id) => {
        set({
          items: get().items.filter((i) => i.id !== id),
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.unitPrice * item.quantity,
          0
        );
      },
    }),
    {
      name: "hout-shop-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
