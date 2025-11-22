package com.Zenvy.controllers;

import com.Zenvy.dto.MensagemDTO;
import com.Zenvy.models.Mensagem;
import com.Zenvy.models.Usuario;
import com.Zenvy.repositories.UsuarioRepository;
import com.Zenvy.services.MensagemService;
import com.Zenvy.services.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/mensagens")
@RequiredArgsConstructor
public class MensagemController {

    private final MensagemService mensagemService;
    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;

    @PostMapping("/enviar/{reservaId}")
    public ResponseEntity<MensagemDTO> enviarMensagem(
            @PathVariable Long reservaId,
            @RequestBody Map<String, String> body,
            Authentication authentication
    ) {
        String email = authentication.getName();

        String conteudo = body.get("conteudo");
        Mensagem nova = mensagemService.enviarMensagem(reservaId, conteudo, email);


        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        Long idUsuarioLogado = usuario.getId();


        MensagemDTO dto = new MensagemDTO(nova, idUsuarioLogado);

        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
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

    @GetMapping("/reserva/{reservaId}")
    public ResponseEntity<List<MensagemDTO>> listarPorReserva(
            @PathVariable Long reservaId,
            Authentication authentication) {


        String emailUsuarioLogado = authentication.getName();


        Usuario usuario = usuarioRepository.findByEmail(emailUsuarioLogado)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Long idUsuarioLogado = usuario.getId();


        List<Mensagem> mensagens = mensagemService.listarPorReserva(reservaId);


        List<MensagemDTO> dtos = mensagens.stream()
                .map(msg -> new MensagemDTO(msg, idUsuarioLogado))
                .toList();

        return ResponseEntity.ok(dtos);
    }



}
