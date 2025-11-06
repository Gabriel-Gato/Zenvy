package com.Zenvy.controllers;

import com.Zenvy.models.Mensagem;
import com.Zenvy.services.MensagemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mensagens")
@RequiredArgsConstructor
public class MensagemController {

    private final MensagemService mensagemService;

    @PostMapping("/enviar")
    public ResponseEntity<Mensagem> enviarMensagem(@RequestBody @Valid Mensagem mensagem) {
        var novaMensagem = mensagemService.enviarMensagem(mensagem);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaMensagem);
    }

    @GetMapping("/recebidas/{destinatarioId}")
    public ResponseEntity<List<Mensagem>> listarMensagensRecebidas(
            @PathVariable Long destinatarioId) {
        return ResponseEntity.ok(mensagemService.listarMensagensRecebidas(destinatarioId));
    }

    @GetMapping("/enviadas/{remetenteId}")
    public ResponseEntity<List<Mensagem>> listarMensagensEnviadas(
            @PathVariable Long remetenteId) {
        return ResponseEntity.ok(mensagemService.listarMensagensEnviadas(remetenteId));
    }

    @PutMapping("/marcarComoLida/{id}")
    public ResponseEntity<Mensagem> marcarComoLida(@PathVariable Long id) {
        var mensagem = mensagemService.marcarComoLida(id);
        return ResponseEntity.ok(mensagem);
    }

    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<Void> deletarMensagem(@PathVariable Long id) {
        mensagemService.deletarMensagem(id);
        return ResponseEntity.noContent().build();
    }
}
