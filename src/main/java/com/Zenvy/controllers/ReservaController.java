package com.Zenvy.controllers;

import com.Zenvy.dto.ReservaDTO;
import com.Zenvy.models.Reserva;
import com.Zenvy.models.Usuario;
import com.Zenvy.services.ReservaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/reservas")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService reservaService;

    @PostMapping("/criar/{imovelId}")
    public ResponseEntity<Reserva> criarReserva(
            @PathVariable Long imovelId,
            Authentication authentication,
            @RequestBody Reserva reserva) {

        Long hospedeId = ((Usuario) authentication.getPrincipal()).getId();

        var novaReserva = reservaService.criarReserva(imovelId, hospedeId, reserva);
        return ResponseEntity.ok(novaReserva);
    }


    @GetMapping("/listar")
    public ResponseEntity<List<ReservaDTO>> listarTodas() {
        List<Reserva> reservas = reservaService.listarTodas();
        List<ReservaDTO> dtos = reservas.stream()
                .map(ReservaDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }


    @GetMapping("/listarPorHospede/{hospedeId}")
    public ResponseEntity<List<ReservaDTO>> listarPorHospede(@PathVariable Long hospedeId) {
        List<Reserva> reservas = reservaService.listarPorHospede(hospedeId);
        List<ReservaDTO> dto = reservas.stream()
                .map(ReservaDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/minhas")
    @PreAuthorize("hasAuthority('ROLE_HOSPEDE')")
    public ResponseEntity<List<ReservaDTO>> minhasReservas(Authentication authentication) {
        Usuario usuarioLogado = (Usuario) authentication.getPrincipal();
        List<Reserva> reservas = reservaService.listarPorHospede(usuarioLogado.getId());
        List<ReservaDTO> dto = reservas.stream().map(ReservaDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/confirmar/{id}")
    @PreAuthorize("hasAuthority('ROLE_ANFITRIAO')")
    public ResponseEntity<Reserva> confirmarReserva(@PathVariable Long id) {
        return ResponseEntity.ok(reservaService.confirmarReserva(id));
    }



    @GetMapping("/listarPorImovel/{imovelId}")
    public ResponseEntity<List<ReservaDTO>> listarPorImovel(@PathVariable Long imovelId) {

        List<Reserva> reservas = reservaService.listarPorImovel(imovelId);

        List<ReservaDTO> dtos = reservas.stream()
                .map(ReservaDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
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
