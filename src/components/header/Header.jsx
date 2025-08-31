import React from "react";
import { FaSearch } from "react-icons/fa";
import { GoTriangleDown } from "react-icons/go";
import { IoNotificationsCircle } from "react-icons/io5";

function Header() {
  return (
    <div className="flex justify-between shadow-md bg-white p-3 w-100vh">
      <img src="./image/Logo.png" alt="" style={{ height: "40px" }} />
      <div className="box flex items-center gap-3 text-blue-500">
        <FaSearch size={20} />
        <IoNotificationsCircle size={24} />
        <p>Phản hồi</p>
        <div className="flex items-center gap-1">
          <p className="text-blue-500">Ducan</p>
          <div className="img-box">
            <img
              src="./image/Avar.png"
              alt="avartar"
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
        <GoTriangleDown size={16} />
      </div>
    </div>
  );
}

export default Header;
