import { useState, ReactNode } from "react";

interface CollapseProps {
  title: string;
  children: ReactNode;
  open: boolean;
}

const Collapse: React.FC<CollapseProps> = ({ title, children, open }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(open);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="w-full border rounded-md shadow-sm overflow-auto">
      <button
        onClick={toggleCollapse}
        className="w-full px-4 py-2 text-left flex items-center focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-t-md"
      >
        <svg
          className={`w-5 h-5 transform transition-transform duration-300 ${
            isCollapsed ? "rotate-0" : "rotate-180"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#808080"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
        <span className="ml-1 text-gray-900 text-sm">{title}</span>
      </button>

      <div
        className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
          isCollapsed ? "max-h-0" : ""
        }`}
      >
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Collapse;
