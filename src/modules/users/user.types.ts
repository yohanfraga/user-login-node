export type UserResponse = {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
  };
  
  export type CreateUserRequest = {
    name: string;
    email: string;
    password: string;
  };