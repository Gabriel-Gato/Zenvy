package com.Zenvy.controllers;

import com.Zenvy.dto.ReservaDTO;
import com.Zenvy.models.Reserva;
import com.Zenvy.services.ReservaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/reservas")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService reservaService;

    @PostMapping("/criar/{imovelId}/{hospedeId}")
    public ResponseEntity<Reserva> criarReserva(
            @PathVariable Long imovelId,
            @PathVariable Long hospedeId,
            @RequestBody Reserva reserva) {

        var novaReserva = reservaService.criarReserva(imovelId, hospedeId, reserva);
        return ResponseEntity.ok(novaReserva);
    }

    @GetMapping("/listar")
    public ResponseEntity<List<Reserva>> listarTodas() {
        return ResponseEntity.ok(reservaService.listarTodas());
    }

    @GetMapping("/listarPorHospede/{hospedeId}")
    public ResponseEntity<List<ReservaDTO>> listarPorHospede(@PathVariable Long hospedeId) {
        List<Reserva> reservas = reservaService.listarPorHospede(hospedeId);
        List<ReservaDTO> dto = reservas.stream()
                .map(ReservaDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dto);
    }




    @GetMapping("/listarPorImovel/{imovelId}")
    public ResponseEntity<List<Reserva>> listarPorImovel(@PathVariable Long imovelId) {
        return ResponseEntity.ok(reservaService.listarPorImovel(imovelId));
    }

    @PutMapping("/atualizar/{id}")
    public ResponseEntity<Reserva> atualizar(
            @PathVariable Long id,
            @RequestBody Reserva reservaAtualizada) {

        var reserva = reservaService.atualizar(id, reservaAtualizada);
        return ResponseEntity.ok(reserva);
    }

    @PutMapping("/cancelar/{id}")
    public ResponseEntity<Void> cancelarReserva(@PathVariable Long id) {
        reservaService.cancelarReserva(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        reservaService.deletarPorId(id);
        return ResponseEntity.noContent().build();
    }
}
