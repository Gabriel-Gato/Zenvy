package com.Zenvy.controllers;

import com.Zenvy.models.Imovel;
import com.Zenvy.services.ImovelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/imoveis")
@RequiredArgsConstructor
public class ImovelController {

    private final ImovelService imovelService;

    @PostMapping("/cadastrar")
    @PreAuthorize("hasAuthority('ROLE_ANFITRIAO')")
    public ResponseEntity<Imovel> cadastrar(@RequestBody Imovel imovel) {
        var novoImovel = imovelService.cadastrar(imovel);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoImovel);
    }

    @PostMapping("/uploadImagem/{id}")
    @PreAuthorize("hasAuthority('ROLE_ANFITRIAO')")
    public ResponseEntity<Imovel> uploadImagem(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {

        var imovelAtualizado = imovelService.salvarImagem(id, file);
        return ResponseEntity.ok(imovelAtualizado);
    }

    @GetMapping("/{id}")

    public ResponseEntity<Imovel> buscarPorId(@PathVariable Long id) {
        var imovel = imovelService.buscarPorId(id);
        return ResponseEntity.ok(imovel);
    }

    @GetMapping("/listar")
    @PreAuthorize("hasAuthority('ROLE_ANFITRIAO')")
    public ResponseEntity<List<Imovel>> listarTodos() {
        return ResponseEntity.ok(imovelService.listarTodos());
    }

    @PutMapping("/atualizar/{id}")
    @PreAuthorize("hasAuthority('ROLE_ANFITRIAO')")
    public ResponseEntity<Imovel> atualizar(
            @PathVariable Long id,
            @RequestBody Imovel imovelAtualizado) {

        var imovel = imovelService.atualizar(id, imovelAtualizado);
        return ResponseEntity.ok(imovel);
    }

    @DeleteMapping("/deletar/{id}")
    @PreAuthorize("hasAuthority('ROLE_ANFITRIAO')")
    public ResponseEntity<Void> deletarPorId(@PathVariable Long id) {
        imovelService.deletarPorId(id);
        return ResponseEntity.noContent().build();
    }
}