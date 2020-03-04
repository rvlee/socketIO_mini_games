import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import joinTableHeader from '../constant/table/joinTableHeader';
import { getRooms } from '../utils/api';

require('../css/joinTable.css')

let intialApiGet = false;

const joinTable = (props) => {
  const [tableInfo, setTableInfo] = useState([])
  const [apiCall, setApiCall] = useState(false); 

  const getRoomApiCall = () => {
    getRooms(parseRoomData)
  }

  useEffect(() => {
    if (!apiCall) {
      getRoomApiCall()
      setApiCall(true);
    }
  })

  const parseRoomData = (response) => {
    let tableData = [];
    for(let key in response.data) {
      tableData.push(response.data[key]);
    }
    setTableInfo(tableData)
  }

  return (
  <TableContainer component={Paper}>
      <button onClick={getRoomApiCall}>Refresh</button>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
          {
            joinTableHeader.map((header) => {
              return <TableCell align="center">{header.label}</TableCell>
            })
          }
          </TableRow>
        </TableHead>
        <TableBody>
        {
          tableInfo.map((data, index) => {
            return (
              <TableRow key={index}>
                <TableCell align="center">{data.game}</TableCell>
                <TableCell align="center">{data.room}</TableCell>
                <TableCell align="right">
                  <div className="join-btn">
                    <button onClick={() => { props.handleModalClick(data.room)}}>Join</button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })
        }
          {/* {rows.map(row => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))} */}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default joinTable;