import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Datatable2 from "../../components/datatable/Datatable2";
import Datatable from "../../components/datatable/Datatable";

import { useEffect, useState } from "react";

const List = ({ adminUi, setAdminUi }) => {
  // console.log(adminUi);
  const [childProp, setChildProp] = useState("");
  const [isTrue, setIsTrue] = useState(true);

  return (
    <div className="list">
      <Sidebar adminUi={adminUi} setAdminUi={setAdminUi} />
      <div className="listContainer">
        <Navbar setChildProp={setChildProp} setIsTrue={setIsTrue} />
        <div className="table">
          {isTrue ? (
            <Datatable adminUi={adminUi} />
          ) : (
            <Datatable2 childProp={childProp} adminUi={adminUi} />
          )}
        </div>
      </div>
    </div>
  );
};

export default List;
