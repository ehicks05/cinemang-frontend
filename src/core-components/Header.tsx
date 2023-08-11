import { FaCat } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = () => (
  <div className="mx-auto flex max-w-screen-lg items-center gap-4">
    <Link
      className="flex items-center gap-1 p-4 text-2xl"
      style={{ fontFamily: 'Urbanist' }}
      to="/"
    >
      Cine
      <FaCat className="inline text-green-500" />
      Mang
    </Link>
    <Link to="/">Movies</Link>
    <Link to="/tv">Shows</Link>
  </div>
);

export default Header;
