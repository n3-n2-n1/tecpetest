import { useState } from "react";
import Button from "../components/Buttons/Button";
import InnerChatbox from "../components/Box/InnerChatbox";

const Home = () => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <div className="containerMain">
        <div onClick={toggleVisibility}>
          <Button />
        </div>
        {isVisible && (
          <div className="fixed bottom-[calc(4rem+1.5rem)] right-0 mr-2 p-4 pb-0 w-[440px] h-[634px]">
            <InnerChatbox />
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
