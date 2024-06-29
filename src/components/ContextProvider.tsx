import { SignUpFormValues } from "@/app/(auth)/signup/page";
import { ObjectId } from "mongodb";
import {
  Dispatch,
  FC,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type Props = {
  children: React.ReactNode;
};

export interface User extends SignUpFormValues {
  _id: ObjectId;
  location?: {
    type: string;
    coordinates: number[];
  };
  ratings: {
    rating: number;
    ratedBy: ObjectId;
  };
}

const GlobalContext = createContext<{
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  isLoaded: boolean;
  setIsLoaded: Dispatch<SetStateAction<boolean>>;
}>({
  user: null,
  setUser: () => {},
  isLoaded: false,
  setIsLoaded: () => {},
});

const ContextProvider: FC<Props> = (props: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        isLoaded,
        setIsLoaded,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

const useGlobalContext = () => useContext(GlobalContext);

export { ContextProvider, useGlobalContext };
