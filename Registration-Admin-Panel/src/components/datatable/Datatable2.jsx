import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  getDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import axios from "axios";
import { triggerBase64Download } from "common-base64-downloader-react";

const Datatable2 = ({ childProp, adminUi }) => {
  const [data, setData] = useState([]);
  console.log(adminUi);
  console.log("--->CHILD PROP: ", childProp);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "users"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          console.log("DOCID", doc.id);
          console.log("CHILDPROP", childProp);

          if (doc.id == childProp) {
            list.push({ id: doc.id, ...doc.data() });
          }
          console.log("--xyz-->", doc.id, childProp);
        });
        setData(list);
        console.log("List is here-->", list);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, [childProp]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handlePdf = async (id) => {
    try {
      const docSnap = await getDoc(doc(db, "users", id));
      if (docSnap.exists()) {
        console.log("Document Name:", docSnap.data()[1]);
        console.log("Document Email:", docSnap.data()[2]);
        console.log("Document Number:", docSnap.data()[3]);
        console.log("Document NIC:", docSnap.data()[5]);

        const name = docSnap.data()[1];
        const email = docSnap.data()[2];
        const phone = docSnap.data()[3];
        const cnic = docSnap.data()[5];

        axios
          .post("https://registration3-backend-pdf.herokuapp.com/api/v1/pdf", {
            name,
            email,
            phone,
            cnic,
          })

          .then((res) => {
            console.log("Result--->-->", res.data);
            console.log("Result2--->-->", res);

            const base64 = `data:application/pdf;base64,${res.data}`;
            triggerBase64Download(base64, "xyz");
          })
          .catch((e) => {
            console.log(`Api error ${e}`);
          });
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 225,
      renderCell: (params) => {
        return (
          <>
            {adminUi && (
              <div className="cellAction">
                <Link to="/users/test" style={{ textDecoration: "none" }}>
                  <div className="viewButton">View</div>
                </Link>
                <div
                  className="deleteButton"
                  onClick={() => handleDelete(params.row.id)}
                >
                  Delete
                </div>
                <div
                  className="pdfButton"
                  onClick={() => handlePdf(params.row.id)}
                >
                  Download
                </div>
              </div>
            )}
          </>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      {adminUi && (
        <div className="datatableTitle">
          Add New User
          <Link to="/users/new" className="link">
            Add New
          </Link>
        </div>
      )}
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
};

export default Datatable2;
