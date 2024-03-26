import { createContext, useContext, useState, useEffect, Dispatch, SetStateAction, ReactNode } from 'react';

export type User = {
  id: string;
  name: string;
  email: string;
  bio : string;
  twitter : string;
  linkedin: string;
  github: string;
};

export interface UserContextInterface {
  userInfo: User;
  setUserInfo: Dispatch<SetStateAction<User>>;
}

const defaultState = {
  userInfo: {
    id: '',
    name: '',
    email: '',
    bio : '',
    twitter : '',
    linkedin: '',
    github: ''
  },
  setUserInfo: (userInfo: User) => {}
} as UserContextInterface;

export const UserContext = createContext(defaultState); // Default initial state

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userInfo, setUserInfo] = useState<User>({
    id: '',
    name: '',
    email: '',
    bio : '',
    twitter : '',
    linkedin: '',
    github: ''
  });

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};
