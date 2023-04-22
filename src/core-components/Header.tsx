import { FaCat } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = () => (
  <div className="mx-auto max-w-screen-lg">
    <Link
      className="flex items-center gap-1 p-4 text-2xl"
      style={{ fontFamily: 'Urbanist' }}
      to="/"
    >
      Cine
      <FaCat className="inline text-green-500" />
      Mang
    </Link>
  </div>
);

export default Header;
