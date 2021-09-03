import React, { useState } from "react";
import AuthDialog from "./AuthDialog";
import useUser from "../useUser";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, username } = useUser();

  return <div>yo</div>;
};

export default Home;
