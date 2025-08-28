import React from 'react';
import { Paper, Table, TableHead, TableBody, TableRow, TableCell, Typography, Box } from '@mui/material';

export default function RecentActivityTable({ rows }) {
  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Atividade Recente
      </Typography>
      <Table size="small" aria-label="atividade recente">
        <TableHead>
          <TableRow>
            <TableCell>Descrição</TableCell>
            <TableCell align="right">Quando</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r, i) => (
            <TableRow key={i} hover>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  {r.icon}
                  <Typography variant="body2">{r.desc}</Typography>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Typography variant="caption" color="text.secondary">{r.time}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
