import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Imagem from "../../assets/logor.png";

const Navbar = () => {
  return (
    <AppBar position="static" color="inherit" elevation={2} sx={{ mb: 0, borderRadius: 0 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: { xs: 1, md: 4 } }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img src={Imagem} alt="Logo" style={{ width: 40, height: 40, borderRadius: 8, marginRight: 12 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
            Vacinici
          </Typography>
        </Box>
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          <Button href="/entrar" color="primary" variant="outlined" sx={{ borderRadius: 2, fontWeight: 600 }}>
            Entrar
          </Button>
          <Button href="#" color="primary" sx={{ borderRadius: 2, fontWeight: 600 }}>
            Sobre
          </Button>
          <Button href="#" color="primary" sx={{ borderRadius: 2, fontWeight: 600 }}>
            Contato
          </Button>
        </Box>
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton color="primary">
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;