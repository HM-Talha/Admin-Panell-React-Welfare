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

const Datatable = ({ childProp, adminUi }) => {
  console.log("--->CHILD PROP: ", childProp);
  console.log(adminUi);
  const [data, setData] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "users"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const createAndDownloadPdf = (obj) => {
    axios
      .post("https://registrationapp11.herokuapp.com/create-pdf", obj)
      // axios.post('/create-pdf', formData)
      .then(() =>
        axios.get("https://registrationapp11.herokuapp.com/fetch-pdf", {
          responseType: "blob",
        })
      )
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        saveAs(pdfBlob, "newPdf.pdf");
      });
  };

  const downloadPDF = async (id) => {
    try {
      const docSnap = await getDoc(doc(db, "users", id));
      if (docSnap.exists()) {
        let name = docSnap.data().name;
        let fatherName = docSnap.data().fatherName;
        let cnic = docSnap.data().cnic;
        let designation = docSnap.data().designation;
        let issueDate = docSnap.data().issueDate;
        let expireDate = docSnap.data().expireDate;
        let image = docSnap.data().image;

        createAndDownloadPdf({
          name,
          fatherName,
          cnic,
          designation,
          issueDate,
          expireDate,
          image,
        });
      } else {
        console.log("Document Not Found !!!");
      }
    } catch (error) {
      console.log(error);
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
                  onClick={() => downloadPDF(params.row.id)}
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
          User
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

export default Datatable;
