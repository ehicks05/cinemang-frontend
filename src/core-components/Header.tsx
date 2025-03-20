import { Link } from '@tanstack/react-router';
import { FaCat } from 'react-icons/fa';

const activeClass = { className: 'font-bold' };

const Header = () => (
	<div className="mx-auto flex max-w-screen-lg items-center gap-4">
		<Link
			className="flex items-center gap-1 p-4 text-2xl"
			style={{ fontFamily: 'Urbanist' }}
			to="/films"
		>
			Cine
			<FaCat className="inline text-green-500" />
			Mang
		</Link>

		<Link
			to="/films"
			activeProps={activeClass}
			activeOptions={{ includeSearch: false }}
		>
			Movies
		</Link>
		<Link
			to="/tv"
			activeProps={activeClass}
			activeOptions={{ includeSearch: false }}
		>
			TV
		</Link>
	</div>
);

export default Header;
