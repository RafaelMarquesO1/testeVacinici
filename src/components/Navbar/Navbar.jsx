import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Container, Stack } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Imagem from "../../assets/logor.png";

const Navbar = () => {
  return (
    <AppBar position="sticky" elevation={0} enableColorOnDark>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between", py: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src={Imagem} alt="Logo Vacinici" style={{ width: 40, height: 40, borderRadius: 8, marginRight: 12 }} />
            <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '-0.3px' }}>
              Vacinici
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} sx={{ display: { xs: "none", md: "flex" } }}>
            <Button href="/" variant="text" color="inherit" sx={{ px: 2 }}>Início</Button>
            <Button href="#sobre" variant="text" color="inherit" sx={{ px: 2 }}>Sobre</Button>
            <Button href="#contato" variant="text" color="inherit" sx={{ px: 2 }}>Contato</Button>
            <Button href="/entrar" variant="contained" color="secondary" sx={{ ml: 1 }}>Entrar</Button>
          </Stack>

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton color="inherit" aria-label="abrir menu">
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;