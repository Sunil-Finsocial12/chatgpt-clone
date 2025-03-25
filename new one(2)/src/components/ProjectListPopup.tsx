import React, { useState, useEffect } from 'react';

interface Project {
  id: string;
  name: string;
  createdAt: Date;
  chats: Chat[];
  isEditing?: boolean;
}

interface Chat {
  id: string;
  title: string;
  createdAt: Date;
  messages: any[];
  isStarred?: boolean;
  projectId?: string;
}

interface ProjectListPopupProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onProjectSelect?: (project: Project) => void;
  onChatSelect: (chat: Chat) => void;
  onDeleteProject: (projectId: string, e: React.MouseEvent) => void;
  onDeleteProjectChat: (projectId: string, chatId: string, e: React.MouseEvent) => void;
  onEditProject: (projectId: string, newName: string) => void;
  onEditProjectStart: (projectId: string) => void;
  isDarkMode: boolean;
  onNewProjectChat: (projectId: string) => void;  // Add this line
}

const ProjectListPopup: React.FC<ProjectListPopupProps> = ({
  isOpen,
  onClose,
  projects,
  onProjectSelect,
  onChatSelect,
  onDeleteProject,
  onDeleteProjectChat,
  onEditProject,
  onEditProjectStart,
  isDarkMode,
  onNewProjectChat,  // Add this line
}) => {
  const [expandedProjects, setExpandedProjects] = useState<{ [key: string]: boolean }>({});
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    const timer = setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
    return () => clearTimeout(timer);
  };

  if (!isOpen && !isClosing) return null;

  const toggleProjectExpand = (projectId: string) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  return (
    <div 
      className={`fixed inset-0 z-[9000] flex items-center justify-center transition-all duration-200 ${
        isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className={`absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-200`} />
      <div 
        className={`relative w-[600px] h-[500px] rounded-2xl shadow-xl overflow-hidden flex flex-col transform transition-all duration-200 ${
          isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'
        } ${
          isClosing 
            ? 'scale-95 opacity-0' 
            : 'scale-100 opacity-100'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className="text-xl font-semibold">Projects</h2>
          <button
            onClick={handleClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Project List with stagger effect */}
        <div className="flex-1 overflow-y-auto">
          {projects.length > 0 ? (
            <div className="p-4 space-y-2">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className={`rounded-lg border transition-all duration-300 ${
                    isDarkMode 
                      ? 'border-gray-700 hover:bg-gray-700/50 text-gray-200' 
                      : 'border-gray-200 hover:bg-gray-50 text-gray-800'
                  } ${
                    isOpen 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-4 opacity-0'
                  }`}
                  style={{ 
                    transitionDelay: `${index * 50}ms`
                  }}
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center flex-1 min-w-0">
                      <button
                        onClick={() => toggleProjectExpand(project.id)}
                        className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                      >
                        <i className={`fas fa-chevron-right transform transition-transform ${
                          expandedProjects[project.id] ? 'rotate-90' : ''
                        }`}></i>
                      </button>
                      {project.isEditing ? (
                        <input
                          type="text"
                          defaultValue={project.name}
                          autoFocus
                          onBlur={(e) => onEditProject(project.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              onEditProject(project.id, e.currentTarget.value);
                            }
                          }}
                          className={`px-2 py-1 rounded flex-1 ${
                            isDarkMode 
                              ? 'bg-gray-600 text-gray-200' 
                              : 'bg-white text-gray-800'
                          }`}
                        />
                      ) : (
                        <span 
                          className="truncate flex-1"
                          onDoubleClick={() => onEditProjectStart(project.id)}
                        >
                          {project.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onNewProjectChat(project.id)}
                        className={`p-1.5 rounded-lg ${
                          isDarkMode 
                            ? 'hover:bg-gray-600 text-blue-400 hover:text-blue-300' 
                            : 'hover:bg-gray-200 text-blue-500 hover:text-blue-600'
                        }`}
                        title="New chat"
                      >
                        <i className="fas fa-plus-circle"></i>
                      </button>
                      <button
                        onClick={() => onEditProjectStart(project.id)}
                        className={`p-1.5 rounded-lg ${
                          isDarkMode 
                            ? 'hover:bg-gray-600' 
                            : 'hover:bg-gray-200'
                        }`}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={(e) => onDeleteProject(project.id, e)}
                        className={`p-1.5 rounded-lg ${
                          isDarkMode 
                            ? 'hover:bg-gray-600 text-red-400' 
                            : 'hover:bg-gray-200 text-red-500'
                        }`}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>

                  {/* Project Chats */}
                  {expandedProjects[project.id] && (
                    <div className={`p-4 ${
                      isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          {project.chats.length} {project.chats.length === 1 ? 'chat' : 'chats'}
                        </span>
                        <button
                          onClick={() => onNewProjectChat(project.id)}
                          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                            isDarkMode 
                              ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' 
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          }`}
                        >
                          <i className="fas fa-plus mr-1"></i>
                          New Chat
                        </button>
                      </div>
                      {project.chats.length > 0 ? (
                        <div className="space-y-2">
                          {project.chats.map(chat => (
                            <div
                              key={chat.id}
                              onClick={() => onChatSelect(chat)}
                              className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                                isDarkMode 
                                  ? 'hover:bg-gray-600 text-gray-200' 
                                  : 'hover:bg-white text-gray-800'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <i className={`fas fa-comment-alt ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}></i>
                                <span className="truncate">{chat.title}</span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteProjectChat(project.id, chat.id, e);
                                }}
                                className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-lg ${
                                  isDarkMode 
                                    ? 'hover:bg-gray-500 text-red-400' 
                                    : 'hover:bg-gray-100 text-red-500'
                                }`}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className={`text-center py-2 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          No chats in this project
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div 
              className={`h-full flex flex-col items-center justify-center p-8 text-center transition-all duration-300 ${
                isOpen 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-4 opacity-0'
              } ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              <div className={`mb-4 p-4 rounded-full ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <i className="fas fa-folder-open text-4xl text-gray-400"></i>
              </div>
              <p className={`text-lg font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                No Projects Yet
              </p>
              <p className={`text-sm max-w-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Create a new project to organize your chats and conversations
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectListPopup;
