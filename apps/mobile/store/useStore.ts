import { create } from "zustand";

type UserState = Record<string, unknown>;

interface AppState {
	user: UserState | null;
	isLoading: boolean;
	setUser: (user: UserState | null) => void;
	setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
	user: null,
	isLoading: false,
	setUser: (user: UserState | null) => set({ user }),
	setLoading: (isLoading: boolean) => set({ isLoading }),
}));
