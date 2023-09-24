import { FaCat } from 'react-icons/fa';
import { Link, NavLink } from 'react-router-dom';

const isActiveClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'font-bold' : '';

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
    <NavLink className={isActiveClass} to="/">
      Movies
    </NavLink>
    <NavLink className={isActiveClass} to="/tv">
      TV
    </NavLink>
  </div>
);

export default Header;
