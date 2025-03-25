const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, isDarkMode }) => {
  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full w-64 z-30 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
      >
        // ...existing code...
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};
