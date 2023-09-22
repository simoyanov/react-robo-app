import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material"; // Импорт иконки Material-UI

function RecordList() {
  const [records, setRecords] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  useEffect(() => {
    axios
      .get("/api/records")
      .then((response) => {
        setRecords(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Ошибка при получении данных:", error);
      });
  }, []);

  const updateRecordList = () => {
    axios.get("/api/records").then((response) => {
      setRecords(response.data);
    });
  };

  const handleDelete = (record) => {
    setRecordToDelete(record);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (recordToDelete) {
      axios
        .delete(`/api/records/${recordToDelete.id}`)
        .then(() => {
          updateRecordList();
          setRecordToDelete(null);
          setDeleteModalVisible(false);
        })
        .catch((error) => {
          console.error("Ошибка при удалении данных:", error);
        });
    }
  };

  const cancelDelete = () => {
    setRecordToDelete(null);
    setDeleteModalVisible(false);
  };

  const columns = [
    { field: "firstName", headerName: "First name", width: 130 },
  ];

  return (
    <div>
      <h2>Список записей</h2>
      {/* <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Имя</TableCell>
            <TableCell>Номер телефона</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Страна</TableCell>
            <TableCell>Штат</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.name}</TableCell>
              <TableCell>{record.phone}</TableCell>
              <TableCell>{record.email}</TableCell>
              <TableCell>{record.country}</TableCell>
              <TableCell>{record.state}</TableCell>
              <TableCell>
                <Link to={`/edit/${record.id}`}>
                  <IconButton edge="end" aria-label="edit">
                    <EditIcon />
                  </IconButton>
                </Link>
              </TableCell>
              <TableCell>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(record)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={records}
          columns={[
            { field: "name", headerName: "Имя", width: 200 },
            { field: "phone", headerName: "Номер телефона", width: 200 },
            { field: "email", headerName: "Email", width: 250 },
            { field: "country", headerName: "Страна", width: 250 },
            { field: "state", headerName: "Штат", width: 250 },
            {
              field: "actions",
              headerName: "Действия",
              width: 150,
              renderCell: (params) => (
                <div>
                  <Link to={`/edit/${params.row.id}`}>
                    <IconButton color="primary" aria-label="edit">
                      <EditIcon />
                    </IconButton>
                  </Link>
                  <IconButton
                    color="secondary"
                    aria-label="delete"
                    onClick={() => handleDelete(params.row)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              ),
            },
          ]}
        />
      </div>
      {deleteModalVisible && (
        <DeleteConfirmationModal
          message={`Вы действительно хотите удалить запись "${recordToDelete.name}"?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}

export default RecordList;
