// src/store/cartStore.js
import { create } from "zustand";

export const useCart = create((set, get) => ({
  items: [], // {id, title, price, extras: [{name,price}]}
  addItem: (item) => {
    const exists = get().items.find(i => i._id === item.id);
    if (!exists) set({ items: [...get().items, item] });
  },
  addMany: (arr=[]) => {
    const map = new Map(get().items.map(i => [i._id, i]));
    arr.forEach(i => map.set(i._id, i));
    set({ items: Array.from(map.values()) });
  },
  removeItem: (id) => set({ items: get().items.filter(i => i._id !== id) }),
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((acc, it) => {
    const extras = (it.extras||[]).reduce((a,e)=>a + Number(e.price||0), 0);
    return acc + Number(it.price||0) + extras;
  }, 0),
}));
