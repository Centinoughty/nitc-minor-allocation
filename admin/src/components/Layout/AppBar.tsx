import { AppBar, Button, TitlePortal, UserMenu } from "react-admin";
import { Box, useMediaQuery, Theme } from "@mui/material";
import Logo from "./Logo";
import { TextField } from '@mui/material'
import React, { useEffect, useState } from "react";
import { useStudentsRange } from "../../context/StudentsRangeContext";
import { HiUpload } from "react-icons/hi";

const CustomAppBar = () => {
  const isLargeEnough = useMediaQuery<Theme>((theme) =>
    theme.breakpoints.up("sm"),
  );

  const minSt = localStorage.getItem("minStudents");
  const maxSt = localStorage.getItem("maxStudents");
  const [minStudents, setMinStudents] = useState(minSt ? parseInt(minSt) : 0);
  const [maxStudents, setMaxStudents] = useState(maxSt ? parseInt(maxSt) : 0);

  useEffect(() => {
    localStorage.setItem("minStudents", String(minStudents));
    localStorage.setItem("maxStudents", String(maxStudents));
  }, [minStudents, maxStudents]);

  const handleMinChange = (e: any) => {
    setMinStudents(parseInt(e.target.value));
  }

  const handleMaxChange = (e: any) => {
    setMaxStudents(parseInt(e.target.value));
  }

  return (
    <div style={{
      height: 20
    }}>
      <AppBar color="secondary">
        <TitlePortal />
        {isLargeEnough && <Logo />}
        {isLargeEnough && <Box component="span" sx={{ flex: 1 }} />}
        <div
          style={{
            display: 'flex',
            marginRight: '20px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px'
          }}>
          <TextField
            label="Min"
            size="small"
            value={minStudents}
            variant="outlined"
            onChange={handleMinChange}
            type="number"
            style={{ width: "90px" }}
            inputProps={{
              style: { WebkitAppearance: "none", MozAppearance: "textfield" },
            }}
          />
          <TextField
            label="Max"
            size="small"
            type="number"
            variant="outlined"
            value={maxStudents}
            onChange={handleMaxChange}
            style={{ width: "90px" }}
            inputProps={{
              style: { WebkitAppearance: "none", MozAppearance: "textfield" },
            }}
          />
          <Button
            variant="contained"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '36px',
              height: '36px',
              minWidth: '36px',
              padding: '0 15px',
              paddingLeft: '25px',
              borderRadius: '8px',
              backgroundColor: '#007bff',
              '&:hover': {
                backgroundColor: '#0056b3',
              },
            }}
            onClick={() => {
              window.location.reload();
            }}
          >
            <HiUpload size={25} color="white" style={{ margin: '0' }} />
          </Button>
        </div>
      </AppBar>
    </div>
  );
};

export default CustomAppBar;
