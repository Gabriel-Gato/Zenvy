package com.Zenvy.controllers;

import com.Zenvy.Model.Reserva;
import com.Zenvy.Service.ReservaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

        Reserva novaReserva = reservaService.criarReserva(imovelId, hospedeId, reserva);
        return ResponseEntity.ok(novaReserva);
    }

    @GetMapping("/listar")
    public ResponseEntity<List<Reserva>> listarTodas() {
        return ResponseEntity.ok(reservaService.listarTodas());
    }

    @GetMapping("/listarPorHospede/{hospedeId}")
    public ResponseEntity<List<Reserva>> listarPorHospede(@PathVariable Long hospedeId) {
        return ResponseEntity.ok(reservaService.listarPorHospede(hospedeId));
    }

    @GetMapping("/listarPorImovel/{imovelId}")
    public ResponseEntity<List<Reserva>> listarPorImovel(@PathVariable Long imovelId) {
        return ResponseEntity.ok(reservaService.listarPorImovel(imovelId));
    }

    @PutMapping("/atualizar/{id}")
    public ResponseEntity<Reserva> atualizar(
            @PathVariable Long id,
            @RequestBody Reserva reservaAtualizada) {

        Reserva reserva = reservaService.atualizar(id, reservaAtualizada);
        return ResponseEntity.ok(reserva);
    }

    @PutMapping("/cancelar/{id}")
    public ResponseEntity<Void> cancelarReserva(@PathVariable Long id) {
        reservaService.cancelarReserva(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        reservaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
