import { User } from "@/dto/user/user.dto";

type UserAction =
  | { type: "SET_USER"; payload: User }
  | { type: "UPDATE_USER"; payload: Partial<User> }
  | { type: "CLEAR_USER" };

interface UserState {
  user: User | null;
}

export const initialUserState: UserState = {
  user: null,
};

export function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    // case "UPDATE_USER":
    //   return {
    //     ...state,
    //     user: state.user
    //       ? { ...state.user, ...action.payload }
    //       : action.payload,
    //   };
    case "CLEAR_USER":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}
