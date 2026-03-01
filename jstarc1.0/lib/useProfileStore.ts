import { create } from 'zustand'

export type Profile = {
  id: string
  name: string
  belt: string
  role: string
  bio: string
  achievements: string[]
  certifications: string[]
  gallery: string[]
  social: { label: string; url: string }[]
  image: string
  facePos?: { x: number; y: number }
}

interface ProfileStore {
  activeId: string | null
  setActive: (id: string | null) => void
}

export const useProfileStore = create<ProfileStore>((set) => ({
  activeId: null,
  setActive: (id) => set({ activeId: id })
}))