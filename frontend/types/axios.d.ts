import "axios";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry: boolean;
  }
}

// declare module "express-session" {
//   interface SessionData {
//     user?: {
//       _id: mongoose.Types.ObjectId;
//       email: string;
//       role: "visitor" | "member" | "admin" | "manager" | "technician";
//     };
//   }
// }
