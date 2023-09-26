import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import {
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Create,
} from "@mui/icons-material";

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
    return record.id == editedRecordId;
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
      <Box
        sx={{
          marginTop: 3,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2>Список записей</h2>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<Create />}
          component={Link}
          to="/create"
        >
          Создать запись
        </Button>
      </Box>

      <div style={{ width: "100%", mb: 2 }}>
        <DataGrid
          rows={records}
          columns={[
            { field: "name", headerName: "Имя", width: 100 },
            { field: "phone", headerName: "Номер телефона", width: 150 },
            { field: "email", headerName: "Email", width: 150 },
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
            { field: "created_date", headerName: "Дата создания", width: 170 },
            {
              field: "updated_date",
              headerName: "Дата редактирования",
              width: 170,
            },
            {
              field: "actions",
              headerName: "",
              sortable: false,
              disableColumnMenu: true,
              disableColumnFilter: true,
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
            return isRecordEdited(params.row) ? "Mui-selected" : "";
          }}
        />
      </div>

      <Dialog open={deleteModalVisible}>
        <DialogTitle>Удаление записи</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить эту запись?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmDelete} color="primary">
            Удалить
          </Button>
          <Button onClick={cancelDelete} color="primary">
            Отмена
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RecordList;
