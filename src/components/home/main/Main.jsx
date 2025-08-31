import Header from "../../header/Header";
import LeftNav from "../../navbar/LeftNav";
import RouterAdmin from "../../routers/RounterAdmin";

function Main() {
  return (
    <div>
      <Header />
      <div className="flex gap-5">
        <LeftNav />
        <div className="flex-1">
          <RouterAdmin />
        </div>
      </div>
    </div>
  );
}

export default Main;
