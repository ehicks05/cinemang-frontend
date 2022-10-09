import { FaCat } from 'react-icons/fa';

const Header = () => {
  return (
    <div className="mx-auto max-w-screen-lg">
      <div
        className="flex items-center gap-1 p-4 text-2xl"
        style={{ fontFamily: 'Urbanist' }}
      >
        Cinemang
        <FaCat className="inline text-green-500" />
      </div>
    </div>
  );
};

export default Header;
