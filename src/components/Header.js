import { FaCat, GiCat } from "react-icons/all";

const Header = ({ title }) => {
  return (
    <div>
      {title}
      <FaCat />
      <GiCat />
    </div>
  );
};

export default Header;
