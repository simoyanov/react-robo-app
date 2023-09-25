import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material"; // Импорт иконки Material-UI

function RecordList() {
  const location = useLocation();
  const [editedRecordId, setEditedRecordId] = useState(null);
  const [records, setRecords] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  useEffect(() => {
    axios
      .get("/api/records")
      .then((response) => {
        setRecords(response.data);
      })
      .catch((error) => {
        console.error("Ошибка при получении данных:", error);
      });
  }, []);

  useEffect(() => {
    const { editedRecordId } = location.state || {};
    if (editedRecordId) {
      setEditedRecordId(editedRecordId);
    }
  }, [location.state]);

  const isRecordEdited = (record) => {
    return record.id === editedRecordId;
  };
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

  return (
    <div>
      <h2>Список записей</h2>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={records}
          columns={[
            { field: "name", headerName: "Имя", width: 150 },
            { field: "phone", headerName: "Номер телефона", width: 150 },
            { field: "email", headerName: "Email", width: 200 },
            {
              field: "country",
              headerName: "Страна",
              width: 150,
              sortable: true,
              sortComparator: (country1, country2, param1, param2) => {
                const direction = param1.api.getSortModel()[0].sort;

                const state1 = param1.api.getCellValue(param1.id, "state");
                const state2 = param2.api.getCellValue(param2.id, "state");

                if (country1 && country2) {
                  const countryComparison = country1.localeCompare(country2);
                  if (countryComparison !== 0) {
                    return countryComparison;
                  }
                }

                if (state1 && state2) {
                  return direction === "asc"
                    ? state1.localeCompare(state2)
                    : -state1.localeCompare(state2);
                }

                return 0;
              },
            },
            {
              field: "state",
              headerName: "Штат",
              width: 150,
              sortable: true,
            },
            { field: "created_date", headerName: "Дата создания", width: 200 },
            {
              field: "updated_date",
              headerName: "Дата редактирования",
              width: 200,
            },
            {
              field: "actions",
              headerName: "Действия",
              sortable: false,
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
          hideFooterPagination
          hideFooterSelectedRowCount
          getRowClassName={(params) => {
            return isRecordEdited(params.row) ? "edited-record" : "";
          }}
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
