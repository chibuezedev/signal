import React, { useState } from "react";
import { Home, Video, Phone, BookOpen, Settings, Menu, X } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { icon: Home, text: "Translate Sign", href: "/translator" },
      { icon: Phone, text: "Join a Call", href: "/join-call" },
      { icon: Video, text: "Meetings", href: "#" },
    { icon: BookOpen, text: "Learn Signs", href: "/learn" },
    { icon: Settings, text: "Settings", href: "#" },
  ];

  return (
    <>
      {/* mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-purple-600 text-white lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-purple-700 text-white transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 z-40`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5">
            <h2 className="text-2xl font-bold">Signa!</h2>
          </div>
          <nav className="flex-grow">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="flex items-center px-5 py-3 text-white hover:bg-purple-600 transition-colors duration-200"
                  >
                    <item.icon size={20} className="mr-3" />
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-5">
            <p className="text-sm text-purple-300">&copy; 2024 Signal</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
