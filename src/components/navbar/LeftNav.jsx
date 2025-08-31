import React from "react";
import { FaBook } from "react-icons/fa";
import { GrScorecard } from "react-icons/gr";
import { IoMdHome } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
import { MdHistoryEdu } from "react-icons/md";
import { SlCalender } from "react-icons/sl";

function LeftNav() {
  return (
    <div className=" w-1/6">
      <div className="nav flex flex-col p-5 gap-7 text-base">
        <div className="item flex">
          <IoMdHome size={22} className="mr-2" /> Trang chủ
        </div>
        <div className="item flex">
          <GrScorecard size={22} className="mr-2" /> Điểm số
        </div>
        <div className="item flex">
          <SlCalender size={22} className="mr-2" /> Lịch làm bài
        </div>
        <div className="item flex">
          <IoSettings size={22} className="mr-2" />
          Cài đặt
        </div>
      </div>
      <hr className="text-gray-400" />
      <div className="flex flex-col p-5 gap-7 text-base">
        <div className="item flex">
          <FaBook size={22} className="mr-2" /> [253] Thực tập nghề nghiệp
          (MIS2012_48K14_TTNN1) 1
        </div>
      </div>
    </div>
  );
}

export default LeftNav;
