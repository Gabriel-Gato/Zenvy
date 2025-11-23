package com.Zenvy.controllers;

import com.Zenvy.dto.AlterarSenhaRequest;
import com.Zenvy.dto.AuthResponse;
import com.Zenvy.dto.LoginRequest;
import com.Zenvy.dto.UsuarioDTO;
import com.Zenvy.models.Usuario;
import com.Zenvy.services.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping("/cadastrar")
    public ResponseEntity<Usuario> cadastrar(@RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.cadastrar(usuario));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody @Valid LoginRequest loginRequest) {

        return ResponseEntity.ok(
                usuarioService.autenticar(
                        loginRequest.email(),
                        loginRequest.senha()
                )
        );
    }
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestParam String refreshToken) {
        return ResponseEntity.ok(usuarioService.refreshToken(refreshToken));
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioDTO> getMe(Authentication authentication) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        return ResponseEntity.ok(new UsuarioDTO(usuario));
    }

    @PutMapping("/me")
    public ResponseEntity<Usuario> atualizarMe(Authentication authentication,
                                               @RequestBody Usuario usuarioAtualizado) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        Usuario atualizado = usuarioService.atualizar(usuario.getId(), usuarioAtualizado);
        return ResponseEntity.ok(atualizado);
    }

    @PutMapping("/me/foto")
    public ResponseEntity<Usuario> uploadFotoMe(Authentication authentication,
                                                @RequestParam("file") MultipartFile file) throws IOException {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        Usuario atualizado = usuarioService.salvarImagem(usuario.getId(), file);
        return ResponseEntity.ok(atualizado);
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        return ResponseEntity.ok(usuarioService.listartodos());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        usuarioService.deletarPorId(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/me/senha")
    public ResponseEntity<Void> alterarSenha(Authentication authentication,
                                             @RequestBody AlterarSenhaRequest request) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        usuarioService.alterarSenha(usuario.getId(), request.currentPassword(), request.newPassword());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deletarMe(Authentication authentication) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        usuarioService.deletarPorId(usuario.getId());
        return ResponseEntity.noContent().build();
    }

}