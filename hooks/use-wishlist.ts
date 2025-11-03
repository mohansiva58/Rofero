import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface WishlistItem {
  id: number
  name: string
  price: number
  image: string
}

interface WishlistStore {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: number) => void
  isInWishlist: (id: number) => boolean
  toggleWishlist: (item: WishlistItem) => void
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: state.items.some((i) => i.id === item.id) ? state.items : [...state.items, item],
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      isInWishlist: (id) => get().items.some((item) => item.id === id),
      toggleWishlist: (item) => {
        const { isInWishlist, addItem, removeItem } = get()
        if (isInWishlist(item.id)) {
          removeItem(item.id)
        } else {
          addItem(item)
        }
      },
    }),
    {
      name: "wishlist-storage",
    },
  ),
)
