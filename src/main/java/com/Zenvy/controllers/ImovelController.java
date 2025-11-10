package com.Zenvy.controllers;

import com.Zenvy.dto.ImovelResponseDTO;
import com.Zenvy.models.Imovel;
import com.Zenvy.models.Usuario;
import com.Zenvy.services.ImovelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/imoveis")
@RequiredArgsConstructor
public class ImovelController {

    private final ImovelService imovelService;

    // ---------------------------------------------------
    // Cadastrar imóvel (vinculado ao usuário logado)
    // ---------------------------------------------------
    @PostMapping("/cadastrar")
    @PreAuthorize("hasAuthority('ROLE_ANFITRIAO')")
    public ResponseEntity<Imovel> cadastrar(@RequestBody Imovel imovel, Authentication authentication) {
        Usuario usuarioLogado = (Usuario) authentication.getPrincipal();
        imovel.setAnfitriao(usuarioLogado);

        var novoImovel = imovelService.cadastrar(imovel);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoImovel);
    }

    // ---------------------------------------------------
    // Upload de múltiplas imagens (ou apenas uma)
    // ---------------------------------------------------
    @PostMapping("/uploadImagens/{id}")
    @PreAuthorize("hasAuthority('ROLE_ANFITRIAO')")
    public ResponseEntity<Imovel> uploadImagens(
            @PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files) throws IOException {

        if (files == null || files.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        var imovelAtualizado = imovelService.salvarImagens(id, files);
        return ResponseEntity.ok(imovelAtualizado);
    }

    // ✅ Mantém compatibilidade com upload único (caso o front ainda use)
    @PostMapping("/uploadImagem/{id}")
    @PreAuthorize("hasAuthority('ROLE_ANFITRIAO')")
    public ResponseEntity<Imovel> uploadImagem(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {

        var imovelAtualizado = imovelService.salvarImagens(id, List.of(file));
        return ResponseEntity.ok(imovelAtualizado);
    }

    // ---------------------------------------------------
    // Buscar imóvel por ID
    // ---------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<Imovel> buscarPorId(@PathVariable Long id) {
        var imovel = imovelService.buscarPorId(id);
        return ResponseEntity.ok(imovel);
    }

    // ---------------------------------------------------
    // Listar todos os imóveis (com DTOs)
    // ---------------------------------------------------
    @GetMapping("/listar")
    @PreAuthorize("hasAuthority('ROLE_ANFITRIAO')")
    public ResponseEntity<List<ImovelResponseDTO>> listarTodos() {
        return ResponseEntity.ok(imovelService.listarTodos());
    }

    // ---------------------------------------------------
    // Atualizar imóvel
    // ---------------------------------------------------
    @PutMapping("/atualizar/{id}")
    @PreAuthorize("hasAuthority('ROLE_ANFITRIAO')")
    public ResponseEntity<Imovel> atualizar(
            @PathVariable Long id,
            @RequestBody Imovel imovelAtualizado) {

        var imovel = imovelService.atualizar(id, imovelAtualizado);
        return ResponseEntity.ok(imovel);
    }

    // ---------------------------------------------------
    // Deletar imóvel
    // ---------------------------------------------------
    @DeleteMapping("/deletar/{id}")
    @PreAuthorize("hasAuthority('ROLE_ANFITRIAO')")
    public ResponseEntity<Void> deletarPorId(@PathVariable Long id) {
        imovelService.deletarPorId(id);
        return ResponseEntity.noContent().build();
    }
}
