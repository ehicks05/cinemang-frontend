import { FaCat } from "react-icons/all";

const Header = () => {
  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="flex items-center gap-1 p-4 text-2xl">
        Cinemang
        <FaCat className="inline text-green-500" />
      </div>
    </div>
  );
};

export default Header;
