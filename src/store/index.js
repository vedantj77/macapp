import { create } from 'zustand';

const useMacbookStore = create((set) => ({
    color: '#f2f2f2', // Silver (default) - first in sequence
    setColor: (color) => set({ color }),

    scale: 0.08,
    setScale: (scale) => set({ scale }),

    texture: '/videos/feature-1.mp4',
    setTexture: (texture) => set({ texture }),


    reset: () => set({ color: '#f2f2f2', scale: 0.08, texture: '/videos/feature-1.mp4' }),
}))

export default useMacbookStore;