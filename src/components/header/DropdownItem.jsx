import { Link } from "react-router-dom";

export const DropdownItem = ({ icon, text, to, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
  >
    {icon}
    <span>{text}</span>
  </Link>
);
