import React from "react";

interface UserAvatarProps {
  userName: string | null;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ userName }) => {
  const getInitial = (name: string | null) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return (
    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg">
      {getInitial(userName)}
    </div>
  );
};

export default UserAvatar;
