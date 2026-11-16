import { getClaimsTokenPayload, isTokenExpired } from "@/common/util/jwtUtils";
import assertEnv from "@/config/env";
import { AuthState } from "@/models/interfaces/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: assertEnv.VITE_BACKEND_USER,
      userToken: assertEnv.VITE_USER_TOKEN_KEY,
      photo: "",
      roles: [],
      isHostAuthenticated: false,
      isGuestAuthenticated: false,
      identifier: "",
      checkAuth: () => {
        const token = get().userToken;
        const valid = !!token && !isTokenExpired(token);
        //if(!valid).get().logout();
        if (!valid) {
          get().logout();
          window.location.reload();
        }
        return valid;
      },
      login: (token, photo) => {
        const claims = getClaimsTokenPayload(token);
        if (claims) {
          set({
            user: claims.userName,
            userToken: token,
            photo: photo || claims.photo || "",
            roles:
              (Array.isArray(claims.roles) ? claims.roles : [claims.roles]) ||
              [],
            isHostAuthenticated: claims.isHost ?? false,
            isGuestAuthenticated: claims.isGuest ?? false,
            identifier: claims.identifier || "",
          });
        }
      },
      changeRole: (role) => {
        const authObj = get();
        let isHost: boolean = false;
        let isGuest: boolean = false;

        if (role == "host") isHost = true;
        else if (role == "guest") isGuest = true;

        set({
          ...authObj,
          isHostAuthenticated: isHost,
          isGuestAuthenticated: isGuest,
        });
      },
      logout: () => {
        set({
          user: assertEnv.VITE_BACKEND_USER,
          userToken: assertEnv.VITE_USER_TOKEN_KEY,
          photo: "",
          roles: [],
          isHostAuthenticated: false,
          isGuestAuthenticated: false,
          identifier: "",
        });
      },
    }),
    { name: "auth-store" }
  )
);
